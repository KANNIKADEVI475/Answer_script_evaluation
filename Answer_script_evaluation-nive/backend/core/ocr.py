import requests
import base64
import re
import os
import cv2
try:
    from dotenv import load_dotenv
except ImportError:
    load_dotenv = lambda *args, **kwargs: None

load_dotenv()
API_KEY = os.environ.get("GOOGLE_API_KEY")
if not API_KEY:
    raise RuntimeError(
        "GOOGLE_API_KEY is not configured. Set the environment variable "
        "or create a .env file."
    )
URL = f"https://vision.googleapis.com/v1/images:annotate?key={API_KEY}"

def ocr_image(image):
    success, encoded_img = cv2.imencode(".jpg", image)
    if not success:
        return ""

    content = base64.b64encode(encoded_img.tobytes()).decode("utf-8")
    payload = {
        "requests": [
            {
                "image": {"content": content},
                "features": [{"type": "DOCUMENT_TEXT_DETECTION"}]
            }
        ]
    }

    response = requests.post(URL, json=payload)
    result = response.json()

    if "responses" not in result:
        print("❌ API Error response:", result)
        return ""

    raw_text = result["responses"][0].get("fullTextAnnotation", {}).get("text", "")
    cleaned = re.sub(r'(?<!\n)\n(?!\n)', ' ', raw_text)
    cleaned = re.sub(r' +', ' ', cleaned).strip()
    return cleaned