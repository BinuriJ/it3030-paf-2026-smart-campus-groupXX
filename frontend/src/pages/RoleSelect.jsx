import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/notice-dashboard.css";

export default function RoleSelect() {
  const navigate = useNavigate();

  return (
    <div className="role-page">
      <div className="role-box">
        <h2 className="role-title">Select Your Role 👤</h2>

        <div className="role-container">
          
          {/* 🎓 STUDENT */}
          <div
            className="role-card"
            onClick={() => navigate("/register")}
          >
            <div className="role-icon">👨‍🎓</div>
            <p>Other Staff</p>
            <small>Register & access dashboard</small>
          </div>

          {/* 👨‍💼 ADMIN */}
          <div
            className="role-card"
            onClick={() => navigate("/admin")}
          >
            <div className="role-icon">👨‍💼</div>
            <p>Admin</p>
            <small>Login to manage system</small>
          </div>

        </div>
      </div>
    </div>
  );
}
