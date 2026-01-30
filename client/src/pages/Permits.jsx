import { useEffect, useState } from "react";

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

  // Filter permits based on search term
  const filteredPermits = permits.filter((p) =>
    Object.values(p)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredPermits.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentPermits = filteredPermits.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  if (loading) return <p>Loading permits...</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem" }}>
        Permits
      </h2>

      {/* Search Bar */}
      <div style={{ marginBottom: "1rem", width: "100%" }}>
        <input
          type="text"
          placeholder="Search permits..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
          style={{
            width: "100%",
            padding: "0.5rem",
            borderRadius: "0.25rem",
            border: "1px solid #ccc",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", border: "1px solid #ccc", borderRadius: "0.25rem" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
          <thead style={{ backgroundColor: "#f3f3f3", position: "sticky", top: 0 }}>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Permit</th>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Grantee</th>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Location</th>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Source</th>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Type</th>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Purpose</th>
              <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Date App</th>
            </tr>
          </thead>
          <tbody>
            {currentPermits.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "1rem" }}>
                  No permits found.
                </td>
              </tr>
            ) : (
              currentPermits.map((p, idx) => (
                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#fff" : "#f9f9f9" }}>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{p.Permit}</td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{p.Grantee}</td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{p.Location}</td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{p.Source}</td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{p.Type}</td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{p.Purpose}</td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                    {p.Date_App ? new Date(p.Date_App).toLocaleDateString() : ""}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          style={{ padding: "0.5rem 1rem" }}
        >
          ◀ Prev
        </button>
        <span>
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((p) => p + 1)}
          style={{ padding: "0.5rem 1rem" }}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}
