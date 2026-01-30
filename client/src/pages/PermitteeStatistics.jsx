import { useEffect, useState } from "react";
import "./PermitteeStatistics.css";

export default function PermitteeStatistics() {
  const [data, setData] = useState([]);
  const [totals, setTotals] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
    fetchTotals();
  }, []);

  // Fetch city-level statistics
  async function fetchStatistics() {
    try {
      const res = await fetch(
        "http://localhost:5000/api/dashboard/permittee-statistics"
      );
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch permittee statistics:", err);
    }
  }

  // Fetch totals from new route
  async function fetchTotals() {
    try {
      const res = await fetch(
        "http://localhost:5000/api/dashboard/total-permits"
      );
      const json = await res.json();
      setTotals(json[0]); // server returns an array with one object
    } catch (err) {
      console.error("Failed to fetch total permits:", err);
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
            <th>Permits Inspected</th>
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
            <>
              {data.map((row, index) => (
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
              ))}

              {/* Totals Row */}
              {totals && (
                <tr className="totals-row">
                  <td><strong>Total</strong></td>
                  <td><strong>{totals.numbers_visited}</strong></td>
                  <td><strong>{totals.total_permits}</strong></td>
                  <td>
                    <div className="progress">
                      <div
                        className="progress-bar text-center"
                        role="progressbar"
                        style={{ width: `${totals.percentage}%` }}
                        aria-valuenow={totals.percentage}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                      </div>
                      <strong className="totalPercentage">{totals.percentage}%</strong>
                    </div>
                  </td>
                </tr>
              )}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}
