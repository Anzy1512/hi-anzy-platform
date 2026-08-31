"""hiAnzy — FastAPI backend.
CMS-like content APIs + contact pipeline + analytics events.
Email notifications are env-driven (RESEND_API_KEY or SMTP_*) and skip
gracefully when unconfigured — submissions are always stored in MongoDB.
"""
from fastapi import FastAPI, APIRouter, HTTPException, Request, Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import json
import time
import logging
import asyncio
import smtplib
from enum import Enum
from email.mime.text import MIMEText
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import requests as http_requests

from seed_data import CASE_STUDIES, NETWORK_RESOURCES, INSIGHTS, PORTFOLIO_GROUPS, ECOSYSTEM_ITEMS

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

# ── Environment posture ──────────────────────────────────────────────────────
# Anything not explicitly "development" is treated as production, so a missing
# or misspelled env var fails closed rather than exposing the schema.
ENVIRONMENT = os.environ.get("ENVIRONMENT", "production").strip().lower()
IS_PRODUCTION = ENVIRONMENT not in {"development", "dev", "local"}

# Interactive docs describe every route and model — useful locally, an
# invitation to enumerate the API in production.
app = FastAPI(
    title="hiAnzy API",
    docs_url=None if IS_PRODUCTION else "/docs",
    redoc_url=None if IS_PRODUCTION else "/redoc",
    openapi_url=None if IS_PRODUCTION else "/openapi.json",
)
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("hi-anzy")


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def clean(doc: dict) -> dict:
    doc = dict(doc)
    doc.pop("_id", None)
    return doc


# ── Pydantic models ──────────────────────────────────────────────────────────

class ContactCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    message: str = Field(..., min_length=10, max_length=4000)
    company: Optional[str] = Field(None, max_length=200)
    role: Optional[str] = Field(None, max_length=200)
    website: Optional[str] = Field(None, max_length=300)
    stage: Optional[str] = Field(None, max_length=200)
    investmentRange: Optional[str] = Field(None, max_length=200)
    timeline: Optional[str] = Field(None, max_length=200)
    phone: Optional[str] = Field(None, max_length=40)
    orgField: Optional[str] = None  # honeypot


class SubscribeCreate(BaseModel):
    email: EmailStr
    # Which page the reader was on when they subscribed. Useful for knowing
    # which note actually earned the address; never required.
    source: Optional[str] = Field(None, max_length=120)
    orgField: Optional[str] = None  # honeypot


# Every event name the frontend is known to fire, plus the Hi Anzy Orbit /
# ecosystem / Coming Soon events this branch adds. An unlisted name is
# rejected (422) rather than silently recorded — the frontend's own track()
# already swallows non-2xx responses (lib/api.js), so this costs nothing
# downstream and closes off arbitrary event injection.
ALLOWED_EVENTS = {
    # existing, in real use across the site today (grepped from every
    # track("...") call site)
    "cta_primary_click", "method_explored", "service_explored", "diagnostic_cta_click",
    "case_opened", "network_category_selected", "discipline_opened", "network_deep_dive",
    "network_profile_opened", "resource_requested", "contact_started", "contact_form_abandoned",
    "contact_validation_failed", "contact_completed", "service_to_case", "portfolio_item_opened",
    "case_expanded", "case_to_service", "command_palette_opened", "command_palette_navigate",
    "notes_subscribed", "next_step_click", "package_module_added", "package_brief_sent",
    "package_stage_opened", "theme_changed", "discipline_cross_link", "article_read_depth",
    # new — Hi Anzy Orbit / ecosystem / Coming Soon
    "orbit_viewed", "orbit_category_changed", "orbit_card_dragged", "orbit_category_opened",
    "ecosystem_index_viewed", "ecosystem_profile_opened", "ecosystem_filter_used",
    "coming_soon_viewed", "hianzy_ai_teaser_clicked", "imkaan_teaser_clicked",
}

