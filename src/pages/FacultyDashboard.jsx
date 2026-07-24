import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import teachers from "../data/teachers";
import "./../App.css";

function FacultyDashboard() {
  const [teacher, setTeacher] = useState(null);
  const [questionPaper, setQuestionPaper] = useState("");
  const [answerKey, setAnswerKey] = useState("");
  const [studentExcel, setStudentExcel] = useState("");
  const [answerScripts, setAnswerScripts] = useState([]);
  const questionPaperRef = useRef(null);
  const answerKeyRef = useRef(null);
  const studentExcelRef = useRef(null);
  const answerScriptsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem("facultyTeacherId");
    if (!id || !teachers[id]) {
      navigate("/faculty-login");
      return;
    }
    setTeacher(teachers[id]);

    try {
      const qp = localStorage.getItem("questionPaper");
      const ak = localStorage.getItem("answerKey");
      const se = localStorage.getItem("studentExcel");
      const raw = localStorage.getItem("answerScripts");
      if (qp) setQuestionPaper(qp);
      if (ak) setAnswerKey(ak);
      if (se) setStudentExcel(se);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) setAnswerScripts(arr);
      }
    } catch (e) {
      console.warn("Failed to restore uploads", e);
    }
  }, [navigate]);

  function handleQuestionPaper(event) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setQuestionPaper(file.name);
      localStorage.setItem("questionPaper", file.name);
    }
  }

  function handleAnswerKey(event) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setAnswerKey(file.name);
      localStorage.setItem("answerKey", file.name);
    }
  }

  function handleStudentExcel(event) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setStudentExcel(file.name);
      localStorage.setItem("studentExcel", file.name);
    }
  }

  function handleAnswerScripts(event) {
    const files = event.target.files;
    if (files && files.length > 0) {
      const names = Array.from(files).map((f) => f.name);
      setAnswerScripts(names);
      localStorage.setItem("answerScripts", JSON.stringify(names));
    }
  }

  function handleLogout() {
    localStorage.removeItem("facultyTeacherId");
    navigate("/faculty-login");
  }

  if (!teacher) return null;

  const totalEvaluated = teacher.subjects.reduce((sum, item) => sum + item.evaluated, 0);
  const totalPending = teacher.subjects.reduce((sum, item) => sum + item.pending, 0);
  const totalInProgress = teacher.subjects.reduce((sum, item) => sum + item.inProgress, 0);

  return (
    <div className="faculty-dashboard">
      <div className="faculty-login-header">
        <div>
          <p className="small-label">Faculty Dashboard</p>
          <h1>Welcome, {teacher.name}</h1>
          <p className="sub-label">Manage uploads and review subject progress.</p>
        </div>
        <button className="secondary-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="faculty-login-summary">
        <div className="faculty-stat stat-primary">
          <h3>Subjects Managed</h3>
          <p>{teacher.subjects.length}</p>
        </div>
        <div className="faculty-stat stat-secondary">
          <h3>Evaluated</h3>
          <p>{totalEvaluated}</p>
        </div>
        <div className="faculty-stat stat-warning">
          <h3>Pending</h3>
          <p>{totalPending}</p>
        </div>
        <div className="faculty-stat stat-info">
          <h3>In Progress</h3>
          <p>{totalInProgress}</p>
        </div>
      </div>

      <div className="subject-status-table-section">
        <h2>Subject Progress Overview</h2>
        <table className="subject-status-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Evaluated</th>
              <th>Pending</th>
              <th>In Progress</th>
            </tr>
          </thead>
          <tbody>
            {teacher.subjects.map((subject, index) => (
              <tr key={index}>
                <td><button className="subject-link" onClick={() => navigate(`/faculty-upload/${subject.code}`)}>{subject.name}</button></td>
                <td>{subject.evaluated}</td>
                <td>{subject.pending}</td>
                <td>{subject.inProgress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>📄 Question Paper</h3>
          <input
            ref={questionPaperRef}
            type="file"
            hidden
            accept=".pdf,.doc,.docx"
            onChange={handleQuestionPaper}
          />
          <button className="card-btn" onClick={() => questionPaperRef.current?.click()}>
            Upload Question Paper
          </button>
          <p className="status-text">
            {questionPaper ? `✅ ${questionPaper}` : "No question paper uploaded yet."}
          </p>
        </div>

        <div className="dashboard-card">
          <h3>🔑 Answer Key</h3>
          <input
            ref={answerKeyRef}
            type="file"
            hidden
            accept=".pdf,.doc,.docx"
            onChange={handleAnswerKey}
          />
          <button className="card-btn" onClick={() => answerKeyRef.current?.click()}>
            Upload Answer Key
          </button>
          <p className="status-text">
            {answerKey ? `✅ ${answerKey}` : "No answer key uploaded yet."}
          </p>
        </div>

        <div className="dashboard-card">
          <h3>📊 Student Details Excel</h3>
          <input
            ref={studentExcelRef}
            type="file"
            hidden
            accept=".xlsx,.xls,.csv"
            onChange={handleStudentExcel}
          />
          <button className="card-btn" onClick={() => studentExcelRef.current?.click()}>
            Upload Student Details
          </button>
          <p className="status-text">
            {studentExcel ? `✅ ${studentExcel}` : "No student details uploaded yet."}
          </p>
        </div>

        <div className="dashboard-card">
          <h3>📝 Student Answer Scripts</h3>
          <input
            ref={answerScriptsRef}
            type="file"
            hidden
            multiple
            accept=".pdf,.jpg,.png"
            onChange={handleAnswerScripts}
          />
          <button className="card-btn" onClick={() => answerScriptsRef.current?.click()}>
            Upload Student Scripts
          </button>
          <p className="status-text">
            {answerScripts.length > 0 ? `✅ ${answerScripts.length} file(s)` : "No student scripts uploaded yet."}
          </p>
        </div>
      </div>

      <div className="faculty-upload-section">
        <h2>Subjects Currently Handled</h2>
        <div className="subject-grid">
          {teacher.subjects.map((subject, index) => (
            <div className="subject-card" key={index}>
              <div className="subject-card-top">
                <div>
                  <p className="subject-code">{subject.code}</p>
                  <button className="subject-title-link" onClick={() => navigate(`/faculty-upload/${subject.code}`)}>{subject.name}</button>
                </div>
                <div className="subject-tag">Active</div>
              </div>
              <div className="subject-stats">
                <div>
                  <p>Evaluated</p>
                  <strong>{subject.evaluated}</strong>
                </div>
                <div>
                  <p>Pending</p>
                  <strong>{subject.pending}</strong>
                </div>
                <div>
                  <p>In Progress</p>
                  <strong>{subject.inProgress}</strong>
                </div>
              </div>
              <div className="subject-footer">
                <p>Last updated {subject.lastEvaluated}</p>
                <div className="subject-actions">
                  <button className="card-btn" onClick={() => navigate("/faculty-evaluate")}>View Evaluations</button>
                  <button className="optional-btn" onClick={() => navigate(`/faculty-upload/${subject.code}`)}>Evaluate subject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="action-buttons">
        <button className="main-upload-btn" onClick={() => navigate("/faculty-evaluate")}>Go to Evaluation Page</button>
        <button className="secondary-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default FacultyDashboard;
