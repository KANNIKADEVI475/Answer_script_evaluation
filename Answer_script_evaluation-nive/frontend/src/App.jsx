import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";

import FacultyLogin from "./pages/Login";

import StudentPortal from "./pages/StudentPortal";

import Dashboard from "./pages/Dashboard";

import Upload from "./pages/Upload";

import Results from "./pages/Results";

import History from "./pages/History";
import HistoryDetails from "./pages/HistoryDetails";
import StudentResult from "./pages/StudentResult";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/faculty-login" element={<FacultyLogin />} />

        <Route path="/student" element={<StudentPortal />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/upload" element={<Upload />} />

        <Route path="/results" element={<Results />} />

        <Route path="/history" element={<History />} />
        <Route path="/history/:id" element={<HistoryDetails />} />
        <Route path="/student-result" element={<StudentResult />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
