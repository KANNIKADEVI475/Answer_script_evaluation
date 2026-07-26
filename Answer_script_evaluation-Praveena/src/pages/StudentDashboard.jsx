import { useNavigate } from "react-router-dom";
import "./../App.css";


function StudentDashboard(){

const navigate = useNavigate();


return(

<div className="upload-page">


<h1>
🎓 Student Dashboard
</h1>


<p>
Welcome to AI Answer Evaluation Portal
</p>



<div className="upload-card">


<h2>
View Your AI Evaluated Result
</h2>


<button
className="main-upload-btn"
onClick={()=>navigate("/student-result")}
>

📊 View Result

</button>


</div>



</div>

)

}


export default StudentDashboard;