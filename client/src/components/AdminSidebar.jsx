import React from "react";
import { getStoredUser } from "../api/api";
import "../styles/dashboard.css";

const sidebarItems = [
  { key: "dashboard", label: "Dashboard" },
  // { key: "create", label: "Create Notice" },
  { key: "profile", label: "Profile" },
];

export default function AdminSidebar({ activePage, setActivePage, handleLogout }) {
  const user = getStoredUser();

  return (
    <aside className="admin-sidebar">
      <div>
        <p className="admin-sidebar-eyebrow">Smart Campus</p>
        <h2>Admin Panel</h2>

        <div className="admin-sidebar-user">
          <div className="admin-sidebar-avatar">
            {user?.fullName?.charAt(0)?.toUpperCase() || "A"}
          </div>

          <div>
            <strong>{user?.fullName || "Administrator"}</strong>
            <p>{user?.role || "ADMIN"}</p>
          </div>
        </div>
      </div>

      <nav className="admin-sidebar-nav">
        {sidebarItems.map((item) => (
          <button
            key={item.key}
            type="button"
            className={activePage === item.key ? "active" : ""}
            onClick={() => setActivePage(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
}
