from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
from dotenv import load_dotenv
import os

load_dotenv()

API_KEY = os.getenv("MISTRAL_API_KEY")

if not API_KEY:
    raise ValueError("Missing MISTRAL_API_KEY")

client = MistralClient(api_key=API_KEY)


def ask_ai(prompt: str):
    response = client.chat(
        model="mistral-small",
        messages=[ChatMessage(role="user", content=prompt)]
    )
    return response.choices[0].message.content