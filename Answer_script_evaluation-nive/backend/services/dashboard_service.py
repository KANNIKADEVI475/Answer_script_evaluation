from database.database import SessionLocal
from models.evaluation import Evaluation


def _parse_marks(mark_string):
    if not isinstance(mark_string, str):
        return 0.0

    parts = mark_string.split("/")
    if len(parts) == 0:
        return 0.0

    try:
        return float(parts[0])
    except (ValueError, TypeError):
        return 0.0


def get_dashboard_stats():
    db = SessionLocal()

    evaluations = db.query(Evaluation).all()
    total = len(evaluations)
    evaluated = total
    pending = 0
    total_marks = 0.0

    for evaluation in evaluations:
        total_marks += _parse_marks(evaluation.total_marks)

    average_marks = round(total_marks / total, 2) if total > 0 else 0

    db.close()

    return {
        "total_scripts": total,
        "evaluated": evaluated,
        "pending": pending,
        "average_marks": average_marks
    }