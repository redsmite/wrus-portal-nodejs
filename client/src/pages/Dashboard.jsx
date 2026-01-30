import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Dashboard({ setIsAuthenticated }) {
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar onLogout={logout} />

      <main style={{ flex: 1, padding: "1.5rem" }}>
        <Outlet />
      </main>
    </div>
  );
}
