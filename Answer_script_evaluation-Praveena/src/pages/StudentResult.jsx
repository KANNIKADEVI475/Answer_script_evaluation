import { useState } from "react";
import "./../App.css";

function StudentResult(){

const [regNo, setRegNo] = useState("");
const [dob, setDob] = useState("");
const [result, setResult] = useState(null);

function handleGetResult(){

if(!regNo || !dob){
  alert("Please enter Register Number and DOB");
  return;
}

// 🔥 Dummy result (you can connect backend later)
const data = {
  name: "Praveena",
  subject: "AI",
  marks: "85/100",
  similarity: "92%",
  feedback: "Excellent"
};

setResult(data);

}

return(

<div className="result-container">

<h2>📄 View Result</h2>

<div className="form-box">

<input
type="text"
placeholder="Enter Register Number"
value={regNo}
onChange={(e)=>setRegNo(e.target.value)}
/>

<input
type="date"
value={dob}
onChange={(e)=>setDob(e.target.value)}
/>

<button onClick={handleGetResult}>
🔍 Get Result
</button>

</div>


{/* ✅ SHOW RESULT */}
{
result &&

<div className="result-card">

<h3>Result</h3>

<p><b>Name:</b> {result.name}</p>
<p><b>Subject:</b> {result.subject}</p>
<p><b>Marks:</b> {result.marks}</p>
<p><b>Similarity:</b> {result.similarity}</p>
<p><b>Feedback:</b> {result.feedback}</p>

</div>
}

</div>

)

}

export default StudentResult;