import { useEffect, useState, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList
} from "recharts";
import "./YearlyAccomplishment.css";

export default function YearlyAccomplishment() {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  const [target, setTarget] = useState(100);
  const [editing, setEditing] = useState(false);
  const [newTarget, setNewTarget] = useState(target);
  const [totalUsers, setTotalUsers] = useState(0);

  const cardRef = useRef(null);

  useEffect(() => {
    fetchSummary();
    fetchTarget();
    fetchTotalUsers();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (editing && cardRef.current && !cardRef.current.contains(event.target)) {
        setEditing(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editing]);

  // Fetch yearly accomplishments
  async function fetchSummary() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/dashboard/home");
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error("Failed to fetch dashboard summary:", err);
    } finally {
      setLoading(false);
    }
  }

  // Fetch annual target
  async function fetchTarget() {
    try {
      const res = await fetch("http://localhost:5000/api/dashboard/target");
      const data = await res.json();
      if (data.target) {
        setTarget(data.target);
        setNewTarget(data.target);
      }
    } catch (err) {
      console.error("Failed to fetch target:", err);
    }
  }

  // Fetch total water users
  async function fetchTotalUsers() {
    try {
      const res = await fetch("http://localhost:5000/api/dashboard/total-users");
      const data = await res.json();
      setTotalUsers(data.total_users);
    } catch (err) {
      console.error("Failed to fetch total users:", err);
    }
  }

  // Save new annual target
  async function saveTarget() {
    try {
      const res = await fetch("http://localhost:5000/api/dashboard/target", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: newTarget })
      });
      if (res.ok) {
        setTarget(newTarget);
        setEditing(false);
      } else {
        console.error("Failed to save target");
      }
    } catch (err) {
      console.error("Error saving target:", err);
    }
  }

  if (loading) return <p className="loading-text">Loading dashboard summary...</p>;

  return (
    <div className="dashboard-home-container">
      {/* Flash Card + Total Users */}
      <div className="flash-card-wrapper flex-row">
        {/* Annual Target Flash Card */}
        <div
          ref={cardRef}
          className={`flash-card ${editing ? "flipped" : ""}`}
          onClick={() => !editing && setEditing(true)}
        >
          <div className="flash-card-front">
            <span>{new Date().getFullYear()} Annual target</span>
            <span className="flash-card-text-span">{target} Water Sources</span>
          </div>
          <div className="flash-card-back">
            <span>Edit Water Sources</span>
            <input
              type="number"
              value={newTarget}
              onChange={(e) => setNewTarget(parseInt(e.target.value || 0))}
            />
            <div>
              <button onClick={saveTarget} className="btn-save">Save</button>
            </div>
          </div>
        </div>

        {/* Total Water Users Card */}
        <div className="total-users-card">
          <span>Total Water Users Inspected</span>
          <span className="total-users-number">{totalUsers}</span>
        </div>
      </div>

      {/* Title */}
      <h2 className="dashboard-title">Summary of Accomplishments</h2>

      {/* Chart */}
      {summary.length === 0 ? (
        <p className="no-data">No data available</p>
      ) : (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              layout="vertical"
              data={summary}
              margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="year_conducted" />
              <Tooltip />
              <Bar dataKey="total" fill="#4f46e5" radius={[5, 5, 5, 5]}>
                <LabelList dataKey="total" position="right" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
