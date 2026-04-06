import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="navbar">
      {/* LOGO → DASHBOARD */}
      <Link to="/dashboard" className="logo">
        Smart Campus
      </Link>

      <div className="nav-right">
        {/* HOME = DASHBOARD */}
        <Link to="/dashboard" className="nav-icon">🏠</Link>

        {/* NOTICES */}
        <Link to="/notices" className="nav-icon">📢</Link>

        {/* NOTIFICATIONS */}
        <Link to="/notifications" className="nav-icon">
          🔔 <span className="badge">2</span>
        </Link>

        {/* SETTINGS = PROFILE */}
        <Link to="/profile" className="nav-icon">⚙️</Link>

        {/* PROFILE DROPDOWN */}
        <div className="profile" onClick={() => setOpen(!open)}>
          👤

          {open && (
            <div className="dropdown">
              <div onClick={() => navigate("/edit-profile")}>
                ✏️ Edit Profile
              </div>

              <div onClick={() => navigate("/login")}>
                🚪 Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}