import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-card">
        <div className="home-hero">
          <h1>AI Answer Script Evaluation System</h1>
          <p>Choose your portal to continue to the evaluation workflow.</p>
        </div>

        <div className="home-buttons">
          <button
            className="button-primary"
            onClick={() => navigate("/faculty-login")}
          >
            👨‍🏫 Faculty Portal
          </button>

          <button
            className="button-secondary"
            onClick={() => navigate("/student")}
          >
            🎓 Student Portal
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
