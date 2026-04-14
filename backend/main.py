from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import re
from difflib import SequenceMatcher

# 🔥 MISTRAL (STABLE VERSION 0.1.3)
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
from dotenv import load_dotenv
import os

# =========================
# 🔐 ENV SETUP
# =========================
load_dotenv()

API_KEY = os.getenv("MISTRAL_API_KEY")

if not API_KEY:
    raise ValueError("Mistral API key not found")

client = MistralClient(api_key=API_KEY)

# =========================
# 🚀 FASTAPI INIT
# =========================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# 🟢 BASIC ROUTE
# =========================
@app.get("/")
def home():
    return {"message": "Backend is working 🚀"}


# =========================
# 🔥 EXISTING LOGIC
# =========================

def validate_pan(pan):
    return bool(re.match(r'^[A-Z]{5}[0-9]{4}[A-Z]$', pan))


def name_similarity(a, b):
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()


@app.post("/verify")
def verify(data: dict):
    score = 100
    issues = []

    partyA = data.get("partyA", {})
    partyB = data.get("partyB", {})

    if not validate_pan(partyA.get("pan", "")):
        score -= 10
        issues.append("Invalid PAN (Party A)")

    if not validate_pan(partyB.get("pan", "")):
        score -= 10
        issues.append("Invalid PAN (Party B)")

    if partyA.get("amount") != partyB.get("amount"):
        score -= 20
        issues.append("Amount mismatch")

    similarity = name_similarity(
        partyA.get("name", ""),
        partyB.get("name", "")
    )

    if similarity < 0.8:
        score -= 15
        issues.append("Name mismatch")

    required = ["name", "amount"]
    for field in required:
        if not partyA.get(field):
            score -= 10
            issues.append(f"Missing {field} (Party A)")
        if not partyB.get(field):
            score -= 10
            issues.append(f"Missing {field} (Party B)")

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


# =========================
# 🤖 AI SUGGEST (MISTRAL)
# =========================
@app.post("/ai/suggest")
def ai_suggest(purpose: str = Form(...)):

    prompt = f"""
    A user wants to create an agreement for: {purpose}

    Suggest required documents.
    Keep it general (no country-specific names).
    Give a simple list.
    """

    response = client.chat(
        model="mistral-small",
        messages=[
            ChatMessage(role="user", content=prompt)
        ]
    )

    return {
        "suggestions": response.choices[0].message.content
    }


# =========================
# 🤖 AI EXPLAIN
# =========================
@app.post("/ai/explain")
def ai_explain(query: str = Form(...)):

    prompt = f"""
    Explain this clearly in simple terms:

    {query}
    """

    response = client.chat(
        model="mistral-small",
        messages=[
            ChatMessage(role="user", content=prompt)
        ]
    )

    return {
        "explanation": response.choices[0].message.content
    }


# =========================
# 📄 FILE ANALYSIS (LEVEL 1)
# =========================
@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    content = await file.read()
    text = content.decode("latin-1", errors="ignore")

    result = {
        "document_type": "Unknown",
        "confidence": 0,
        "detected_fields": {}
    }

    score = 0

    # PAN pattern
    pan_match = re.search(r'[A-Z]{5}[0-9]{4}[A-Z]', text)
    if pan_match:
        result["detected_fields"]["pan"] = pan_match.group()
        result["document_type"] = "Identity Document"
        score += 40

    # 12-digit ID
    id_match = re.search(r'\b\d{12}\b', text)
    if id_match:
        result["detected_fields"]["id_number"] = id_match.group()
        score += 30

    # Name detection
    words = text.split()
    probable_names = [w for w in words if w.istitle() and len(w) > 3]

    if probable_names:
        result["detected_fields"]["possible_names"] = probable_names[:3]
        score += 15

    # Contract detection
    if len(text) > 500:
        result["document_type"] = "Contract Document"
        score += 15

    result["confidence"] = score

    return result


# =========================
# 🧪 TEST AI
# =========================
@app.get("/test-ai")
def test_ai():
    response = client.chat(
        model="mistral-small",
        messages=[
            ChatMessage(role="user", content="Say hello")
        ]
    )

    return {
        "ai": response.choices[0].message.content
    }