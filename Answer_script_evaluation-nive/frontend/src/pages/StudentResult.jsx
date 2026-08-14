import { useState } from "react";

function StudentResult() {
  const [student] = useState(() => {
    const storedStudent = localStorage.getItem("currentStudent");
    return storedStudent ? JSON.parse(storedStudent) : null;
  });
  const [results] = useState(() => {
    const storedResults = localStorage.getItem("currentResult");
    return storedResults ? JSON.parse(storedResults) : [];
  });

  return (
    <div style={{ padding: "30px" }}>
      {student && (
        <>
          <h2>Student Result</h2>

          <p>
            <b>Name:</b> {student.student_name}
          </p>
          <p>
            <b>Register No:</b> {student.register_number}
          </p>
          <p>
            <b>Total Marks:</b> {student.total_marks}
          </p>
        </>
      )}

      <hr />

      {results.map((item, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "8px",
          }}
        >
          <h3>Question {item.question_no}</h3>

          <p>
            <b>Student Answer:</b>
          </p>
          <p>{item.student_answer}</p>

          <p>
            <b>Expected Answer:</b>
          </p>
          <p>{item.expected_answer}</p>

          <p>
            <b>Marks:</b> {item.marks}
          </p>

          <p>
            <b>Feedback:</b>
          </p>
          <p>{item.feedback}</p>
        </div>
      ))}
    </div>
  );
}

export default StudentResult;
