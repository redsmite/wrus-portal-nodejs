import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar({ onLogout }) {
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    isActive
      ? "nav-link active bg-primary text-white rounded"
      : "nav-link text-white";

  return (
    <aside
      className="d-flex flex-column p-3"
      style={{ width: "220px", background: "#1e293b" }}
    >
      <h3
        className="text-white mb-4 cursor-pointer"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/dashboard")}
      >
        WRUS Portal
      </h3>

      <nav className="nav nav-pills flex-column gap-2 flex-grow-1">
        <NavLink to="/dashboard/permits" className={linkClass}>
          Permits
        </NavLink>
        <NavLink to="/dashboard/water-users" className={linkClass}>
          Water Users
        </NavLink>
        <NavLink to="/dashboard/mobile-form" className={linkClass}>
          Mobile Form
        </NavLink>
        <NavLink to="/dashboard/map" className={linkClass}>
          Map
        </NavLink>
      </nav>

      <button onClick={onLogout} className="btn btn-danger mt-3">
        Logout
      </button>
    </aside>
  );
}
