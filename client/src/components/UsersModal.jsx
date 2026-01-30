import React, { useEffect, useState } from "react";
import axios from "axios";

const UsersModal = ({ barangay, show, onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [mapData, setMapData] = useState(null);
  const [mapLoading, setMapLoading] = useState(false);
  const [mapError, setMapError] = useState(null);

  const displayBarangay = barangay || "Unknown Barangay";

  useEffect(() => {
    if (show && barangay) {
      fetchUsers();
    } else {
      setUsers([]);
      setMapData(null);
    }
  }, [show, barangay]);

  // Fetch users in this barangay
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get("http://localhost:5000/api/water-users", {
        params: { barangay },
      });

      const usersData = Array.isArray(res.data?.data) ? res.data.data : [];
      setUsers(usersData);

      if (!Array.isArray(res.data?.data)) {
        console.warn("Unexpected response:", res.data);
      }
    } catch (err) {
      console.error("❌ Failed to fetch users:", err);
      setError("Failed to load users. Please try again later.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle "View Map" click
  const handleViewMap = (user) => {
    if (!user.latitude || !user.longitude) {
      setMapError("No coordinates available for this user.");
      return;
    }

    setMapData({
      owner: user.owner,
      latitude: user.latitude,
      longitude: user.longitude,
    });

    alert(
      `Map data fetched for ${user.owner}.\nLatitude: ${user.latitude}\nLongitude: ${user.longitude}`
    );
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex="-1"
      aria-modal="true"
      role="dialog"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Water Users in {displayBarangay}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {loading && <p>Loading users...</p>}
            {error && <p className="text-danger">{error}</p>}

            {!loading && !error && users.length === 0 && (
              <p>No users found for {displayBarangay}.</p>
            )}

            {!loading && !error && users.length > 0 && (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Owner</th>
                    <th>Location</th>
                    <th>View Map</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.owner || Math.random()}>
                      <td>{u.owner || "Unknown Owner"}</td>
                      <td>{u.location || "Unknown Location"}</td>
                      <td>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleViewMap(u)}
                        >
                          {mapLoading ? "Loading..." : "View"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {mapError && <p className="text-danger mt-2">{mapError}</p>}

            {mapData && (
              <div className="mt-3">
                <p>
                  Map data for <strong>{mapData.owner}</strong>:
                  <br />
                  Latitude: {mapData.latitude}
                  <br />
                  Longitude: {mapData.longitude}
                </p>
                {/* TODO: Implement Leaflet map here */}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersModal;
