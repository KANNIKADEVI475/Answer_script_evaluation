import re
from rapidfuzz import fuzz

def evaluate_objective(question, student_answer, correct_answer, max_marks=0.5, fuzzy_threshold=65):
    def normalize(text):
        text = text.lower().strip()
        text = re.sub(r'^[a-d]\)\s*', '', text)
        text = re.sub(r'[^\w\s]', '', text)
        text = re.sub(r'\s+', ' ', text)
        return text.strip()

    norm_student = normalize(student_answer)
    norm_correct = normalize(correct_answer)

    if not norm_student:
        return {
            "mode": "objective",
            "question": question,
            "marks": f"0/{max_marks}",
            "verdict": "no_answer_detected",
            "student_answer": student_answer,
        }

    similarity = fuzz.ratio(norm_student, norm_correct)
    is_correct = similarity >= fuzzy_threshold
    marks = max_marks if is_correct else 0

    return {
        "mode": "objective",
        "question": question,
        "student_answer": student_answer,
        "correct_answer": correct_answer,
        "match_score": similarity,
        "marks": f"{marks}/{max_marks}",
        "verdict": "correct" if is_correct else "incorrect",
    }