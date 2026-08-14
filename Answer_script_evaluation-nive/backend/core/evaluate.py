import os
import re
import json
from groq import Groq

_groq_client = None

def _get_groq_client(api_key=None):
    global _groq_client
    if _groq_client is None:
        key = api_key or os.environ.get("GROQ_API_KEY")
        if not key:
            raise ValueError("No Groq API key found. Set GROQ_API_KEY env var or pass api_key=...")
        _groq_client = Groq(api_key=key)
    return _groq_client

_TEACHER_EVAL_SYSTEM_TEMPLATE = """You are a strict but fair exam evaluator grading a student's answer based on a teacher's model answer.
Analyze the teacher's model answer and split it into key concepts/sentences.
For each key concept, determine if it is present or missing in the student's answer.
Assign a score between 0.0 and 1.0 representing how well the student captured that concept.
- If the score is >= 0.55, place the concept object in the "concepts_present" list.
- If the score is < 0.55, place the concept object in the "concepts_missing" list.
Calculate the "marks" as round((len(concepts_present) / total_concepts) * max_marks, 2) out of max_marks.
Calculate "similarity_percent" as the average score of all concepts multiplied by 100, rounded to 1 decimal place.

Always respond with ONLY valid JSON, no markdown formatting (no ```json codeblocks), in exactly this format:
{{
  "concepts_present": [
    {{"concept": "<key concept from teacher answer>", "score": <float between 0.55 and 1.0>}}
  ],
  "concepts_missing": [
    {{"concept": "<key concept from teacher answer>", "score": <float between 0.0 and 0.54>}}
  ],
  "similarity_percent": <float>,
  "marks": "<marks_awarded>/{max_marks}"
}}"""

def evaluate_with_teacher_answer(question, student_answer, teacher_answer, max_marks=10, api_key=None, model="llama-3.1-8b-instant"):
    client = _get_groq_client(api_key)
    system_msg = _TEACHER_EVAL_SYSTEM_TEMPLATE.format(max_marks=max_marks)
    user_msg = f"""Question: {question}
Teacher's Model Answer: {teacher_answer}
Student's Answer: {student_answer}"""

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_msg},
            {"role": "user", "content": user_msg},
        ],
        temperature=0.2,
    )
    raw = response.choices[0].message.content.strip()
    raw = re.sub(r"^```json|```$", "", raw, flags=re.MULTILINE).strip()
    
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        # Fallback in case the model outputs invalid JSON
        parsed = {
            "concepts_present": [{"concept": "See explanation in feedback", "score": 1.0}],
            "concepts_missing": [],
            "similarity_percent": 50.0,
            "marks": f"0/{max_marks}"
        }

    parsed["mode"] = "teacher_answer"
    parsed["question"] = question
    return parsed

_CLEANUP_SYSTEM_TEMPLATE = """You are a strict but fair exam evaluator.
Always respond with ONLY valid JSON, no other text, in exactly this shape:
{{"marks": <number out of {max_marks}>, "reason": "<one or two sentence explanation>"}}"""

def evaluate_without_teacher_answer(question, student_answer, max_marks=10, api_key=None, model="llama-3.1-8b-instant"):
    client = _get_groq_client(api_key)

    system_msg = _CLEANUP_SYSTEM_TEMPLATE.format(max_marks=max_marks)
    user_msg = f"""Question:
{question}

Student answer:
{student_answer}

Judge correctness and completeness. Give marks out of {max_marks}."""

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_msg},
            {"role": "user", "content": user_msg},
        ],
        temperature=0.3,
    )

    raw = response.choices[0].message.content.strip()
    raw = re.sub(r"^```json|```$", "", raw, flags=re.MULTILINE).strip()

    try:
        parsed = json.loads(raw)
        marks = parsed.get("marks")
        reason = parsed.get("reason", "")
    except json.JSONDecodeError:
        marks = None
        reason = raw

    return {
        "mode": "llm_only",
        "question": question,
        "marks": f"{marks}/{max_marks}" if marks is not None else "N/A",
        "reason": reason,
    }

def evaluate(question, student_answer, teacher_answer=None, max_marks=10, groq_api_key=None):
    if teacher_answer and teacher_answer.strip():
        return evaluate_with_teacher_answer(question, student_answer, teacher_answer, max_marks=max_marks, api_key=groq_api_key)
    else:
        return evaluate_without_teacher_answer(question, student_answer, max_marks=max_marks, api_key=groq_api_key)