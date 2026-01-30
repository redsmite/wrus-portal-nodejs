import { useEffect, useState } from "react";
import "./PermitteeStatistics.css";

export default function PermitteeStatistics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  async function fetchStatistics() {
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/dashboard/permittee-statistics"
      );
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch permittee statistics:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return <p className="loading-text">Loading Permittee Statistics...</p>;

  return (
    <div className="permittee-statistics">
      <h2 className="dashboard-title">Permittee Statistics</h2>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>City</th>
            <th>Numbers Inspected</th>
            <th>Total Number of Permits</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={index}>
                <td>{row.city}</td>
                <td>{row.numbers_visited}</td>
                <td>{row.total_permits}</td>
                <td>
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: `${row.percentage}%` }}
                      aria-valuenow={row.percentage}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <span>{row.percentage}%</span>
                    </div>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
