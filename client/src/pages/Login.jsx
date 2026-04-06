import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="login-container">

      <div className="login-box">
        
        {/* LEFT SIDE */}
        <div className="login-left">
          <h2>Log in</h2>

          <input placeholder="Email" />
          <input type="password" placeholder="Password" />

          <button onClick={() => navigate("/dashboard")}>
            Login
          </button>

          <label className="remember">
            <input type="checkbox" /> Remember me
          </label>
        </div>

        {/* DIVIDER */}
        <div className="divider">OR</div>

        {/* RIGHT SIDE */}
        <div className="login-right">
          <button className="google-btn" onClick={() => navigate("/register")}>
            Continue with Google
          </button>
        </div>
      </div>

      {/* 🔻 ORGANIZATION LOGIN */}
      <div className="org-login">
        <p>Organization Login (Admin)</p>

        <button onClick={() => navigate("/role")}>
          Login as Admin
        </button>
      </div>

    </div>
  );
}