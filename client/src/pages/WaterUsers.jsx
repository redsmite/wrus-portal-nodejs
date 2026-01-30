import { useState, useEffect, useRef } from "react";

const PAGE_SIZE = 10;
const DEBOUNCE_DELAY = 300; // ms

export default function WaterUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const debounceRef = useRef(null);

  useEffect(() => {
    fetchWaterUsers(page, searchTerm);
  }, [page, searchTerm]);

  function handleSearchChange(e) {
    const value = e.target.value;

    // Clear previous debounce
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // Set new debounce
    debounceRef.current = setTimeout(() => {
      setPage(1); // reset to first page
      setSearchTerm(value);
    }, DEBOUNCE_DELAY);
  }

  async function fetchWaterUsers(pageNumber, search) {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/water-users?page=${pageNumber}&pageSize=${PAGE_SIZE}&search=${encodeURIComponent(
          search
        )}`
      );
      const json = await res.json();
      setUsers(json.data);
      setTotalPages(json.totalPages);
    } catch (err) {
      console.error("Failed to fetch water users:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Water Users</h2>

      {/* Search Bar */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search by owner or location..."
          className="form-control"
          defaultValue={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {loading ? (
        <p>Loading water users...</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table table-bordered table-striped">
              <thead className="table-light">
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
                {(users || []).map((u, idx) => (
                  <tr key={idx}>
                    <td>{u.owner}</td>
                    <td>{u.location}</td>
                    <td>{u.latitude}</td>
                    <td>{u.longitude}</td>
                    <td>{u.type}</td>
                    <td>{u.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <button
              className="btn btn-secondary"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ◀ Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              className="btn btn-secondary"
              disabled={page === totalPages}
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
