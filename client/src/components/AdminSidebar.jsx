import React from "react";
import { Link } from "react-router-dom";
import "../styles/dashboard.css";

export default function AdminSidebar() {
  return (
    <div className="sidebar">
      <h2>Admin</h2>

      <Link to="/admin">Dashboard</Link>
      <Link to="/admin/create">Create Notice</Link>
    </div>
  );
}