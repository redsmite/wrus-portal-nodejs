import React, { useEffect, useState } from "react";
import axios from "axios";
import UsersModal from "./UsersModal.jsx";
import BarangayMapModal from "./BarangayMapModal.jsx";

const BarangayModal = ({ city, show, onClose }) => {
  const [barangays, setBarangays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  const displayCity = city || "Unknown City";

  useEffect(() => {
    if (show && city) {
      fetchBarangays();
    } else {
      setBarangays([]);
    }
  }, [show, city]);

  const fetchBarangays = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(
        `http://localhost:5000/api/water-users/barangays`,
        { params: { city } } // city parameter only
      );

      if (Array.isArray(res.data)) setBarangays(res.data);
      else setBarangays([]);
    } catch (err) {
      console.error("❌ Failed to fetch barangays:", err);
      setError("Failed to load barangays. Please try again later.");
      setBarangays([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewUsers = (barangay) => {
    setSelectedBarangay(barangay || "Unknown Barangay");
    setShowUsersModal(true);
  };

  const handleViewMap = (barangay) => {
    setSelectedBarangay(barangay || "Unknown Barangay");
    setShowMapModal(true);
  };

  if (!show) return null;

  return (
    <>
      <div
        className="modal fade show"
        style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        tabIndex="-1"
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Barangays in {displayCity}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              {loading && <p>Loading barangays...</p>}
              {error && <p className="text-danger">{error}</p>}
              {!loading && !error && barangays.length === 0 && (
                <p>No barangays found for {displayCity}.</p>
              )}
              {!loading && !error && barangays.length > 0 && (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Barangay</th>
                      <th>View Users</th>
                      <th>View Map</th>
                    </tr>
                  </thead>
                  <tbody>
                    {barangays.map((b) => (
                      <tr key={b.barangay || Math.random()}>
                        <td>{b.barangay || "Unknown Barangay"}</td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleViewUsers(b.barangay)}
                          >
                            View Users
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleViewMap(b.barangay)}
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

      {/* Nested Users Modal */}
      <UsersModal
        barangay={selectedBarangay}
        show={showUsersModal}
        onClose={() => setShowUsersModal(false)}
      />
      <BarangayMapModal
        city={city}
        barangay={selectedBarangay}
        show={showMapModal}
        onClose={() => setShowMapModal(false)}
      />
    </>
  );
};

export default BarangayModal;
