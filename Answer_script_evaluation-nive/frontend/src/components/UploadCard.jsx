import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function UploadCard() {
  const navigate = useNavigate();

  const [filesList, setFilesList] = useState([]);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleFolderSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    // Filter for PDF files
    const pdfFiles = selectedFiles.filter(f => f.name.toLowerCase().endsWith(".pdf"));
    
    const parsedFiles = pdfFiles.map(file => {
      const baseName = file.name.substring(0, file.name.lastIndexOf("."));
      const parts = baseName.split("_");
      let registerNumber = "";
      let studentName = "";
      
      if (parts.length >= 2) {
        registerNumber = parts[0].trim();
        studentName = parts.slice(1).join("_").trim();
      } else {
        studentName = baseName.trim();
        registerNumber = "UNKNOWN";
      }

      return {
        file,
        name: file.name,
        studentName,
        registerNumber,
        status: "pending",
        error: ""
      };
    });

    setFilesList(parsedFiles);
  };

  const startBatchEvaluation = async () => {
    if (filesList.length === 0) {
      alert("Please select a folder containing PDF files.");
      return;
    }

    setIsEvaluating(true);

    for (let index = 0; index < filesList.length; index++) {
      const item = filesList[index];
      
      // Update status to evaluating
      setFilesList(prev => prev.map((f, i) => i === index ? { ...f, status: "evaluating" } : f));

      const formData = new FormData();
      formData.append("student_name", item.studentName);
      formData.append("register_number", item.registerNumber);
      formData.append("answer_script", item.file);

      try {
        const response = await api.post("/evaluation/evaluate", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Store result in local storage for history display
        localStorage.setItem(
          "evaluationResult",
          JSON.stringify(response.data.results),
        );

        // Update status to completed
        setFilesList(prev => prev.map((f, i) => i === index ? { ...f, status: "completed" } : f));
      } catch (err) {
        console.error(`Failed to evaluate ${item.name}:`, err);
        // Update status to failed
        setFilesList(prev => prev.map((f, i) => i === index ? { ...f, status: "failed", error: err.message || "Failed" } : f));
      }
    }

    setIsEvaluating(false);
  };

  return (
    <div className="upload-card" style={{ maxWidth: "600px", margin: "20px auto", padding: "30px", background: "#fff", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
      <h2 style={{ marginBottom: "20px", color: "#1e293b", borderBottom: "2px solid #f1f5f9", paddingBottom: "10px" }}>Batch Upload Answer Sheets</h2>
      
      {!isEvaluating && filesList.length === 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <p style={{ color: "#64748b" }}>Select a folder containing student PDF files named as: <br /><strong><code>RegisterNo_StudentName.pdf</code></strong></p>
          <input
            type="file"
            webkitdirectory=""
            directory=""
            multiple
            onChange={handleFolderSelect}
            style={{ display: "none" }}
            id="folder-upload"
          />
          <label 
            htmlFor="folder-upload" 
            style={{ 
              padding: "15px 20px", 
              background: "#3b82f6", 
              color: "#fff", 
              borderRadius: "8px", 
              textAlign: "center", 
              cursor: "pointer", 
              fontWeight: "600",
              transition: "background 0.2s" 
            }}
            onMouseOver={(e) => e.target.style.background = "#2563eb"}
            onMouseOut={(e) => e.target.style.background = "#3b82f6"}
          >
            Select Answer Sheets Folder
          </label>
        </div>
      )}

      {(isEvaluating || filesList.length > 0) && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: "600", color: "#334155" }}>Parsed Files ({filesList.length})</span>
            {!isEvaluating && (
              <button 
                onClick={() => setFilesList([])}
                style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", fontWeight: "600" }}
              >
                Clear All
              </button>
            )}
          </div>

          <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "10px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {filesList.map((item, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", background: "#f8fafc", borderRadius: "6px", borderLeft: item.status === "completed" ? "4px solid #10b981" : item.status === "failed" ? "4px solid #ef4444" : item.status === "evaluating" ? "4px solid #3b82f6" : "4px solid #94a3b8" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>{item.registerNumber} - {item.studentName}</span>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>{item.name}</span>
                </div>
                <span style={{ 
                  fontSize: "12px", 
                  fontWeight: "600", 
                  padding: "4px 8px", 
                  borderRadius: "12px", 
                  background: item.status === "completed" ? "#d1fae5" : item.status === "failed" ? "#fee2e2" : item.status === "evaluating" ? "#dbeafe" : "#f1f5f9",
                  color: item.status === "completed" ? "#065f46" : item.status === "failed" ? "#991b1b" : item.status === "evaluating" ? "#1e40af" : "#475569"
                }}>
                  {item.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>

          {!isEvaluating && (
            <button 
              onClick={startBatchEvaluation}
              style={{ 
                padding: "12px 20px", 
                background: "#10b981", 
                color: "#fff", 
                borderRadius: "8px", 
                border: "none", 
                cursor: "pointer", 
                fontWeight: "600",
                fontSize: "16px"
              }}
            >
              Start Batch Evaluation
            </button>
          )}

          {isEvaluating && (
            <div style={{ textAlign: "center", color: "#3b82f6", fontWeight: "600" }}>
              ⏳ Evaluating Answer Sheets Sequentially...
            </div>
          )}

          {!isEvaluating && filesList.some(f => f.status === "completed") && (
            <button 
              onClick={() => navigate("/history")}
              style={{ 
                padding: "12px 20px", 
                background: "#64748b", 
                color: "#fff", 
                borderRadius: "8px", 
                border: "none", 
                cursor: "pointer", 
                fontWeight: "600",
                fontSize: "16px",
                marginTop: "-10px"
              }}
            >
              Go to History
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default UploadCard;
