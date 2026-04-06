import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <h2 className="page-title">Student Registration 🎓</h2>

      <div className="form-container">
        <input placeholder="Full Name" />
        <input placeholder="Email" />
        <input type="password" placeholder="Password" />
        <input type="password" placeholder="Confirm Password" />

        <select>
          <option>Faculty</option>
          <option>Computing</option>
          <option>Engineering</option>
        </select>

        <input placeholder="Student ID" />

        <button onClick={() => navigate("/login")}>
          Register
        </button>

        <hr />

        <button onClick={() => navigate("/login")}>
          Register with Google
        </button>
      </div>
    </div>
  );
}