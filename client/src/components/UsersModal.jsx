import React, { useEffect, useState } from "react";
import axios from "axios";
import UserMapModal from "./UserMapModal.jsx";

const UsersModal = ({ barangay, show, onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);

  const displayBarangay = barangay || "Unknown Barangay";

  useEffect(() => {
    if (show && barangay) {
      fetchUsers();
    } else {
      setUsers([]);
    }
  }, [show, barangay]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(
        "http://localhost:5000/api/water-users",
        { params: { barangay } }
      );

      setUsers(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error("❌ Failed to fetch users:", err);
      setError("Failed to load users.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMap = (user) => {
    setSelectedUser(user);
    setShowMapModal(true);
  };

  if (!show) return null;

  return (
    <>
      <div
        className="modal fade show"
        style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Water Users in {displayBarangay}
              </h5>
              <button className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              {loading && <p>Loading users…</p>}
              {error && <p className="text-danger">{error}</p>}

              {!loading && !error && users.length === 0 && (
                <p>No users found.</p>
              )}

              {!loading && !error && users.length > 0 && (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Owner</th>
                      <th>Location</th>
                      <th>Map</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, idx) => (
                      <tr key={idx}>
                        <td>{u.owner}</td>
                        <td>{u.location || "N/A"}</td>
                        <td>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleViewMap(u)}
                            disabled={!u.latitude || !u.longitude}
                          >
                            View Map
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

      {/* 🔥 Single-user map modal */}
      <UserMapModal
        user={selectedUser}
        show={showMapModal}
        onClose={() => setShowMapModal(false)}
      />
    </>
  );
};

export default UsersModal;
