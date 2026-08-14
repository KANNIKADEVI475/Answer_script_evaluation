import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ResultCard from "../components/ResultCard";

function Results() {
  let results = [];
  let student = null;
  let error = "";

  try {
    // Read evaluation results
    const storedResults = localStorage.getItem("currentResult");

    if (storedResults) {
      const parsedResults = JSON.parse(storedResults);

      if (Array.isArray(parsedResults)) {
        results = parsedResults;
      } else {
        error = "Invalid evaluation result format.";
      }
    } else {
      error = "No evaluation results found.";
    }

    // Student / Faculty details (optional)
    const storedStudent = localStorage.getItem("currentStudent");

    if (storedStudent) {
      student = JSON.parse(storedStudent);
    }
  } catch (err) {
    console.error(err);

    error = "Unable to load evaluation results.";
  }

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="content">
        <Navbar />

        {/* Student Details */}

        {student && (
          <div
            style={{
              background: "#ffffff",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h2>Evaluation Result</h2>

            <p>
              <strong>Student Name :</strong> {student.student_name}
            </p>

            <p>
              <strong>Register Number :</strong> {student.register_number}
            </p>

            <p>
              <strong>Total Marks :</strong> {student.total_marks}
            </p>
          </div>
        )}

        {error ? (
          <h3>{error}</h3>
        ) : (
          <div className="results-container">
            {results.map((result, index) => (
              <ResultCard key={index} result={result} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Results;
