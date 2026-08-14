from core.main import run_pipeline
from services.websocket_service import send_progress

from database.database import SessionLocal
from models.evaluation import Evaluation

import asyncio
import os
import json


def _parse_marks(mark_string):
    if not isinstance(mark_string, str):
        return 0.0, 0.0

    parts = mark_string.split("/")
    if len(parts) != 2:
        try:
            return float(mark_string), 0.0
        except ValueError:
            return 0.0, 0.0

    obtained_str, maximum_str = parts
    try:
        obtained = float(obtained_str)
    except ValueError:
        obtained = 0.0

    try:
        maximum = float(maximum_str)
    except ValueError:
        maximum = 0.0

    return obtained, maximum


async def evaluate_answer_script(
    file_path,
    student_name,
    register_number,
    groq_api_key
):

    await send_progress("📄 Answer Script Uploaded")
    await asyncio.sleep(0.5)

    await send_progress("📖 Reading PDF")
    await asyncio.sleep(0.5)

    await send_progress("🖼️ Preprocessing Images")
    await asyncio.sleep(0.5)

    await send_progress("🔍 Performing OCR")
    await asyncio.sleep(0.5)

    await send_progress("🧹 Cleaning OCR Text")
    await asyncio.sleep(0.5)

    await send_progress("✂ Segmenting Questions")
    await asyncio.sleep(0.5)

    await send_progress("🤖 Evaluating Answers")

    # Run AI Pipeline
    results = run_pipeline(
        answer_pdf_path=file_path,
        groq_api_key=groq_api_key
    )

    obtained_marks = 0.0
    maximum_marks = 0.0

    part_c_obtained = []
    part_c_maximum = []

    for item in results:

       obtained, maximum = _parse_marks(item.get("marks", "0/0"))

       qno = int(item.get("question_no", 0))

       # Part C (Q16-Q18)
       if 16 <= qno <= 18:
          part_c_obtained.append(obtained)
          part_c_maximum.append(maximum)
       else:
          obtained_marks += obtained
          maximum_marks += maximum

# Keep only the best two Part C answers
    part_c = sorted(
    zip(part_c_obtained, part_c_maximum),
    key=lambda x: x[0],
    reverse=True
)[:2]

    for obtained, maximum in part_c:
      obtained_marks += obtained
      maximum_marks += maximum

    total_marks = f"{obtained_marks}/{maximum_marks}"

    await send_progress("💾 Saving Results")

    db = SessionLocal()

    try:

        evaluation = Evaluation(

               student_name=student_name,

               register_number=register_number,

               filename=os.path.basename(file_path),

               total_marks=total_marks,

               evaluation_data=json.dumps(results)

)

        db.add(evaluation)
        db.commit()
        db.refresh(evaluation)

    except Exception as e:

        db.rollback()
        raise e

    finally:

        db.close()

    await asyncio.sleep(0.5)

    await send_progress("✅ Evaluation Completed")

    return results