import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../services/socket";

function Loading() {
  const navigate = useNavigate();

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    socket.onopen = () => {
      console.log("✅ WebSocket Connected");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        setLogs((prev) => [...prev, data.message]);

        if (data.message === "✅ Evaluation Completed") {
          setTimeout(() => {
            navigate("/results");
          }, 1000);
        }
      } catch (err) {
        console.error("Invalid WebSocket message:", err);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    socket.onclose = () => {
      console.log("🔌 WebSocket Disconnected");
    };

    // Cleanup
    return () => {
      socket.onopen = null;
      socket.onmessage = null;
      socket.onerror = null;
      socket.onclose = null;
    };
  }, [navigate]);

  return (
    <div className="loading-page">
      <div className="loading-card">
        <h1>AI Evaluation in Progress</h1>

        <p>Please wait while the answer script is analysed.</p>

        <div className="steps">
          {logs.length === 0 ? (
            <div className="active">⏳ Waiting for backend...</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="completed">
                ✔ {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Loading;
