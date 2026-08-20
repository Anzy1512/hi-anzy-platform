"""Phase 1 POC — contact pipeline + content APIs verification.
Covers: valid submission -> Mongo write, validation errors, honeypot discard,
graceful email skip, and content endpoints returning seeded data.
Run: python /app/tests/test_contact_poc.py
"""
import os
import sys
import requests
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv("/app/backend/.env")
load_dotenv("/app/frontend/.env")

BASE = os.environ.get("REACT_APP_BACKEND_URL", "http://localhost:8001").rstrip("/")
API = f"{BASE}/api"

results = []

def check(name, cond, detail=""):
    results.append((name, cond, detail))
    print(f"{'PASS' if cond else 'FAIL'} — {name} {detail}")

def main():
    # 1. Health
    r = requests.get(f"{API}/health", timeout=10)
    check("health endpoint", r.status_code == 200 and r.json().get("db") == "connected", str(r.status_code))

    # 2. Valid contact submission
    payload = {
        "name": "POC Tester",
        "email": "poc@example.com",
        "message": "We are growing but margins are shrinking and nobody can tell me why.",
        "company": "POC Industries",
        "stage": "Scaling",
        "investmentRange": "TBD",
        "timeline": "This quarter",
    }
    r = requests.post(f"{API}/contact", json=payload, timeout=20)
    body = r.json()
    check("valid contact accepted", r.status_code == 200 and body.get("ok") is True, str(body))
    sub_id = body.get("id")
    check("graceful email skip (no creds)", body.get("emailSent") is False, f"emailSent={body.get('emailSent')}")

    # 3. Mongo write verification
    mc = MongoClient(os.environ["MONGO_URL"])
    dbname = os.environ["DB_NAME"]
    doc = mc[dbname].contact_submissions.find_one({"id": sub_id})
    check("submission stored in MongoDB", doc is not None and doc["email"] == "poc@example.com")

    # 4. Validation error (missing message)
    r = requests.post(f"{API}/contact", json={"name": "X", "email": "bad"}, timeout=10)
    check("invalid submission rejected (422)", r.status_code == 422, str(r.status_code))

    # 5. Honeypot discard
    hp = dict(payload)
    hp["orgField"] = "I am a bot"
    r = requests.post(f"{API}/contact", json=hp, timeout=10)
    check("honeypot silently discarded", r.status_code == 200 and r.json().get("id") is None)

    # 6. Content endpoints (seeded)
    r = requests.get(f"{API}/case-studies", timeout=10)
    check("case studies seeded", r.status_code == 200 and len(r.json()) >= 5, f"count={len(r.json())}")
    slug = r.json()[0]["slug"]
    r = requests.get(f"{API}/case-studies/{slug}", timeout=10)
    check("case study detail", r.status_code == 200 and r.json()["slug"] == slug)

    r = requests.get(f"{API}/network", timeout=10)
    check("network seeded", r.status_code == 200 and len(r.json()) >= 20, f"count={len(r.json())}")
    r = requests.get(f"{API}/network?category=Creators", timeout=10)
    check("network category filter", r.status_code == 200 and all(x["category"] == "Creators" for x in r.json()))
    r = requests.get(f"{API}/network/categories", timeout=10)
    check("network categories list", r.status_code == 200 and len(r.json()["categories"]) >= 10)

    r = requests.get(f"{API}/insights", timeout=10)
    check("insights seeded (list, no body)", r.status_code == 200 and len(r.json()) >= 6 and "body" not in r.json()[0])
    islug = r.json()[0]["slug"]
    r = requests.get(f"{API}/insights/{islug}", timeout=10)
    check("insight detail with body", r.status_code == 200 and len(r.json().get("body", [])) > 3)

    r = requests.post(f"{API}/analytics/event", json={"name": "poc_test_event", "path": "/poc"}, timeout=10)
    check("analytics event accepted", r.status_code == 200 and r.json().get("ok") is True)

    # cleanup POC contact docs
    mc[dbname].contact_submissions.delete_many({"email": "poc@example.com"})

    failed = [r for r in results if not r[1]]
    print(f"\n{'='*50}\n{len(results)-len(failed)}/{len(results)} checks passed")
    sys.exit(1 if failed else 0)

if __name__ == "__main__":
    main()
