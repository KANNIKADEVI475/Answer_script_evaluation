from pdf_to_images import pdf_to_images
from preprocess import preprocess_images
from ocr import ocr_image
from ocr_cleanup import clean_ocr_text
from segment import segment_by_known_questions
from evaluate import evaluate
from evaluate_objective import evaluate_objective
from question_bank import question_bank

def run_pipeline(answer_pdf_path, groq_api_key=None):
    raw_images = pdf_to_images(answer_pdf_path)
    clean_images = preprocess_images(raw_images)

    page_texts = []
    for idx, image in enumerate(clean_images):
        text = ocr_image(image)
        page_texts.append(text)
        print(f"OCR done for page {idx + 1}")

    full_raw_text = "\n\n".join(page_texts)

    full_cleaned_text = clean_ocr_text(full_raw_text, api_key=groq_api_key)
    print("OCR text cleaned")

    with open("debug_cleaned_text.txt", "w", encoding="utf-8") as f:
        f.write(full_cleaned_text)
    print("Saved debug_cleaned_text.txt")

    valid_qs = list(question_bank.keys())
    segments = segment_by_known_questions(full_cleaned_text, valid_qs)
    print(f"Detected {len(segments)} question segments: {list(segments.keys())}")

    results = []
    for q_num, student_answer in segments.items():
        qdata = question_bank.get(q_num)
        if qdata is None:
            continue

        if qdata["type"] == "objective":
            result = evaluate_objective(
                question=qdata["question"],
                student_answer=student_answer,
                correct_answer=qdata["correct_answer"],
                max_marks=qdata["max_marks"],
            )
        else:
            result = evaluate(
                question=qdata["question"],
                student_answer=student_answer,
                teacher_answer=qdata.get("teacher_answer"),
                max_marks=qdata["max_marks"],
                groq_api_key=groq_api_key,
            )

        results.append(result)

    return results


if __name__ == "__main__":
    results = run_pipeline("answer.pdf")

    total_scored = 0
    total_max = 0
    for r in results:
        print(f"\nQ{r['question'][:50]}...")
        print(r)

    print("\n=== DONE ===")