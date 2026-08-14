import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { getStudentResult } from "../services/studentService";

function StudentPortal() {
  const navigate = useNavigate();

  const [studentName, setStudentName] = useState("");
  const [registerNumber, setRegisterNumber] = useState("");

  const handleSubmit = async () => {
    try {
      const data = await getStudentResult({
        student_name: studentName,
        register_number: registerNumber,
      });

      // Store question-wise evaluation
      localStorage.setItem("currentResult", JSON.stringify(data.results));

      // Store student details
      localStorage.setItem(
        "currentStudent",
        JSON.stringify({
          student_name: data.student_name,
          register_number: data.register_number,
          total_marks: data.total_marks,
        }),
      );

      navigate("/student-result");
    } catch (err) {
      alert(err.response?.data?.detail || "Result not found.");
    }
  };

  return (
    <div
      style={{
        width: "400px",
        margin: "80px auto",
        padding: "30px",
        background: "#fff",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Student Result Portal
      </h2>

      <input
        type="text"
        placeholder="Register Number"
        value={registerNumber}
        onChange={(e) => setRegisterNumber(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
        }}
      />

      <input
        type="text"
        placeholder="Student Name"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
        }}
      />

      <button
        onClick={handleSubmit}
        style={{
          width: "100%",
          padding: "12px",
          background: "#4f46e5",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        View Result
      </button>
    </div>
  );
}

export default StudentPortal;
