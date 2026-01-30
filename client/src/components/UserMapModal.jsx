import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

/* Fix Leaflet marker icons */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const UserMapModal = ({ user, show, onClose }) => {
  if (!show || !user) return null;

  const latitude = Number(user.latitude);
  const longitude = Number(user.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return (
      <div
        className="modal fade show"
        style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Map</h5>
              <button className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body text-danger">
              No valid coordinates available.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              Location – {user.owner}
            </h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body" style={{ height: "400px" }}>
            <MapContainer
              center={[latitude, longitude]}
              zoom={16}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <Marker position={[latitude, longitude]}>
                <Popup>
                  <strong>{user.owner}</strong>
                  <br />
                  {user.location || "No location info"}
                </Popup>
              </Marker>
            </MapContainer>
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

export default UserMapModal;
