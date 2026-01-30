import { useEffect, useState } from "react";
import "./Permits.css";

const PAGE_SIZE = 10;

export default function Permits() {
  const [permits, setPermits] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPermits();
  }, []);

  async function fetchPermits() {
    try {
      const res = await fetch("http://localhost:5000/api/permits");
      const data = await res.json();
      setPermits(data);
    } catch (err) {
      console.error("Failed to fetch permits:", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredPermits = permits.filter((p) =>
    Object.values(p).join(" ").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPermits.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentPermits = filteredPermits.slice(startIndex, startIndex + PAGE_SIZE);

  if (loading) return <p className="loading-text">Loading permits...</p>;

  return (
    <div className="permits-container">
      <h2 className="permits-title">Permits</h2>

      {/* Search */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search permits..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="search-input"
        />
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="permits-table">
          <thead>
            <tr>
              <th>Permit</th>
              <th>Grantee</th>
              <th>Location</th>
              <th>Source</th>
              <th>Type</th>
              <th>Purpose</th>
              <th>Date App</th>
            </tr>
          </thead>
          <tbody>
            {currentPermits.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  No permits found.
                </td>
              </tr>
            ) : (
              currentPermits.map((p, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "row-even" : "row-odd"}>
                  <td>{p.Permit}</td>
                  <td>{p.Grantee}</td>
                  <td>{p.Location}</td>
                  <td>{p.Source}</td>
                  <td>{p.Type}</td>
                  <td>{p.Purpose}</td>
                  <td>{p.Date_App ? new Date(p.Date_App).toLocaleDateString() : ""}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          ◀ Prev
        </button>
        <span>
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}
