import React from "react";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <Navbar />

      <h2 className="page-title">Welcome Back 👋</h2>

      <div className="dashboard-content">
        <div className="panel">
          <h3>Recent Notifications</h3>

          <div className="notification-item unread">
            Booking Approved
            <small>2 mins ago</small>
          </div>

          <div className="notification-item">
            Ticket Updated
            <small>10 mins ago</small>
          </div>
        </div>

        <div className="panel">
          <h3>Latest Notices</h3>

          <div className="notice-card">
            System Maintenance Tonight
          </div>

          <div className="notice-card">
            New Lab Available
          </div>
        </div>
      </div>
    </div>
  );
}