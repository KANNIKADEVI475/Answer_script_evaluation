import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function LoginForm() {
  const navigate = useNavigate();

  const [faculty_id, setFaculty] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    // Validation
    if (!faculty_id.trim() || !password.trim()) {
      alert("Please enter Faculty ID and Password.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/faculty/login", {
        faculty_id,
        password,
      });

      if (response.data.status === "success") {
        // Optional: Save faculty details
        localStorage.setItem("faculty_id", faculty_id);

        navigate("/dashboard");
      } else {
        alert(response.data.message || "Invalid Faculty ID or Password");
      }
    } catch (err) {
      console.error(err);

      if (err.response) {
        alert(err.response.data.detail || "Login failed");
      } else {
        alert("Unable to connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card">
      <h2>Faculty Login</h2>

      <input
        type="text"
        placeholder="Faculty ID- IT101"
        value={faculty_id}
        onChange={(e) => setFaculty(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password- 1234"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={login} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}

export default LoginForm;
