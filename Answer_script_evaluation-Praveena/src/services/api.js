export const evaluateAnswers = async ({ studentFile, answerKeyFile }) => {
  if (!studentFile || !answerKeyFile) {
    throw new Error(
      "Please upload both the student answer file and the answer key file.",
    );
  }

  const formData = new FormData();
  formData.append("student_file", studentFile, studentFile.name);
  formData.append("answer_key_file", answerKeyFile, answerKeyFile.name);

  const response = await fetch("http://127.0.0.1:8000/evaluate", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Evaluation failed");
  }

  return response.json();
};
