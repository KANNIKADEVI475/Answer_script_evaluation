import { useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import teachers from "../data/teachers";
import "./../App.css";

function parseStudents(file) {
  return file.text().then((text) => {
    const rows = text.trim().split(/\r?\n/).filter(Boolean);
    if (rows.length < 2) return [];
    const headers = rows[0].split(",").map((value) => value.trim().toLowerCase());
    const registerIndex = headers.findIndex((value) => ["register number", "register_number", "regno", "student id", "student_id"].includes(value));
    const nameIndex = headers.findIndex((value) => ["name", "student name", "student_name"].includes(value));
    if (registerIndex < 0) throw new Error("The CSV needs a Register Number, RegNo, or Student ID column.");
    return rows.slice(1).map((row) => {
      const values = row.split(",").map((value) => value.trim());
      return { registerNumber: values[registerIndex], name: values[nameIndex] || "Student" };
    }).filter((student) => student.registerNumber);
  });
}

function FacultyUpload() {
  const { subjectCode } = useParams();
  const navigate = useNavigate();
  const teacher = teachers[localStorage.getItem("facultyTeacherId")];
  const subject = teacher?.subjects.find((item) => item.code === subjectCode);
  const questionRef = useRef(null);
  const keyRef = useRef(null);
  const rosterRef = useRef(null);
  const scriptsRef = useRef(null);
  const [questionPaper, setQuestionPaper] = useState(null);
  const [answerKey, setAnswerKey] = useState(null);
  const [rosterFile, setRosterFile] = useState(null);
  const [scripts, setScripts] = useState([]);
  const [students, setStudents] = useState([]);
  const [registerNumber, setRegisterNumber] = useState("");
  const [studentName, setStudentName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const verification = useMemo(() => {
    if (!students.length || !scripts.length) return null;
    const scriptIds = new Set(scripts.map((file) => file.name.split(".")[0].trim().toUpperCase()));
    const rosterIds = new Set(students.map((student) => student.registerNumber.toUpperCase()));
    const matched = students.filter((student) => scriptIds.has(student.registerNumber.toUpperCase()));
    const missing = students.filter((student) => !scriptIds.has(student.registerNumber.toUpperCase()));
    const unknown = scripts.filter((file) => !rosterIds.has(file.name.split(".")[0].trim().toUpperCase()));
    return { matched, missing, unknown };
  }, [students, scripts]);

  if (!teacher) {
    navigate("/faculty-login", { replace: true });
    return null;
  }

  function selectRoster(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setRosterFile(file);
    setError("");
    parseStudents(file).then(setStudents).catch((parseError) => {
      setStudents([]);
      setError(parseError.message);
    });
  }

  function addStudent(event) {
    event.preventDefault();
    const id = registerNumber.trim().toUpperCase();
    const name = studentName.trim();
    if (!id || !name) {
      setError("Enter both the register number and student name.");
      return;
    }
    if (students.some((student) => student.registerNumber.toUpperCase() === id)) {
      setError("That register number is already in the student list.");
      return;
    }
    setStudents((current) => [...current, { registerNumber: id, name }]);
    setRegisterNumber("");
    setStudentName("");
    setError("");
  }

  function startEvaluation() {
    if (!questionPaper || !answerKey || students.length === 0 || scripts.length === 0) {
      setError("Upload the question paper and answer key, add student details, and upload answer scripts before evaluating.");
      return;
    }
    if (verification?.missing.length || verification?.unknown.length) {
      setError("Resolve the student verification issues before starting evaluation.");
      return;
    }
    setError("");
    setMessage(`Verified ${verification?.matched.length || 0} students. ${subject?.name || "This subject"} is ready for evaluation.`);
  }

  return (
    <main className="subject-upload-page">
      <header className="upload-workspace-header">
        <div><button className="back-link" onClick={() => navigate("/faculty-dashboard")}>← Back to dashboard</button><p className="small-label">Subject upload workspace</p><h1>{subject ? subject.name : "Subject uploads"}</h1><p className="sub-label">{subject ? `${subject.code} · Upload and verify documents before evaluation.` : "Choose a subject from your dashboard to begin."}</p></div>
      </header>

      {!subject ? <p className="error-text">Subject not found. Return to the dashboard and select a subject.</p> : <>
        <section className="upload-steps">
          <article className={questionPaper ? "upload-step complete" : "upload-step"}><span>01</span><h2>Question paper</h2><p>Upload the exam question paper.</p><input ref={questionRef} type="file" hidden accept=".pdf,.doc,.docx" onChange={(event) => setQuestionPaper(event.target.files?.[0] || null)} /><button className="card-btn" onClick={() => questionRef.current?.click()}>Select question paper</button><small>{questionPaper ? questionPaper.name : "No file selected"}</small></article>
          <article className={answerKey ? "upload-step complete" : "upload-step"}><span>02</span><h2>Answer key</h2><p>Upload the faculty-approved key.</p><input ref={keyRef} type="file" hidden accept=".pdf,.doc,.docx" onChange={(event) => setAnswerKey(event.target.files?.[0] || null)} /><button className="card-btn" onClick={() => keyRef.current?.click()}>Select answer key</button><small>{answerKey ? answerKey.name : "No file selected"}</small></article>
          <article className={students.length ? "upload-step complete" : "upload-step"}><span>03</span><h2>Student details</h2><p>Upload a CSV roster or add students manually below.</p><input ref={rosterRef} type="file" hidden accept=".csv" onChange={selectRoster} /><button className="card-btn" onClick={() => rosterRef.current?.click()}>Select student CSV</button><small>{students.length ? `${students.length} students added` : "CSV: Register Number, Name"}</small></article>
          <article className={scripts.length ? "upload-step complete" : "upload-step"}><span>04</span><h2>Answer scripts</h2><p>Name every script using its register number.</p><input ref={scriptsRef} type="file" hidden multiple accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => setScripts(Array.from(event.target.files || []))} /><button className="card-btn" onClick={() => scriptsRef.current?.click()}>Select answer scripts</button><small>{scripts.length ? `${scripts.length} script(s) selected` : "Example: TS0445.pdf"}</small></article>
        </section>

        <section className="student-entry-panel">
          <div><p className="small-label">Student roster</p><h2>Add student details quickly</h2><p>Use this option when only a few students are present, or use the CSV upload for a full class list.</p></div>
          <form className="student-entry-form" onSubmit={addStudent}>
            <input value={registerNumber} onChange={(event) => setRegisterNumber(event.target.value)} placeholder="Register number" aria-label="Register number" />
            <input value={studentName} onChange={(event) => setStudentName(event.target.value)} placeholder="Student name" aria-label="Student name" />
            <button className="card-btn" type="submit">Add student</button>
          </form>
          {students.length > 0 && <div className="student-chip-list">{students.map((student) => <span key={student.registerNumber}>{student.registerNumber} · {student.name}<button type="button" aria-label={`Remove ${student.name}`} onClick={() => setStudents((current) => current.filter((item) => item.registerNumber !== student.registerNumber))}>×</button></span>)}</div>}
        </section>

        <section className="verification-panel"><div><p className="small-label">Student verification</p><h2>Match scripts to the class roster</h2><p>Use a CSV with <b>Register Number</b> and <b>Name</b>. Name each script exactly with its register number, such as <code>TS0445.pdf</code>.</p></div>{verification ? <div className="verification-results"><div className="verify-good"><strong>{verification.matched.length}</strong><span>Verified</span></div><div className="verify-warn"><strong>{verification.missing.length}</strong><span>Missing scripts</span></div><div className="verify-bad"><strong>{verification.unknown.length}</strong><span>Unknown scripts</span></div></div> : <p className="verification-empty">Upload both the roster and scripts to verify students.</p>}</section>
        {verification && (verification.missing.length > 0 || verification.unknown.length > 0) && <div className="verification-list"><p>{verification.missing.length > 0 && `Missing: ${verification.missing.map((student) => student.registerNumber).join(", ")}`}</p><p>{verification.unknown.length > 0 && `Not in roster: ${verification.unknown.map((file) => file.name).join(", ")}`}</p></div>}
        {error && <p className="error-text">{error}</p>}{message && <p className="success-text">{message}</p>}
        <div className="upload-workspace-actions"><button className="main-upload-btn" onClick={startEvaluation}>Verify and start evaluation</button></div>
      </>}
    </main>
  );
}

export default FacultyUpload;
