import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false); // ✅ Tell App user logged out
    navigate("/", { replace: true });
  };

  return (
    <div className="container mt-5">
      <h1>Welcome, {user?.username}</h1>
      <p>Role: {user?.role}</p>
      <button className="btn btn-danger" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}