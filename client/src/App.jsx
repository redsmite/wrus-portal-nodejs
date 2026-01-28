import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";

import Permits from "./pages/Permits.jsx";
import WaterUsers from "./pages/WaterUsers.jsx";
import MobileForm from "./pages/MobileForm.jsx";
import MapPage from "./pages/MapPage.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  useEffect(() => {
    const syncAuth = () =>
      setIsAuthenticated(!!localStorage.getItem("token"));
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />

        {/* Dashboard Layout */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        >
          <Route index element={<Permits />} />
          <Route path="permits" element={<Permits />} />
          <Route path="water-users" element={<WaterUsers />} />
          <Route path="mobile-form" element={<MobileForm />} />
          <Route path="map" element={<MapPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
