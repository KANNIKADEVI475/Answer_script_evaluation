import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Loading from "./Loading";

function UploadCard() {
  const navigate = useNavigate();

  const [studentName, setStudentName] = useState("");
  const [registerNumber, setRegisterNumber] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const upload = async () => {
    if (!studentName.trim()) {
      alert("Please enter Student Name");
      return;
    }

    if (!registerNumber.trim()) {
      alert("Please enter Register Number");
      return;
    }

    if (!file) {
      alert("Please select a PDF");
      return;
    }

    const formData = new FormData();

    formData.append("student_name", studentName);
    formData.append("register_number", registerNumber);
    formData.append("answer_script", file);

    setLoading(true);

    try {
      const response = await api.post("/evaluation/evaluate", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      localStorage.setItem(
        "evaluationResult",
        JSON.stringify(response.data.results),
      );

      navigate("/history");
    } catch (err) {
      console.error(err);
      alert("Evaluation Failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="upload-card">
      <h2>Upload Answer Script</h2>

      <input
        type="text"
        placeholder="Student Name"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Register Number"
        value={registerNumber}
        onChange={(e) => setRegisterNumber(e.target.value)}
      />

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={upload} disabled={loading}>
        {loading ? "Evaluating..." : "Upload & Evaluate"}
      </button>
    </div>
  );
}

export default UploadCard;
