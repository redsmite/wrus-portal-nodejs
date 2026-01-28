import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    isActive
      ? "block p-3 mb-2 bg-primary text-white rounded"
      : "block p-3 mb-2 hover:bg-primary/50 rounded";

  return (
    <div className="w-60 bg-light vh-100 p-3 shadow">
      <h2 className="mb-4 text-center fw-bold">Admin Dashboard</h2>
      <nav>
        <NavLink to="/dashboard/permits" className={linkClass}>Permits</NavLink>
        <NavLink to="/dashboard/water-users" className={linkClass}>Water Users</NavLink>
        <NavLink to="/dashboard/mobile-form" className={linkClass}>Mobile Form</NavLink>
        <NavLink to="/dashboard/map" className={linkClass}>Map</NavLink>
      </nav>
    </div>
  );
}
