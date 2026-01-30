import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default Leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Helper to fit map bounds
const FitBounds = ({ markers }) => {
  const map = useMap();
  React.useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map((m) => [m.latitude, m.longitude]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [markers, map]);
  return null;
};

const MapModal = ({ city, show, onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show && city) fetchUsers();
    else setUsers([]);
  }, [show, city]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(
        "http://localhost:5000/api/water-users/city-coordinates",
        { params: { city } }
      );

      // Ensure we always have an array
      const usersArray = Array.isArray(res.data?.data) ? res.data.data : [];

      if (usersArray.length === 0) {
        setError("No map data available for this city.");
        setUsers([]);
        return;
      }

      const validUsers = usersArray
        .filter((u) => u.latitude && u.longitude)
        .map((u) => ({
          ...u,
          latitude: parseFloat(u.latitude),
          longitude: parseFloat(u.longitude),
        }));

      setUsers(validUsers);
    } catch (err) {
      console.error("❌ Failed to fetch users:", err);
      setError("Failed to load map data. Please try again later.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  // fallback center if no users
  const center =
    users.length > 0
      ? [users[0].latitude, users[0].longitude]
      : [14.5833, 121.0]; // default Manila-ish

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
            <h5 className="modal-title">Map of Water Users in {city || "Unknown City"}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body" style={{ height: "500px" }}>
            {loading && <p>Loading map...</p>}
            {error && <p className="text-danger">{error}</p>}

            {!loading && users.length > 0 && (
              <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
                />
                <FitBounds markers={users} />
                {users.map((u, idx) => (
                  <Marker key={idx} position={[u.latitude, u.longitude]}>
                    <Popup>{u.owner}</Popup>
                  </Marker>
                ))}
              </MapContainer>
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

export default MapModal;
