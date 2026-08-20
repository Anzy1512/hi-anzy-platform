"""Hi Anzy — FastAPI backend.
CMS-like content APIs + contact pipeline + analytics events.
Email notifications are env-driven (RESEND_API_KEY or SMTP_*) and skip
gracefully when unconfigured — submissions are always stored in MongoDB.
"""
from fastapi import FastAPI, APIRouter, HTTPException, Request
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
from datetime import datetime, timezone
import requests as http_requests

from seed_data import CASE_STUDIES, NETWORK_RESOURCES, INSIGHTS, PORTFOLIO_GROUPS

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="Hi Anzy API")
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
    return {"service": "Hi Anzy API", "status": "ok"}


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
async def list_insights():
    cursor = db.insights.find({"published": True}, {"_id": 0, "body": 0}).sort("_id", -1)
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
async def list_contact_submissions():
    cursor = db.contact_submissions.find({}, {"_id": 0}).sort("createdAt", -1)
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


# ── Seed ─────────────────────────────────────────────────────────────────────

async def seed():
    if await db.case_studies.count_documents({}) == 0:
        await db.case_studies.insert_many(CASE_STUDIES)
        logger.info(f"Seeded {len(CASE_STUDIES)} case studies")

    if await db.network_resources.count_documents({}) == 0:
        await db.network_resources.insert_many(NETWORK_RESOURCES)
        logger.info(f"Seeded {len(NETWORK_RESOURCES)} network resources")

    if await db.insights.count_documents({}) == 0:
        await db.insights.insert_many(INSIGHTS)
        logger.info(f"Seeded {len(INSIGHTS)} insights")

    if await db.portfolio_groups.count_documents({}) == 0:
        await db.portfolio_groups.insert_many(PORTFOLIO_GROUPS)
        logger.info(f"Seeded {len(PORTFOLIO_GROUPS)} portfolio groups")


# ── Lifecycle ─────────────────────────────────────────────────────────────────

@app.on_event("startup")
async def on_startup():
    await seed()
    logger.info("Hi Anzy API started")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


# ── Wire up router + CORS ─────────────────────────────────────────────────────

app.include_router(api_router)

cors_origins = os.environ.get("CORS_ORIGINS", "*")
origins = [o.strip() for o in cors_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)
