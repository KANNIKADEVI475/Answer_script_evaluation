import os
import re
from groq import Groq


def normalize_question_numbers(text):
    import re

    # Force every question number (1-19) to start on a new line
    text = re.sub(
        r'\s+(1[0-9]|[1-9])\s*[\)\.:]',
        r'\n\1.',
        text
    )

    # Remove duplicate blank lines
    text = re.sub(r'\n{2,}', '\n', text)

    return text.strip()

    # Remove multiple blank lines
    text = re.sub(r'\n{2,}', '\n', text)

    return text.strip()


_client = None


def _get_client(api_key=None):
    global _client

    if _client is None:
        key = api_key or os.environ.get("GROQ_API_KEY")

        if not key:
            raise ValueError(
                "No Groq API key found. Set GROQ_API_KEY env var or pass api_key=..."
            )

        _client = Groq(api_key=key)

    return _client


_CLEANUP_SYSTEM_MSG = """
You clean OCR output from handwritten university answer sheets.

Rules:
- Correct only OCR spelling mistakes.
- NEVER rewrite or summarise.
- NEVER change question numbers.
- NEVER merge different questions.
- NEVER move text between questions.
- Every detected question number (1–19) MUST begin on a new line.
- Preserve Part A, Part B, Part C and Part D headings.
- Return only cleaned plain text.
"""


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

    cleaned = response.choices[0].message.content.strip()

    # Normalize question numbers
    cleaned = normalize_question_numbers(cleaned)

    return cleaned