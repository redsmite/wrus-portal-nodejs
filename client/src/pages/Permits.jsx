import { useEffect, useState } from "react";

const PAGE_SIZE = 10;

export default function Permits() {
  const [permits, setPermits] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPermits();
  }, []);

  async function fetchPermits() {
    try {
      const res = await fetch("http://localhost:3000/api/permits");
      const data = await res.json();
      setPermits(data);
    } catch (err) {
      console.error("Failed to fetch permits:", err);
    } finally {
      setLoading(false);
    }
  }

  // Pagination logic
  const totalPages = Math.ceil(permits.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentPermits = permits.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  if (loading) {
    return <p>Loading permits...</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Permits</h2>

      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Permit No</th>
            <th className="border p-2">Permittee</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {currentPermits.map((permit) => (
            <tr key={permit.id}>
              <td className="border p-2">{permit.permit_no}</td>
              <td className="border p-2">{permit.permittee}</td>
              <td className="border p-2">{permit.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="flex gap-2 mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          ◀ Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
          (page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                fontWeight: page === currentPage ? "bold" : "normal",
              }}
            >
              {page}
            </button>
          )
        )}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}
