import { useState, useEffect, useRef } from "react";
import "./WaterUsers.css";

const PAGE_SIZE = 10;
const DEBOUNCE_DELAY = 300; // milliseconds

export default function WaterUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [inputValue, setInputValue] = useState(""); // immediate input
  const [searchTerm, setSearchTerm] = useState(""); // debounced search

  const debounceRef = useRef(null);

  // Fetch users whenever page or searchTerm changes
  useEffect(() => {
    fetchWaterUsers(page, searchTerm);
  }, [page, searchTerm]);

  // Handle search input with debounce
  function handleSearchChange(e) {
    const value = e.target.value;
    setInputValue(value); // immediate UI update

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setPage(1); // reset to first page on new search
      setSearchTerm(value); // trigger fetch
    }, DEBOUNCE_DELAY);
  }

  async function fetchWaterUsers(pageNumber, search) {
    setLoading(true);
    try {
      const url = `http://localhost:5000/api/water-users?page=${pageNumber}&pageSize=${PAGE_SIZE}${
        search ? `&search=${encodeURIComponent(search)}` : ""
      }`;

      const res = await fetch(url);
      const json = await res.json();
      setUsers(json.data || []);
      setTotalPages(json.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch water users:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="water-users-container">
      <h2 className="water-users-title">Water Users</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by owner or location..."
          className="search-input"
          value={inputValue}
          onChange={handleSearchChange}
        />
      </div>

      {loading ? (
        <p className="loading-text">Loading water users...</p>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="water-users-table">
              <thead>
                <tr>
                  <th>Owner</th>
                  <th>Location</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th>Type</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      No results found
                    </td>
                  </tr>
                ) : (
                  users.map((u, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "row-even" : "row-odd"}>
                      <td>{u.owner}</td>
                      <td>{u.location}</td>
                      <td>{u.latitude}</td>
                      <td>{u.longitude}</td>
                      <td>{u.type}</td>
                      <td>{u.remarks}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              className="btn"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ◀ Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              className="btn"
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage((p) => p + 1)}
            >
              Next ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
}
