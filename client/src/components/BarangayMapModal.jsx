import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

/* =========================
   Leaflet Marker Fix
========================= */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

/* =========================
   Auto-Fit Map Bounds
========================= */
const FitBounds = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;

    const bounds = L.latLngBounds(
      points.map(p => [p.latitude, p.longitude])
    );

    map.fitBounds(bounds, {
      padding: [40, 40],
      animate: true,
    });
  }, [points, map]);

  return null;
};

/* =========================
   Barangay Map Modal
========================= */
const BarangayMapModal = ({ city, barangay, show, onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show && city && barangay) {
      fetchUsers();
    } else {
      setUsers([]);
    }
  }, [show, city, barangay]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(
        "http://localhost:5000/api/water-users/view-map",
        { params: { city, barangay } }
      );

      /* 🔑 SUPPORT BOTH API RESPONSE TYPES */
      const rows = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      const parsedUsers = rows
        .map(u => ({
          ...u,
          latitude: Number(u.latitude),
          longitude: Number(u.longitude),
        }))
        .filter(
          u =>
            Number.isFinite(u.latitude) &&
            Number.isFinite(u.longitude)
        );

      setUsers(parsedUsers);
    } catch (err) {
      console.error("❌ Failed to load barangay map:", err);
      setError("Failed to load map data.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  /* Philippines default (fallback only) */
  const defaultCenter = [14.5995, 120.9842];

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          {/* ===== Header ===== */}
          <div className="modal-header">
            <h5 className="modal-title">
              Water Users Map – {barangay}, {city}
            </h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          {/* ===== Body ===== */}
          <div className="modal-body" style={{ height: "500px" }}>
            {loading && <p>Loading map…</p>}
            {error && <p className="text-danger">{error}</p>}

            {!loading && !error && users.length === 0 && (
              <p>No map data available for this barangay.</p>
            )}

            {!loading && !error && users.length > 0 && (
              <MapContainer
                center={defaultCenter}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />

                <FitBounds points={users} />

                {users.map((u, idx) => (
                  <Marker
                    key={`${u.owner}-${idx}`}
                    position={[u.latitude, u.longitude]}
                  >
                    <Popup>
                      <strong>{u.owner}</strong>
                      <br />
                      {u.street || "No street information"}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>

          {/* ===== Footer ===== */}
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

export default BarangayMapModal;
