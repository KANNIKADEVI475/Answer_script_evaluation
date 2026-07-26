import { useNavigate } from "react-router-dom";
import "./../App.css";


function SeparateApplication(){

const navigate = useNavigate();


function handleButton(name){

alert(name);

}



return(

<div className="upload-page">


<h1>
🧩 AI Answer Evaluation Application
</h1>


<p>
Upload and evaluate student answer scripts using Semantic Transformer
</p>



<div className="upload-container">



<div className="upload-card">

<h2>📄 Question Paper</h2>

<button
className="upload-btn"
onClick={()=>handleButton("Upload Question Paper")}
>

Upload Question Paper

</button>

</div>





<div className="upload-card">

<h2>🔑 Answer Key</h2>

<button
className="upload-btn"
onClick={()=>handleButton("Upload Answer Key")}
>

Upload Answer Key

</button>

</div>





<div className="upload-card">

<h2>📊 Student Details</h2>

<button
className="upload-btn"
onClick={()=>handleButton("Upload Student Details")}
>

Upload Student Details

</button>

</div>





<div className="upload-card">

<h2>📝 Answer Scripts</h2>

<button
className="upload-btn"
onClick={()=>handleButton("Upload Answer Scripts")}
>

Upload Answer Scripts

</button>

</div>





<div className="upload-card">

<h2>🤖 AI Evaluation</h2>

<button
className="main-upload-btn"
onClick={()=>handleButton("AI Evaluation Started")}
>

Evaluate Answer Scripts

</button>

</div>





<div className="upload-card">

<h2>⬅️ Navigation</h2>

<button
className="secondary-btn"
onClick={()=>navigate("/faculty-dashboard")}
>

Back to Faculty Dashboard

</button>

</div>




</div>



</div>

)

}


export default SeparateApplication;