ANALYTICS_META_MAX_KEYS = 20
ANALYTICS_META_MAX_KEY_LEN = 60
ANALYTICS_META_MAX_STR_LEN = 500
ANALYTICS_META_MAX_BYTES = 4096


class AnalyticsEvent(BaseModel):
    name: str
    path: Optional[str] = Field(None, max_length=200)
    meta: Optional[Dict[str, Any]] = None

    @field_validator("name")
    @classmethod
    def name_must_be_allowed(cls, v: str) -> str:
        if v not in ALLOWED_EVENTS:
            raise ValueError("unknown event name")
        return v

    @field_validator("path")
    @classmethod
    def path_must_look_like_a_path(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not v.startswith("/"):
            raise ValueError("path must start with '/'")
        return v

    @field_validator("meta")
    @classmethod
    def meta_must_be_shallow_and_bounded(cls, v: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
        if v is None:
            return v
        if len(v) > ANALYTICS_META_MAX_KEYS:
            raise ValueError(f"meta may carry at most {ANALYTICS_META_MAX_KEYS} keys")
        for key, value in v.items():
            if not isinstance(key, str) or len(key) > ANALYTICS_META_MAX_KEY_LEN:
                raise ValueError("meta key too long")
            # Scalars only — a nested object/array is exactly the shape that
            # turns "a bit of context" into an arbitrary write.
            if isinstance(value, (dict, list)):
                raise ValueError("meta values must be scalar (no nested objects/arrays)")
            if isinstance(value, str):
                if len(value) > ANALYTICS_META_MAX_STR_LEN:
                    raise ValueError("meta string value too long")
                if any(ord(c) < 32 or ord(c) == 127 for c in value):
                    raise ValueError("meta value contains control characters")
        if len(json.dumps(v, default=str)) > ANALYTICS_META_MAX_BYTES:
            raise ValueError("meta payload too large")
        return v


class EcosystemCategory(str, Enum):
    """The Hi Anzy Orbit's six categories. Deliberately coarser than
    network_resources.category (Strategy/Media/Venues/...) -- see
    seed_data.py's _ecosystem_category_for() for how one derives from the
    other."""
    built_here = "built_here"
    built_together = "built_together"
    collaborator = "collaborator"
    creator = "creator"
    venue = "venue"
    partner = "partner"


class Provenance(str, Enum):
    """The strict public relationship classification: never let a reader
    come away thinking network access is a client relationship, or that a
    collaborator's own past work is something hiAnzy delivered directly."""
    HI_ANZY_DIRECT = "HI_ANZY_DIRECT"
    HI_ANZY_COLLABORATOR = "HI_ANZY_COLLABORATOR"
    COLLABORATOR_CREDENTIAL = "COLLABORATOR_CREDENTIAL"
    NETWORK_ACCESS = "NETWORK_ACCESS"


class EcosystemItem(BaseModel):
    """Response shape for GET /api/ecosystem. Used as a response_model, not a
    request body -- there is no write endpoint; every record is derived from
    CASE_STUDIES/NETWORK_RESOURCES at seed time (seed_data.py). Validating on
    the way out still matters: it's what actually guarantees a public
    endpoint never serves a field nobody intended to expose."""
    id: str
    slug: str
    name: str
    category: EcosystemCategory
    relationshipType: str
    title: str
    shortDescription: str
    longDescription: Optional[str] = None
    image: Optional[str] = None
    gallery: List[str] = Field(default_factory=list)
    capabilities: List[str] = Field(default_factory=list)
    geography: List[str] = Field(default_factory=list)
    links: List[str] = Field(default_factory=list)
    featured: bool = False
    publicStatus: str
    lastVerified: str
    provenance: Provenance
    sortOrder: int
    # Escape hatch for Phase N's richer per-category detail fields (photo/
    # discipline for collaborators, capacity for venues, ...) once individual
    # detail routes exist -- avoids a schema migration to add them later.
    details: Optional[Dict[str, Any]] = None
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None


# ── Email ────────────────────────────────────────────────────────────────────

def _send_email_sync(subject: str, text: str, to: str, from_addr: str, **kwargs) -> bool:
    resend_key = os.environ.get("RESEND_API_KEY")
    if resend_key:
        try:
            resp = http_requests.post(
                "https://api.resend.com/emails",
                headers={"Authorization": f"Bearer {resend_key}", "Content-Type": "application/json"},
                json={"from": from_addr, "to": [to], "subject": subject, "text": text},
                timeout=10,
            )
            return resp.status_code == 200
        except Exception as e:
            logger.warning(f"Resend send failed: {e}")
            return False

    smtp_host = os.environ.get("SMTP_HOST")
    if smtp_host:
        try:
            smtp_port = int(os.environ.get("SMTP_PORT", 587))
            smtp_user = os.environ.get("SMTP_USER", "")
            smtp_pass = os.environ.get("SMTP_PASS", "")
            msg = MIMEText(text)
            msg["Subject"] = subject
            msg["From"] = from_addr
            msg["To"] = to
            with smtplib.SMTP(smtp_host, smtp_port) as s:
                s.starttls()
                if smtp_user:
                    s.login(smtp_user, smtp_pass)
                s.send_message(msg)
            return True
        except Exception as e:
            logger.warning(f"SMTP send failed: {e}")
            return False

    return False


async def send_email(subject: str, text: str) -> bool:
    notify_to = os.environ.get("CONTACT_NOTIFY_EMAIL")
    from_addr = os.environ.get("RESEND_FROM", os.environ.get("SMTP_USER", "noreply@hi-anzy.com"))
    if not notify_to:
        return False
    try:
        return await asyncio.get_event_loop().run_in_executor(
            None, lambda: _send_email_sync(subject, text, notify_to, from_addr)
        )
    except Exception as e:
        logger.warning(f"send_email error: {e}")
        return False


# ── Rate limiter ─────────────────────────────────────────────────────────────
# In-process, in-memory — correct for a single launch-stage worker. If the API
# is ever scaled to multiple processes the effective ceiling multiplies
# per-process, which would need a shared store (Redis or similar) at that
# point; not needed yet, and not worth the added infrastructure for a single
# worker. Keyed per (bucket, ip) so a chatty-but-legitimate analytics stream
# from one visitor can never exhaust the much stricter contact-form budget.

_rate: Dict[str, List[float]] = {}
_RATE_PRUNE_AFTER = 900  # comfortably longer than any bucket's own window


def rate_limited(bucket: str, ip: str, max_hits: int = 5, window_seconds: int = 600) -> bool:
    now = time.time()
    key = f"{bucket}:{ip}"
    hits = [t for t in _rate.get(key, []) if now - t < window_seconds]
    if len(hits) >= max_hits:
        _rate[key] = hits
        return True
    hits.append(now)
    _rate[key] = hits
    return False


async def _prune_rate_limiter_loop():
    """A plain dict keyed by every (bucket, ip) ever seen never shrinks on its
    own — each entry only gets re-filtered on its own next hit, so an IP that
    visits once and never returns leaves its key behind forever. Sweep out
    anything idle longer than the longest window any bucket uses, so a
    long-lived process doesn't grow without bound."""
    while True:
        await asyncio.sleep(_RATE_PRUNE_AFTER)
        now = time.time()
        stale = [k for k, hits in _rate.items() if not hits or now - hits[-1] >= _RATE_PRUNE_AFTER]
        for k in stale:
            _rate.pop(k, None)


# ── Routes ───────────────────────────────────────────────────────────────────

@api_router.get("/")
async def root():
    return {"service": "hiAnzy API", "status": "ok"}


@api_router.get("/health")
async def health():
    try:
        await db.command("ping")
        db_status = "connected"
    except Exception:
        db_status = "error"
    return {"status": "ok", "db": db_status}


@api_router.get("/case-studies")
async def list_case_studies(featured: Optional[bool] = None):
    query: Dict[str, Any] = {"published": True}
    if featured is not None:
        query["featured"] = featured
    cursor = db.case_studies.find(query, {"_id": 0, "body": 0}).sort("_id", 1)
    return await cursor.to_list(length=100)


@api_router.get("/case-studies/{slug}")
async def get_case_study(slug: str):
    doc = await db.case_studies.find_one({"slug": slug, "published": True}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Case study not found")
    return doc


@api_router.get("/network")
async def list_network(category: Optional[str] = None):
    query: Dict[str, Any] = {"publicStatus": "public"}
    if category:
        query["category"] = category
    cursor = db.network_resources.find(query, {"_id": 0}).sort("featured", -1)
    return await cursor.to_list(length=200)


@api_router.get("/network/categories")
async def network_categories():
    docs = await db.network_resources.find({"publicStatus": "public"}, {"_id": 0, "category": 1}).to_list(length=200)
    seen = []
    for d in docs:
        cat = d.get("category")
        if cat and cat not in seen:
            seen.append(cat)
    return {"categories": seen}


@api_router.get("/ecosystem", response_model=List[EcosystemItem])
async def list_ecosystem(category: Optional[EcosystemCategory] = None):
    """The Hi Anzy Orbit. Same publicStatus=="public" gating as /network;
    sortOrder (featured first, then original seed position) rather than a
    Mongo-side sort on "featured", since curatorial order is now baked into
    the field itself."""
    query: Dict[str, Any] = {"publicStatus": "public"}
    if category:
        query["category"] = category.value
    cursor = db.ecosystem_items.find(query, {"_id": 0}).sort("sortOrder", 1)
    return await cursor.to_list(length=100)


@api_router.get("/insights")
async def list_insights(category: Optional[str] = None):
    """The front end has always sent ?category= from the filter chips; the
    parameter was never read, so every chip returned the full list and the
    filter looked broken. Mirrors the /network contract."""
    query: Dict[str, Any] = {"published": True}
    if category:
        query["category"] = category
    cursor = db.insights.find(query, {"_id": 0, "body": 0}).sort("_id", -1)
    return await cursor.to_list(length=50)


@api_router.get("/insights/{slug}")
async def get_insight(slug: str):
    doc = await db.insights.find_one({"slug": slug, "published": True}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Insight not found")
    return doc


@api_router.get("/portfolio")
async def list_portfolio():
    cursor = db.portfolio_groups.find({}, {"_id": 0}).sort("_id", 1)
    return await cursor.to_list(length=20)


@api_router.post("/contact")
async def create_contact(payload: ContactCreate, request: Request):
    ip = request.client.host if request.client else "unknown"

    # Honeypot check — silently discard bots
    if payload.orgField:
        return {"ok": True, "id": None, "emailSent": False}

    # Rate limit
    if rate_limited("contact", ip):
        return {"ok": True, "id": None, "emailSent": False}

    sub_id = str(uuid.uuid4())
    doc = {
        "id": sub_id,
        "name": payload.name,
        "email": payload.email,
        "message": payload.message,
        "company": payload.company,
        "role": payload.role,
        "website": payload.website,
        "stage": payload.stage,
        "investmentRange": payload.investmentRange,
        "timeline": payload.timeline,
        "phone": payload.phone,
        "ip": ip,
        "createdAt": now_iso(),
    }
    await db.contact_submissions.insert_one(doc)

    email_sent = await send_email(
        subject=f"New contact from {payload.name} ({payload.email})",
        text=f"Name: {payload.name}\nEmail: {payload.email}\nCompany: {payload.company or '—'}\nMessage:\n{payload.message}",
    )

    return {"ok": True, "id": sub_id, "emailSent": email_sent}


@api_router.post("/subscribe")
async def create_subscription(payload: SubscribeCreate, request: Request):
    """Take an email address for the notes.

    Same defences as /contact — honeypot first, then the per-IP limiter — and
    the same quiet response either way, so neither a bot nor a scraper learns
    anything from the difference.

    Re-subscribing is not an error. The address is the key, so a second attempt
    updates the timestamp rather than creating a duplicate, and the caller still
    gets ok: true — telling someone "you are already on this list" leaks who is
    on it to anyone who cares to ask.
    """
    ip = request.client.host if request.client else "unknown"

    if payload.orgField:
        return {"ok": True, "already": False}

    if rate_limited("subscribe", ip):
        return {"ok": True, "already": False}

    email = payload.email.lower().strip()
    existing = await db.subscribers.find_one({"email": email})

    await db.subscribers.update_one(
        {"email": email},
        {
            "$set": {
                "email": email,
                "source": payload.source,
                "updatedAt": now_iso(),
            },
            "$setOnInsert": {
                "id": str(uuid.uuid4()),
                "createdAt": now_iso(),
                "confirmed": False,
            },
        },
        upsert=True,
    )

    if not existing:
        await send_email(
            subject=f"New notes subscriber: {email}",
            text=f"Email: {email}\nSource: {payload.source or '-'}\n",
        )

    return {"ok": True, "already": bool(existing)}


@api_router.get("/subscribers")
async def list_subscribers(request: Request):
    """Admin-only, for the same reason /contact-submissions is.

    A subscriber list is a list of real people's addresses. It is gated behind
    the same session-plus-ADMIN_EMAILS check, and the response never carries
    the stored IP.
    """
    user = await session_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")

    admins = {
        e.strip().lower()
        for e in os.environ.get("ADMIN_EMAILS", "").split(",")
        if e.strip()
    }
    if not admins:
        logger.error("ADMIN_EMAILS is unset - refusing access to subscribers.")
        raise HTTPException(status_code=403, detail="Admin access is not configured")

    if (user.get("email") or "").lower() not in admins:
        logger.warning("Rejected subscriber access for %s", user.get("email"))
        raise HTTPException(status_code=403, detail="Not authorised")

    cursor = db.subscribers.find({}, {"_id": 0, "ip": 0}).sort("createdAt", -1)
    return await cursor.to_list(length=500)


@api_router.get("/contact-submissions")
async def list_contact_submissions(request: Request):
    """Admin-only. Every row is personal data — name, email, phone, IP.

    This was previously world-readable, which made the whole enquiry pipeline a
    public dataset the moment anyone submitted the form. Access now requires a
    valid session belonging to an address on ADMIN_EMAILS, and the caller's IP
    is never returned.
    """
    user = await session_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")

    admins = {
        e.strip().lower()
        for e in os.environ.get("ADMIN_EMAILS", "").split(",")
        if e.strip()
    }
    if not admins:
        logger.error("ADMIN_EMAILS is unset — refusing access to contact submissions.")
        raise HTTPException(status_code=403, detail="Admin access is not configured")

    if (user.get("email") or "").lower() not in admins:
        logger.warning("Rejected contact-submission access for %s", user.get("email"))
        raise HTTPException(status_code=403, detail="Not authorised")

    # Drop the stored IP from the response — it is kept for abuse handling, not
    # for routine reading.
    cursor = db.contact_submissions.find({}, {"_id": 0, "ip": 0}).sort("createdAt", -1)
    return await cursor.to_list(length=200)


@api_router.post("/analytics/event")
async def track_event(evt: AnalyticsEvent, request: Request):
    # The IP is used only for this rate-limit check — never stored on the
    # event document. analytics_events intentionally carries no PII.
    ip = request.client.host if request.client else "unknown"
    if rate_limited("analytics", ip, max_hits=60, window_seconds=60):
        # Same quiet accept-and-drop /contact and /subscribe already use on
        # limit — consistent anti-enumeration posture, and the frontend's
        # track() ignores the response either way.
        return {"ok": True}
    await db.analytics_events.insert_one({
        "name": evt.name,
        "path": evt.path,
        "meta": evt.meta or {},
        "createdAt": now_iso(),
    })
    return {"ok": True}


# ── Auth (Emergent managed Google sign-in) ───────────────────────────────────
# The session-data endpoint is called from the backend only: the one-time
# session_id is exchanged here for the profile, and the browser only ever
# receives an httpOnly cookie. Auth is optional — no marketing route is gated.

EMERGENT_SESSION_DATA_URL = "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data"
SESSION_COOKIE = "session_token"
SESSION_TTL_DAYS = 7
# Production defaults to a cross-site-capable cookie; local http dev overrides
# these in .env because `SameSite=None` is only honoured alongside `Secure`.
COOKIE_SECURE = os.environ.get("COOKIE_SECURE", "true").strip().lower() == "true"
COOKIE_SAMESITE = os.environ.get("COOKIE_SAMESITE", "none").strip().lower()


def public_user(doc: dict) -> dict:
    """Only ever expose these fields — never the raw session or Mongo document."""
    return {
        "id": doc.get("user_id"),
        "email": doc.get("email"),
        "name": doc.get("name"),
        "picture": doc.get("picture"),
    }


async def session_user(request: Request) -> Optional[dict]:
    """Resolve the signed-in user: session cookie first, Bearer token as fallback."""
    token = request.cookies.get(SESSION_COOKIE)
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:].strip()
    if not token:
        return None

    sess = await db.user_sessions.find_one({"session_token": token})
    if not sess:
        return None

    expires_at = sess.get("expiresAt")
    if expires_at:
        try:
            if datetime.fromisoformat(expires_at) <= datetime.now(timezone.utc):
                await db.user_sessions.delete_one({"session_token": token})
                return None
        except ValueError:
            logger.warning("Unparseable session expiry: %s", expires_at)

    return await db.users.find_one({"user_id": sess.get("user_id")})


@api_router.post("/auth/session")
async def auth_session(request: Request, response: Response):
    session_id = request.headers.get("X-Session-ID")
    if not session_id:
        raise HTTPException(status_code=400, detail="Missing X-Session-ID header")

    def fetch_profile():
        return http_requests.get(
            EMERGENT_SESSION_DATA_URL,
            headers={"X-Session-ID": session_id},
            timeout=10,
        )

    try:
        provider = await asyncio.to_thread(fetch_profile)
    except Exception as exc:  # network/timeout — never leak details to the client
        logger.error("Auth session-data call failed: %s", exc)
        raise HTTPException(status_code=502, detail="Auth provider unreachable")

    if provider.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid or expired session")

    data = provider.json()
    email = data.get("email")
    if not email:
        raise HTTPException(status_code=401, detail="Auth provider returned no email")

    existing = await db.users.find_one({"email": email})
    if existing:
        user_id = existing["user_id"]
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {
                "name": data.get("name"),
                "picture": data.get("picture"),
                "lastLoginAt": now_iso(),
            }},
        )
        user = await db.users.find_one({"user_id": user_id})
    else:
        user_id = str(uuid.uuid4())
        user = {
            "user_id": user_id,
            "email": email,
            "name": data.get("name"),
            "picture": data.get("picture"),
            "createdAt": now_iso(),
            "lastLoginAt": now_iso(),
        }
        await db.users.insert_one(user)

    token = data.get("session_token") or str(uuid.uuid4())
    await db.user_sessions.insert_one({
        "session_token": token,
        "user_id": user_id,
        "createdAt": now_iso(),
        "expiresAt": (datetime.now(timezone.utc) + timedelta(days=SESSION_TTL_DAYS)).isoformat(),
    })

    response.set_cookie(
        key=SESSION_COOKIE,
        value=token,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        max_age=SESSION_TTL_DAYS * 24 * 60 * 60,
        path="/",
    )
    return {"user": public_user(user)}


@api_router.get("/auth/me")
async def auth_me(request: Request):
    user = await session_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return public_user(user)


@api_router.post("/auth/logout")
async def auth_logout(request: Request, response: Response):
    token = request.cookies.get(SESSION_COOKIE)
    if token:
        await db.user_sessions.delete_one({"session_token": token})
    response.delete_cookie(key=SESSION_COOKIE, path="/", samesite=COOKIE_SAMESITE, secure=COOKIE_SECURE)
    return {"ok": True}


# ── Seed ─────────────────────────────────────────────────────────────────────

async def upsert_all(collection, docs: List[dict], key: str) -> int:
    """Idempotent seed, per document.

    An all-or-nothing `count == 0` guard means new editorial content is never
    picked up once a collection exists. Upserting on the natural key keeps
    seeding safe to re-run while still publishing additions and edits.

    createdAt/updatedAt are stamped here rather than carried in the seed
    dicts themselves — $setOnInsert for createdAt, $set for updatedAt, the
    same split /subscribe already uses for its own upsert. A document's
    first-seen time should survive every later re-seed, not reset to
    "whenever the server last restarted".
    """
    written = 0
    now = now_iso()
    for doc in docs:
        result = await collection.update_one(
            {key: doc[key]},
            {"$set": {**doc, "updatedAt": now}, "$setOnInsert": {"createdAt": now}},
            upsert=True,
        )
        if result.upserted_id is not None or result.modified_count:
            written += 1
    return written


async def seed():
    for collection, docs, key, label in (
        (db.case_studies, CASE_STUDIES, "slug", "case studies"),
        (db.network_resources, NETWORK_RESOURCES, "slug", "network resources"),
        (db.insights, INSIGHTS, "slug", "insights"),
        (db.portfolio_groups, PORTFOLIO_GROUPS, "category", "portfolio groups"),
        (db.ecosystem_items, ECOSYSTEM_ITEMS, "slug", "ecosystem items"),
    ):
        written = await upsert_all(collection, docs, key)
        if written:
            logger.info("Seeded/updated %s %s", written, label)


# ── Lifecycle ─────────────────────────────────────────────────────────────────

@app.on_event("startup")
async def on_startup():
    await seed()
    asyncio.create_task(_prune_rate_limiter_loop())
    logger.info("hiAnzy API started")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


# ── Wire up router + CORS ─────────────────────────────────────────────────────

app.include_router(api_router)


@app.middleware("http")
async def security_headers(request: Request, call_next):
    """Baseline hardening headers.

    The API returns JSON, but a browser that is tricked into rendering a
    response as HTML/script is the usual route to trouble — nosniff and
    DENY-framing shut that down cheaply.
    """
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=(), interest-cohort=()"
    response.headers["Cross-Origin-Resource-Policy"] = "same-site"
    # Never advertise the server software.
    response.headers["Server"] = "hi-anzy"
    if IS_PRODUCTION:
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response


# ── CORS ─────────────────────────────────────────────────────────────────────
# Credentialed CORS and a wildcard origin must never be combined: Starlette
# echoes the caller's Origin back, so *any* site could ride a signed-in
# visitor's session cookie. Origins are therefore an explicit allowlist, and a
# wildcard is refused outright whenever credentials are enabled.
raw_origins = os.environ.get("CORS_ORIGINS", "").strip()
origins = [o.strip() for o in raw_origins.split(",") if o.strip()]

DEV_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]

if "*" in origins:
    logger.error(
        "CORS_ORIGINS contains '*' while credentials are enabled — refusing the "
        "wildcard and falling back to the local development allowlist. Set "
        "CORS_ORIGINS to your real front-end origin(s)."
    )
    origins = [o for o in origins if o != "*"]

if not origins:
    if IS_PRODUCTION:
        # Fail closed: no origin allowlist means no cross-origin browser access.
        logger.error("CORS_ORIGINS is unset in production — cross-origin requests will be denied.")
    else:
        origins = DEV_ORIGINS

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=origins,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Session-ID"],
    max_age=600,
)
