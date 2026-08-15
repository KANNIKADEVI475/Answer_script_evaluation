import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function HistoryDetails() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/history/${id}`)
      .then((r) => setData(r.data))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <h2>Error loading details: {error}</h2>;
  if (!data) return <h2>Loading...</h2>;

  return (
    <div>
      <h2>{data.student_name}</h2>

      <h3>{data.total_marks}</h3>

      {data.results.map((q, index) => (
        <div key={index}>
          <h3>Question {q.question_no}</h3>

          <p>
            <b>Student Answer:</b>
          </p>

          <p>{q.student_answer}</p>

          <p>
            <b>Expected Answer:</b>
          </p>

          <p>{q.expected_answer}</p>

          <p>
            <b>Marks:</b> {q.marks}
          </p>

          <p>
            <b>Feedback:</b> {q.feedback}
          </p>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default HistoryDetails;
