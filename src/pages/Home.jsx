import { useNavigate } from "react-router-dom";
import "./../App.css";

function Home(){

const navigate = useNavigate();

return(

<div className="home-container">

<h1 className="main-title">
🤖 AI Answer Evaluation System
</h1>

<p className="subtitle">
Faculty and Student Portal
</p>

<h2 className="login-title">
Select Login
</h2>

<div className="button-group">

<button 
className="login-btn"
onClick={()=>navigate("/faculty-login")}
>
👩‍🏫 Faculty Login
</button>

<button 
className="login-btn"
onClick={()=>navigate("/student-dashboard")}
>
🎓 Student Login
</button>

</div>

</div>

)

}

export default Home;