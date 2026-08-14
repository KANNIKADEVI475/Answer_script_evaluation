import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function HistoryDetails() {
  const { id } = useParams();

  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/history/${id}`)
      .then((r) => r.json())
      .then(setData);
  }, [id]);

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
