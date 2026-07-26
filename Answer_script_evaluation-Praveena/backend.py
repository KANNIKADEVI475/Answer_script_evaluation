import io
import json
import re
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse

from pypdf import PdfReader

HOST = "127.0.0.1"
PORT = 8000


def normalize_text(text: str) -> str:
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def extract_text_from_uploaded_file(file_bytes: bytes, filename: str) -> str:
    if not file_bytes:
        return ""

    file_name = (filename or "").lower()

    if file_name.endswith(".pdf"):
        try:
            reader = PdfReader(io.BytesIO(file_bytes))
            text = "\n".join(page.extract_text() or "" for page in reader.pages)
            return re.sub(r"\s+", " ", text).strip()
        except Exception:
            return ""

    if file_name.endswith((".txt", ".md", ".json", ".csv", ".log")):
        try:
            return file_bytes.decode("utf-8")
        except UnicodeDecodeError:
            return file_bytes.decode("latin-1", errors="ignore")

    try:
        return file_bytes.decode("utf-8", errors="ignore")
    except Exception:
        return ""


def parse_multipart_form(raw_body: bytes, content_type: str) -> dict:
    if "boundary=" not in content_type:
        raise ValueError("Missing multipart boundary")

    boundary = content_type.split("boundary=", 1)[1].strip().split(";", 1)[0]
    boundary_bytes = f"--{boundary}".encode("utf-8")

    fields: dict[str, dict | str] = {}
    for part in raw_body.split(boundary_bytes):
        if not part or part in (b"--", b"--\r\n"):
            continue

        chunk = part.lstrip(b"\r\n")
        if chunk.endswith(b"\r\n--"):
            chunk = chunk[:-4]
        if not chunk:
            continue

        header_block, separator, body = chunk.partition(b"\r\n\r\n")
        if not separator:
            continue

        headers: dict[str, str] = {}
        for line in header_block.split(b"\r\n"):
            if b":" in line:
                key, value = line.split(b":", 1)
                headers[key.decode("latin-1").strip().lower()] = value.decode("latin-1").strip()

        disposition = headers.get("content-disposition", "")
        name = None
        filename = None

        for item in disposition.split(";"):
            item = item.strip()
            if item.startswith("name="):
                name = item.split("=", 1)[1].strip('"')
            elif item.startswith("filename="):
                filename = item.split("=", 1)[1].strip('"')

        if not name:
            continue

        if body.endswith(b"\r\n"):
            body = body[:-2]

        if filename:
            fields[name] = {"filename": filename, "data": body}
        else:
            fields[name] = body.decode("utf-8", errors="ignore")

    return fields


def calculate_similarity(student_answer: str, answer_key: str) -> tuple[float, str, float]:
    student_tokens = set(normalize_text(student_answer).split())
    key_tokens = set(normalize_text(answer_key).split())

    if not student_tokens and not key_tokens:
        similarity = 0.0
        feedback = "No content provided for evaluation."
    else:
        if not student_tokens or not key_tokens:
            similarity = 0.0
            feedback = "The response is too short to match the answer key."
        else:
            overlap = student_tokens & key_tokens
            union = student_tokens | key_tokens
            similarity = round((len(overlap) / len(union)) * 100, 2) if union else 0.0

            if similarity >= 80:
                feedback = "Excellent match with the expected answer."
            elif similarity >= 60:
                feedback = "Good answer with moderate overlap."
            elif similarity >= 40:
                feedback = "Fair answer; more relevant keywords could improve the score."
            else:
                feedback = "The response needs more alignment with the expected answer."

    marks = round((similarity / 100) * 10, 2)
    return similarity, feedback, marks


class EvaluationHandler(BaseHTTPRequestHandler):
    def _send_json(self, status_code: int, payload: dict) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self) -> None:
        self._send_json(200, {"status": "ok"})

    def do_GET(self) -> None:
        parsed_path = urlparse(self.path)
        if parsed_path.path == "/health":
            self._send_json(200, {"status": "ok", "message": "Backend server is running"})
            return

        self._send_json(404, {"error": "Not found"})

    def do_POST(self) -> None:
        parsed_path = urlparse(self.path)
        if parsed_path.path != "/evaluate":
            self._send_json(404, {"error": "Endpoint not found"})
            return

        content_type = self.headers.get("Content-Type", "")
        content_length = int(self.headers.get("Content-Length", "0"))
        raw_body = self.rfile.read(content_length) if content_length > 0 else b""

        try:
            if content_type.startswith("multipart/form-data"):
                parsed_form = parse_multipart_form(raw_body, content_type)
                student_field = parsed_form.get("student_file")
                answer_key_field = parsed_form.get("answer_key_file")

                if not isinstance(student_field, dict) or not isinstance(answer_key_field, dict):
                    self._send_json(400, {"error": "Both student and answer key files are required"})
                    return

                student_bytes = student_field.get("data", b"")
                answer_key_bytes = answer_key_field.get("data", b"")

                student_answer = extract_text_from_uploaded_file(student_bytes, student_field.get("filename", ""))
                answer_key = extract_text_from_uploaded_file(answer_key_bytes, answer_key_field.get("filename", ""))
            else:
                data = json.loads(raw_body.decode("utf-8") or "{}")
                student_answer = data.get("student_answer", "")
                answer_key = data.get("answer_key", "")
        except json.JSONDecodeError:
            self._send_json(400, {"error": "Invalid JSON body"})
            return
        except Exception as exc:
            self._send_json(400, {"error": f"Failed to parse request: {str(exc)}"})
            return

        if not isinstance(student_answer, str) or not isinstance(answer_key, str):
            self._send_json(400, {"error": "student_answer and answer_key must be strings"})
            return

        similarity, feedback, marks = calculate_similarity(student_answer, answer_key)
        response_payload = {
            "similarity": similarity,
            "marks": marks,
            "feedback": feedback,
            "student_answer": student_answer,
            "answer_key": answer_key,
        }
        self._send_json(200, response_payload)


def main() -> None:
    server = HTTPServer((HOST, PORT), EvaluationHandler)
    print(f"Backend listening on http://{HOST}:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
