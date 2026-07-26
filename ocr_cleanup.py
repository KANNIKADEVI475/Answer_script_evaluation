import os
import re
from groq import Groq

_client = None

def _get_client(api_key=None):
    global _client
    if _client is None:
        key = api_key or os.environ.get("GROQ_API_KEY")
        if not key:
            raise ValueError("No Groq API key found. Set GROQ_API_KEY env var or pass api_key=...")
        _client = Groq(api_key=key)
    return _client

_CLEANUP_SYSTEM_MSG = """You clean up noisy OCR output from handwritten deep learning / CS exam answer sheets.
Rules:
- Fix obvious OCR spelling errors (e.g. "socware" -> "software", "delievers" -> "delivers")
- Preserve technical terms exactly as likely intended (Autoencoder, GAN, LSTM, GRU, sigmoid, tanh, CNN, RNN, etc.)
- Fix broken word spacing and line-break artifacts
- Do NOT add, remove, or rephrase content. Do NOT correct the student's factual or technical mistakes.
- Preserve numbering, structure, and line breaks as closely as possible.
- Return ONLY the cleaned text, nothing else - no preamble, no explanation."""

def clean_ocr_text(raw_text, api_key=None, model="llama-3.1-8b-instant"):
    if not raw_text or not raw_text.strip():
        return raw_text

    client = _get_client(api_key)

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": _CLEANUP_SYSTEM_MSG},
            {"role": "user", "content": raw_text},
        ],
        temperature=0.1,
    )

    return response.choices[0].message.content.strip()