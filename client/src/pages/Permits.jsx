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
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Permits</h2>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search permits..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1); // reset to first page
        }}
        className="border p-2 mb-4 w-full rounded"
      />

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Permit</th>
              <th className="border p-2">Grantee</th>
              <th className="border p-2">Location</th>
              <th className="border p-2">Source</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Purpose</th>
              <th className="border p-2">Date App</th>
            </tr>
          </thead>
          <tbody>
            {currentPermits.map((p, index) => (
              <tr key={index}>
                <td className="border p-2">{p.Permit}</td>
                <td className="border p-2">{p.Grantee}</td>
                <td className="border p-2">{p.Location}</td>
                <td className="border p-2">{p.Source}</td>
                <td className="border p-2">{p.Type}</td>
                <td className="border p-2">{p.Purpose}</td>
                <td className="border p-2">
                  {p.Date_App ? new Date(p.Date_App).toLocaleDateString() : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center gap-2 mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          ◀ Prev
        </button>

        <span>
          Page {currentPage} of {totalPages}
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
