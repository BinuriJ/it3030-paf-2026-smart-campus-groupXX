import React from "react";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";

export default function Profile() {
  return (
    <div className="dashboard">
      <Navbar />

      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar">👤</div>
          <div>
            <h2>John Doe</h2>
            <p>Welcome to your profile</p>
          </div>
        </div>

        <button className="edit-btn">
          Edit Profile
        </button>

        <div className="profile-info">
          <p><strong>Email:</strong> john@gmail.com</p>
          <p><strong>Role:</strong> Student</p>
        </div>
      </div>
    </div>
  );
}