import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import { getHistory } from "../services/historyServices";

function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchHistory = async () => {
      const data = await getHistory();
      if (mounted) setHistory(data);
    };

    fetchHistory();

    return () => {
      mounted = false;
    };
  }, []);

  const handleExportExcel = () => {
    window.open("http://127.0.0.1:8000/excel/download", "_blank");
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="content">
        <Navbar />

        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2>Evaluation History</h2>

          <button onClick={handleExportExcel}>📊 Export Excel</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Student</th>
              <th>Register No</th>
              <th>Marks</th>
              <th>File</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {history.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>

                <td>{item.student_name}</td>

                <td>{item.register_number}</td>

                <td>{item.total_marks}</td>

                <td>{item.filename}</td>

                <td>{new Date(item.uploaded_at).toLocaleString()}</td>

                <td>
                  <button onClick={() => navigate(`/history/${item.id}`)}>
                    👁 View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default History;
