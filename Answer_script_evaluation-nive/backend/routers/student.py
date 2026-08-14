from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database.database import SessionLocal
from models.evaluation import Evaluation
import json

router = APIRouter(
    prefix="/student",
    tags=["Student"]
)


class StudentRequest(BaseModel):
    register_number: str
    student_name: str


@router.post("/result")
def get_student_result(request: StudentRequest):

    db = SessionLocal()

    try:

        evaluation = (
            db.query(Evaluation)
            .filter(
                Evaluation.register_number == request.register_number
            )
            .order_by(Evaluation.uploaded_at.desc())
            .first()
        )

        if not evaluation:
            raise HTTPException(
                status_code=404,
                detail="Result not found."
            )

        # DEBUG
        print("\n========== STUDENT LOGIN ==========")
        print("Database Name :", repr(evaluation.student_name))
        print("Entered Name  :", repr(request.student_name))
        print("Database Reg  :", repr(evaluation.register_number))
        print("Entered Reg   :", repr(request.register_number))

        db_name = " ".join(evaluation.student_name.lower().split())
        user_name = " ".join(request.student_name.lower().split())

        print("Normalized DB Name   :", repr(db_name))
        print("Normalized User Name :", repr(user_name))

        if db_name != user_name:
            raise HTTPException(
                status_code=401,
                detail="Student name does not match."
            )

        return {
            "student_name": evaluation.student_name,
            "register_number": evaluation.register_number,
            "total_marks": evaluation.total_marks,
            "filename": evaluation.filename,
            "uploaded_at": evaluation.uploaded_at,
            "results": json.loads(evaluation.evaluation_data)
        }

    finally:
        db.close()