from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import re
from difflib import SequenceMatcher

app = FastAPI()

# ✅ CORS (VERY IMPORTANT for frontend connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🟢 Home route (test)
@app.get("/")
def home():
    return {"message": "Backend is working 🚀"}

# 🟢 PAN validation
def validate_pan(pan):
    return bool(re.match(r'^[A-Z]{5}[0-9]{4}[A-Z]$', pan))

# 🟢 Name similarity (AI-like feature)
def name_similarity(a, b):
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()

# 🟢 Main AI verification API
@app.post("/verify")
def verify(data: dict):
    score = 100
    issues = []

    partyA = data.get("partyA", {})
    partyB = data.get("partyB", {})

    # PAN check
    if not validate_pan(partyA.get("pan", "")):
        score -= 10
        issues.append("Invalid PAN (Party A)")

    if not validate_pan(partyB.get("pan", "")):
        score -= 10
        issues.append("Invalid PAN (Party B)")

    # Amount check
    if partyA.get("amount") != partyB.get("amount"):
        score -= 20
        issues.append("Amount mismatch")

    # Name similarity check
    similarity = name_similarity(
        partyA.get("name", ""),
        partyB.get("name", "")
    )

    if similarity < 0.8:
        score -= 15
        issues.append("Name mismatch")

    # Missing fields
    required = ["name", "amount"]
    for field in required:
        if not partyA.get(field):
            score -= 10
            issues.append(f"Missing {field} (Party A)")
        if not partyB.get(field):
            score -= 10
            issues.append(f"Missing {field} (Party B)")

    # Risk calculation
    if score >= 85:
        risk = "Low"
    elif score >= 60:
        risk = "Medium"
    else:
        risk = "High"

    return {
        "score": score,
        "risk": risk,
        "issues": issues,
        "similarity": similarity
    }