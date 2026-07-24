import { HashRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import FacultyLogin from "./pages/FacultyLogin";
import FacultyDashboard from "./pages/FacultyDashboard";
import FacultyEvaluate from "./pages/FacultyEvaluate";
import FacultyStoredScripts from "./pages/FacultyStoredScripts";
import StudentDashboard from "./pages/StudentDashboard";
import FacultyUpload from "./pages/FacultyUpload";
import SeparateApplication from "./pages/SeparateApplication";
import Dashboard from "./pages/Dashboard";
import StudentResult from "./pages/StudentResult";


function App(){

return(

<HashRouter>

<Routes>

<Route 
path="/" 
element={<Home/>}
/>

<Route
path="/faculty-login"
element={<FacultyLogin/>}
/>

<Route
path="/faculty-dashboard"
element={<FacultyDashboard/>}
/>

<Route
path="/faculty-evaluate"
element={<FacultyEvaluate/>}
/>

<Route
path="/faculty-stored-scripts"
element={<FacultyStoredScripts/>}
/>

<Route
path="/student-dashboard"
element={<StudentDashboard/>}
/>

<Route path="/faculty-upload" element={<FacultyUpload/>} />
<Route path="/faculty-upload/:subjectCode" element={<FacultyUpload/>} />

<Route
path="/separate-application"
element={<SeparateApplication/>}
/>

<Route path="/dashboard" element={<Dashboard />} />
<Route path="/student-result" element={<StudentResult />} />

</Routes>

</HashRouter>

)

}


export default App;
