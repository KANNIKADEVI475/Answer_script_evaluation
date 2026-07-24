import { useLocation, useNavigate } from "react-router-dom";

function Scorecard(){

const { state } = useLocation();
const navigate = useNavigate();

if(!state){
  return <h2>No Data Found</h2>;
}

return(

<div>

<h1>📊 Scorecard</h1>

<h2>{state.studentName}</h2>

<p><b>Marks:</b> {state.marks}/100</p>

<p><b>Similarity:</b> {state.similarity}%</p>

<p><b>Feedback:</b></p>

<p>{state.feedback}</p>

<br/>

<button onClick={()=>navigate("/faculty-upload")}>
⬅ Back
</button>

</div>

);

}

export default Scorecard;