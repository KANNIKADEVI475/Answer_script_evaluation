function ResultCard({ result }) {
  return (
    <div className="result-card">
      <h3>{result.question}</h3>

      <p>
        <strong>Marks :</strong>

        {result.marks}
      </p>

      {result.reason && (
        <p>
          <strong>Reason :</strong>

          {result.reason}
        </p>
      )}

      {result.similarity_percent && (
        <p>
          <strong>Similarity :</strong>
          {result.similarity_percent}%
        </p>
      )}
    </div>
  );
}

export default ResultCard;
