import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>AI Eval</h2>

      <Link to="/dashboard">Dashboard</Link>

      <Link to="/upload">Upload Script</Link>

      <Link to="/results">Results</Link>
      <Link to="/history">Evaluation History</Link>

      <Link to="/">Logout</Link>
    </div>
  );
}

export default Sidebar;
