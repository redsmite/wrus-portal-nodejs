import React, { useEffect, useState } from "react";
import axios from "axios";
import BarangayModal from "../components/BarangayModal.jsx";
import MapModal from "../components/MapModal.jsx";

const MapPage = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [showBarangayModal, setShowBarangayModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");

  const [showMapModal, setShowMapModal] = useState(false);
  const [mapCity, setMapCity] = useState("");

  useEffect(() => {
    fetchGroupedCities();
  }, []);

  const fetchGroupedCities = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get("http://localhost:5000/api/water-users/grouped");
      if (Array.isArray(res.data)) setCities(res.data);
      else setCities([]);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch cities.");
      setCities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewBarangay = (city) => {
    setSelectedCity(city || "Unknown City");
    setShowBarangayModal(true);
  };

  const handleViewMap = (city) => {
    setMapCity(city || "Unknown City");
    setShowMapModal(true);
  };

  if (loading) return <p>Loading cities...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!cities.length) return <p>No cities found.</p>;

  return (
    <div className="container mt-4">
      <h2>Water Users by City</h2>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>City</th>
            <th>Number of Water Users</th>
            <th>View Barangay</th>
            <th>View Map</th>
          </tr>
        </thead>
        <tbody>
          {cities.map((c) => (
            <tr key={c.city || Math.random()}>
              <td>{c.city}</td>
              <td>{c.num_users}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleViewBarangay(c.city)}
                >
                  View
                </button>
              </td>
              <td>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => handleViewMap(c.city)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <BarangayModal
        city={selectedCity}
        show={showBarangayModal}
        onClose={() => setShowBarangayModal(false)}
      />

      <MapModal
        city={mapCity}
        show={showMapModal}
        onClose={() => setShowMapModal(false)}
      />
    </div>
  );
};

export default MapPage;
