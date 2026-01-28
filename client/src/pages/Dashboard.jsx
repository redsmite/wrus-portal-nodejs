import { NavLink, Outlet } from "react-router-dom";

export default function Dashboard({ setIsAuthenticated }) {
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false); // 🔑 THIS IS THE KEY
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: "220px", background: "#1e293b", color: "#fff", padding: "1rem" }}>
        <h3>WRUS</h3>

        <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <NavLink to="permits">Permits</NavLink>
          <NavLink to="water-users">Water Users</NavLink>
          <NavLink to="mobile-form">Mobile Form</NavLink>
          <NavLink to="map">Map</NavLink>
        </nav>

        <button onClick={logout} style={{ marginTop: "2rem" }}>
          Logout
        </button>
      </aside>

      <main style={{ flex: 1, padding: "1.5rem" }}>
        <Outlet />
      </main>
    </div>
  );
}
