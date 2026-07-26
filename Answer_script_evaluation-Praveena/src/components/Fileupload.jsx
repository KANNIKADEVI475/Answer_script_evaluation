import { useState } from "react";
import MarksTable from "./MarksTable";
import { evaluateAnswers } from "../services/api";

function FileUpload() {
  const [studentFile, setStudentFile] = useState(null);
  const [answerKey, setAnswerKey] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleEvaluate = async () => {
    if (!studentFile || !answerKey) {
      alert("Please upload both files");
      return;
    }

    setLoading(true);

    try {
      const data = await evaluateAnswers({
        studentFile,
        answerKeyFile: answerKey,
      });

      setResults([
        {
          studentId: 1,
          studentName: studentFile.name,
          marks: data.marks,
          similarity: data.similarity,
          feedback: data.feedback,
          status: "Completed",
        },
      ]);
    } catch (error) {
      alert(error.message || "Evaluation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>📄 Upload Files</h1>

      <label>Student answer file</label>
      <br />
      <input type="file" onChange={(e) => setStudentFile(e.target.files[0])} />
      <br />
      <br />

      <label>Answer key file</label>
      <br />
      <input type="file" onChange={(e) => setAnswerKey(e.target.files[0])} />
      <br />
      <br />

      <button onClick={handleEvaluate}>🤖 Evaluate AI</button>

      {loading && <p>⏳ Evaluating...</p>}

      <br />
      <br />

      {results.length > 0 && <MarksTable results={results} />}
    </div>
  );
}

export default FileUpload;
