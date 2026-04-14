from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import re
from difflib import SequenceMatcher

# ✅ Mistral (correct version: 0.1.3)
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage

from dotenv import load_dotenv
import os

# =========================
# 🔐 LOAD ENV
# =========================
load_dotenv()
API_KEY = os.getenv("MISTRAL_API_KEY")

if not API_KEY:
    raise ValueError("MISTRAL_API_KEY not found in .env")

client = MistralClient(api_key=API_KEY)

# =========================
# 🚀 APP INIT
# =========================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Backend is working 🚀"}


# =========================
# 🔧 BASIC LOGIC (UNCHANGED)
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

    return {
        "score": score,
        "issues": issues,
        "similarity": similarity
    }


# =========================
# 🤖 AI HELPER
# =========================

def ask_ai(prompt: str):
    response = client.chat(
        model="mistral-small",
        messages=[ChatMessage(role="user", content=prompt)]
    )
    return response.choices[0].message.content


# =========================
# 🧠 AI STEP 1 — SUGGEST DOCS
# =========================

@app.post("/ai/suggest")
def ai_suggest(purpose: str = Form(...)):
    prompt = f"""
    Suggest ONLY 5 to 6 required documents for this purpose: {purpose}

    Rules:
    - Only document names
    - No explanation
    - No paragraph
    - Output as bullet or list
    """

    result = ask_ai(prompt)

    docs = [line.strip("-• ").strip() for line in result.split("\n") if line.strip()]

    return {
        "documents": docs[:6]
    }


# =========================
# 🧠 AI STEP 3 — ANALYZE DOC
# =========================

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    content = await file.read()
    text = content.decode("latin-1", errors="ignore")

    prompt = f"""
    Analyze this document and give short output:

    1. Document type
    2. Key details found
    3. Risk level (Low/Medium/High)

    Keep answer SHORT and structured.

    Document:
    {text[:1000]}
    """

    result = ask_ai(prompt)

    return {"analysis": result}


# =========================
# 🧪 TEST AI
# =========================

@app.get("/test-ai")
def test_ai():
    result = ask_ai("Say hello in one line")
    return {"response": result}