import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove stored login/session data
    localStorage.clear();

    // Redirect to login or home page
    navigate("/");
    // If your login page is "/faculty-login", use:
    // navigate("/faculty-login");
  };

  return (
    <div className="navbar">
      <h2>Faculty Dashboard</h2>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Navbar;
