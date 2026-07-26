function Dashboard(){

return(

<div className="dashboard-container">

<h1 className="dashboard-title">
Faculty Dashboard
</h1>

<div className="stats-container">
<h3>Total Students : 120</h3>
<h3>Evaluated : 95</h3>
<h3>Pending : 25</h3>
<h3>Average Score : 78%</h3>
</div>

<h2 className="report-title">
Student Evaluation Report
</h2>

<table className="dashboard-table">

<thead>
<tr>
<th>Name</th>
<th>Department</th>
<th>Subject</th>
<th>Marks</th>
<th>Similarity</th>
<th>Feedback</th>
</tr>
</thead>

<tbody>
<tr>
<td>Praveena</td>
<td>IT</td>
<td>AI</td>
<td>85/100</td>
<td>92%</td>
<td>Excellent</td>
</tr>
</tbody>

</table>

</div>

)

}

export default Dashboard;