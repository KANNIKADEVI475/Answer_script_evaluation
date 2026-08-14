from database.database import SessionLocal
from models.evaluation import Evaluation


def get_all_history():

    db = SessionLocal()

    try:

        evaluations = (
            db.query(Evaluation)
            .order_by(Evaluation.uploaded_at.desc())
            .all()
        )

        return [
            {
                "id": evaluation.id,
                "student_name": evaluation.student_name,
                "register_number": evaluation.register_number,
                "filename": evaluation.filename,
                "total_marks": evaluation.total_marks,
                "uploaded_at": evaluation.uploaded_at.isoformat()
                if evaluation.uploaded_at else None,
            }
            for evaluation in evaluations
        ]

    finally:

        db.close()