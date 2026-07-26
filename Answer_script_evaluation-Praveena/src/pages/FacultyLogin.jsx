import { useState } from "react";
import { useNavigate } from "react-router-dom";
import teachers from "../data/teachers";
import "./../App.css";

function FacultyLogin() {
  const navigate = useNavigate();
  const [teacherId, setTeacherId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(event) {
    event.preventDefault();
    const id = teacherId.trim().toUpperCase();
    const pwd = password.trim();

    if (!id || !pwd) {
      setError("Teacher ID and password are required.");
      return;
    }

    const profile = teachers[id];
    if (!profile) {
      setError("Teacher ID not found. Please check your credentials.");
      return;
    }

    if (profile.password !== pwd) {
      setError("Incorrect password. Please try again.");
      return;
    }

    try {
      localStorage.setItem("facultyTeacherId", id);
    } catch (e) {
      console.warn("Could not persist login.", e);
    }

    setError("");
    navigate("/faculty-dashboard");
  }

  return (
    <div className="faculty-login-page">
      <div className="faculty-login-header">
        <div>
          <p className="small-label">Faculty Portal</p>
          <h1>Teacher Login</h1>
          <p className="sub-label">Enter your teacher ID and password to continue.</p>
        </div>
        <button className="secondary-btn" onClick={() => navigate("/")}>Back to Home</button>
      </div>

      <form className="faculty-login-form" onSubmit={handleLogin}>
        <div className="login-grid">
          <label>
            Teacher ID
            <input
              type="text"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              placeholder="TS-0445"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter secure password"
            />
          </label>
        </div>

        <div className="login-actions">
          <button type="submit" className="main-upload-btn">Sign In</button>
          <button type="button" className="optional-btn" onClick={() => navigate("/")}>Cancel</button>
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="login-help-card">
          <p>Teacher login requires your unique faculty ID.</p>
          <p className="help-note">Once signed in, you can upload question papers, answer keys, and student scripts.</p>
        </div>
      </form>
    </div>
  );
}

export default FacultyLogin;
