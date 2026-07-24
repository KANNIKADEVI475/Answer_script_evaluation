import { useNavigate } from "react-router-dom";

function MarksTable({results}){

const navigate = useNavigate();

return(

<table border="1">

<thead>
<tr>
<th>ID</th>
<th>Name</th>
<th>Marks</th>
<th>Similarity</th>
<th>Status</th>
<th>View</th>
</tr>
</thead>

<tbody>

{results.map((r,index)=>(
<tr key={index}>

<td>{r.studentId}</td>
<td>{r.studentName}</td>
<td>{r.marks}</td>
<td>{r.similarity}%</td>
<td>{r.status}</td>

<td>
<button onClick={()=>navigate("/scorecard", {state:r})}>
View
</button>
</td>

</tr>
))}

</tbody>

</table>

);

}

export default MarksTable;