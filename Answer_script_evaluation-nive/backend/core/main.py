from core.pdf_to_images import pdf_to_images
from core.preprocess import preprocess_images
from core.ocr import ocr_image
from core.ocr_cleanup import clean_ocr_text
from core.segment import segment_by_known_questions
from core.evaluate import evaluate
from core.evaluate_objective import evaluate_objective
from core.question_bank import QUESTION_BANK

import json


def run_pipeline(answer_pdf_path, groq_api_key=None):

    # -------------------------------
    # Step 1: Convert PDF to Images
    # -------------------------------
    raw_images = pdf_to_images(answer_pdf_path)

    # -------------------------------
    # Step 2: Image Preprocessing
    # -------------------------------
    clean_images = preprocess_images(raw_images)

    # -------------------------------
    # Step 3: OCR
    # -------------------------------
    page_texts = []

    for idx, image in enumerate(clean_images):
        text = ocr_image(image)
        page_texts.append(text)
        print(f"OCR completed for page {idx + 1}")

    full_raw_text = "\n\n".join(page_texts)

    # -------------------------------
    # Step 4: OCR Cleanup
    # -------------------------------
    full_cleaned_text = clean_ocr_text(
        full_raw_text,
        api_key=groq_api_key
    )

    print("OCR Cleanup Completed")

    with open("debug_cleaned_text.txt", "w", encoding="utf-8") as f:
        f.write(full_cleaned_text)

    print("Saved debug_cleaned_text.txt")

    # -------------------------------
    # Step 5: Segment Answers
    # -------------------------------
    valid_qs = list(QUESTION_BANK.keys())

    segments = segment_by_known_questions(
        full_cleaned_text,
        valid_qs
    )

    print("\n========== DETECTED QUESTIONS ==========")
    print(list(segments.keys()))
    print(f"Detected {len(segments)} question segments\n")

    # -------------------------------
    # Step 6: Evaluate Answers
    # -------------------------------
    results = []

    for q_num in valid_qs:

        qdata = QUESTION_BANK.get(q_num)

        if qdata is None:
            continue

        student_answer = segments.get(q_num, "").strip()

        if student_answer == "":
            result = {
                "marks": f"0/{qdata['max_marks']}",
                "feedback": "Answer not found."
            }

        else:

            if qdata["type"] == "objective":

                result = evaluate_objective(
                    question=qdata["question"],
                    student_answer=student_answer,
                    correct_answer=qdata["correct_answer"],
                    max_marks=qdata["max_marks"]
                )

            else:

                result = evaluate(
                    question=qdata["question"],
                    student_answer=student_answer,
                    teacher_answer=qdata.get("teacher_answer"),
                    max_marks=qdata["max_marks"],
                    groq_api_key=groq_api_key
                )

        result.update({

            "question_no": q_num,

            "question": qdata["question"],

            "student_answer": student_answer,

            "expected_answer": (
                qdata.get("correct_answer")
                if qdata["type"] == "objective"
                else qdata.get("teacher_answer", "")
            )

        })

        results.append(result)

    # -------------------------------
    # Debug Output
    # -------------------------------
    print("\n========== FINAL RESULTS ==========")
    print(json.dumps(results, indent=4, ensure_ascii=False))

    return results


if __name__ == "__main__":

    results = run_pipeline("answer.pdf")

    print(json.dumps(results, indent=4, ensure_ascii=False))