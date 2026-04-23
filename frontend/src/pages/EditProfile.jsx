import React from "react";
import UserNavbarMenu from "../components/UserNavbarMenu";
import "../styles/notice-dashboard.css";

export default function EditProfile() {
  return (
    <div className="dashboard">
      <UserNavbarMenu />

      <h2 className="page-title">Edit Profile ✏️</h2>

      <div className="form-container">
        <input placeholder="Full Name" />
        <input placeholder="Email" />

        <select>
          <option>Faculty</option>
          <option>Computing</option>
          <option>Engineering</option>
        </select>

        <button>Save Changes</button>
      </div>
    </div>
  );
}
