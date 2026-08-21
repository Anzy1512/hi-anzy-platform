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
import time
import logging
import asyncio
import smtplib
from email.mime.text import MIMEText
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import requests as http_requests

from seed_data import CASE_STUDIES, NETWORK_RESOURCES, INSIGHTS, PORTFOLIO_GROUPS

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
    company: Optional[str] = None
    role: Optional[str] = None
    website: Optional[str] = None
    stage: Optional[str] = None
    investmentRange: Optional[str] = None
    timeline: Optional[str] = None
    phone: Optional[str] = None
    orgField: Optional[str] = None  # honeypot


class AnalyticsEvent(BaseModel):
    name: str
    path: Optional[str] = None
    meta: Optional[Dict[str, Any]] = None


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

_rate: Dict[str, List[float]] = {}
RATE_MAX: int = 5
RATE_WINDOW: int = 600


def rate_limited(ip: str) -> bool:
    now = time.time()
    hits = [t for t in _rate.get(ip, []) if now - t < RATE_WINDOW]
    _rate[ip] = hits
    if len(hits) >= RATE_MAX:
        return True
    _rate[ip].append(now)
    return False


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
    if rate_limited(ip):
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
async def track_event(evt: AnalyticsEvent):
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
    """
    written = 0
    for doc in docs:
        result = await collection.update_one({key: doc[key]}, {"$set": doc}, upsert=True)
        if result.upserted_id is not None or result.modified_count:
            written += 1
    return written


async def seed():
    for collection, docs, key, label in (
        (db.case_studies, CASE_STUDIES, "slug", "case studies"),
        (db.network_resources, NETWORK_RESOURCES, "slug", "network resources"),
        (db.insights, INSIGHTS, "slug", "insights"),
        (db.portfolio_groups, PORTFOLIO_GROUPS, "category", "portfolio groups"),
    ):
        written = await upsert_all(collection, docs, key)
        if written:
            logger.info("Seeded/updated %s %s", written, label)


# ── Lifecycle ─────────────────────────────────────────────────────────────────

@app.on_event("startup")
async def on_startup():
    await seed()
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
