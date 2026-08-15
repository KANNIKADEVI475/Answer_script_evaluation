import LoginForm from "../components/LoginForm";

function Login() {
  return (
    <div className="login-page">
      <div className="left-section">
        <h1>AI Answer Script Evaluation</h1>

        <p>
          Automated Evaluation of University Answer Scripts using OCR and
          Artificial Intelligence.<br/>
          username:IT101<br/>
          pwd:1234<br/>
        </p>

        <img src="https://undraw.co/api/illustrations" alt="" />
      </div>

      <div className="right-section">
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
