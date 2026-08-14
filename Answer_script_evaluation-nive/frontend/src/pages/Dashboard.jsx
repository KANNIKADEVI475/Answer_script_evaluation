import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StatsCard from "../components/StatsCard";

import { getDashboardStats } from "../services/dashboardService";

function Dashboard() {
  const [stats, setStats] = useState({
    total_scripts: 0,
    evaluated: 0,
    pending: 0,
    average_marks: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getDashboardStats();

        setStats(data);
      } catch (err) {
        console.error("Dashboard Error:", err);

        setError("Unable to load dashboard statistics.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="content">
        <Navbar />

        {loading ? (
          <h3>Loading Dashboard...</h3>
        ) : error ? (
          <h3>{error}</h3>
        ) : (
          <div className="stats">
            <StatsCard title="Total Scripts" value={stats.total_scripts} />

            <StatsCard title="Evaluated" value={stats.evaluated} />

            <StatsCard title="Pending" value={stats.pending} />

            <StatsCard title="Average Marks" value={stats.average_marks} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
