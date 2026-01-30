import { useState } from "react";
import YearlyAccomplishment from "./YearlyAccomplishment.jsx";
import PermitteeStatistics from "./PermitteeStatistics.jsx";
import "./DashboardHome.css";

export default function DashboardHome() {
  const [activeTab, setActiveTab] = useState("yearly");

  return (
    <div className="dashboard-home-container">
      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "yearly" ? "active" : ""}`}
            onClick={() => setActiveTab("yearly")}
          >
            Yearly Accomplishment
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "permittee" ? "active" : ""}`}
            onClick={() => setActiveTab("permittee")}
          >
            Permittee Statistics
          </button>
        </li>
      </ul>

      {/* Tab content */}
      {activeTab === "yearly" && <YearlyAccomplishment />}
      {activeTab === "permittee" && <PermitteeStatistics />}
    </div>
  );
}
