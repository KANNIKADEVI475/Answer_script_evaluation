from fastapi import APIRouter, UploadFile, File, Form, HTTPException
import shutil
import os

from services.evaluation_service import evaluate_answer_script

router = APIRouter(
    prefix="/evaluation",
    tags=["Evaluation"]
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/evaluate")
async def evaluate(
    student_name: str = Form(...),
    register_number: str = Form(...),
    answer_script: UploadFile = File(...),
    groq_api_key: str = Form(default=None)
):
    try:

        file_path = os.path.join(
            UPLOAD_FOLDER,
            os.path.basename(answer_script.filename)
        )

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(answer_script.file, buffer)

        result = await evaluate_answer_script(
        file_path=file_path,
        student_name=student_name,
        register_number=register_number,
        groq_api_key=groq_api_key
)

        return {
            "status": "success",
            "results": result
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )