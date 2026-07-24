export const evaluateAnswers = async () => {

  const response = await fetch("http://127.0.0.1:8000/evaluate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      student_answer: "AI is intelligence shown by machines",
      answer_key: "Artificial Intelligence is simulation of human intelligence"
    })
  });

  return response.json();
};n