import { useNavigate } from "react-router-dom";

function Navbar(){

const navigate = useNavigate();

return(

<div style={{
display:"flex",
gap:"20px",
padding:"10px",
background:"#ddd"
}}>

<h3>🤖 AI Evaluator</h3>

<button onClick={()=>navigate("/")}>Home</button>

<button onClick={()=>navigate("/faculty-upload")}>
Faculty
</button>

<button onClick={()=>navigate("/scorecard")}>
Scorecard
</button>

</div>

);

}

export default Navbar;