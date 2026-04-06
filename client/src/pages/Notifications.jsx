import React from "react";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";

export default function Notifications() {
  return (
    <div className="dashboard">
      <Navbar />

      <h2 className="page-title">Notifications 🔔</h2>

      <div className="panel">
        <div className="notification-item unread">
          Booking Approved
          <small>2 mins ago</small>
        </div>

        <div className="notification-item">
          New Comment Added
          <small>15 mins ago</small>
        </div>
      </div>
    </div>
  );
}