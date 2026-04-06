import React from "react";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/dashboard.css";

export default function AdminDashboard() {
  return (
    <div>
      <AdminSidebar />

      <div className="admin-content">
        <h2>Admin Dashboard 🛠️</h2>

        <div className="panel">
          <div className="notice-card">
            System Maintenance

            <div style={{ marginTop: "10px" }}>
              <button>Edit</button>
              <button style={{ marginLeft: "10px", background: "red", color: "white" }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}