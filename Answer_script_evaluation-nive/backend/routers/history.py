from fastapi import APIRouter
from database.database import SessionLocal
from models.evaluation import Evaluation
import json
from services.history_service import get_all_history

router = APIRouter(
    prefix="/history",
    tags=["History"]
)


@router.get("/")
def history():

    history = get_all_history()

    return history

@router.get("/{evaluation_id}")

def get_evaluation(evaluation_id: int):

    db = SessionLocal()

    evaluation = db.query(Evaluation).filter(
        Evaluation.id == evaluation_id
    ).first()

    db.close()

    if not evaluation:

        return {"message": "Not Found"}

    return {

        "id": evaluation.id,

        "student_name": evaluation.student_name,

        "register_number": evaluation.register_number,

        "total_marks": evaluation.total_marks,

        "results": json.loads(
            evaluation.evaluation_data
        )

    }