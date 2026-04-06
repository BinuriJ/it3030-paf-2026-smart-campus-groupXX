import React from "react";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";

export default function Notices() {
  return (
    <div className="dashboard">
      <Navbar />

      <h2 className="page-title">All Notices 📢</h2>

      <div className="panel">
        <div className="notice-card">System Maintenance Tonight</div>
        <div className="notice-card">New Lab Available</div>
        <div className="notice-card">Exam Schedule Released</div>
      </div>
    </div>
  );
}