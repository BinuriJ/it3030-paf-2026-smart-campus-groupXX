import React, { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/dashboard.css";

export default function AdminNotice() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div>
      <AdminSidebar />

      <div className="admin-content">
        <h2>Create Notice ➕</h2>

        <div className="form-container">
          <input
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Message"
            onChange={(e) => setMessage(e.target.value)}
          />

          <button>Create Notice</button>
        </div>
      </div>
    </div>
  );
}