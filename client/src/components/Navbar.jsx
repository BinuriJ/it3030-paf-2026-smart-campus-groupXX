// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { clearAuth, getStoredUser } from "../api/api";
// import "../styles/dashboard.css";

// export default function Navbar() {
//   const [open, setOpen] = useState(false);
//   const navigate = useNavigate();
//   const user = getStoredUser();

//   const handleLogout = () => {
//     clearAuth();
//     navigate("/login", { replace: true });
//   };

//   return (
//     <div className="navbar">
//       <Link to={user?.role === "ADMIN" ? "/admin" : "/dashboard"} className="logo">
//         Smart Campus
//       </Link>

//       <div className="nav-right">
//         <Link to="/dashboard" className="nav-icon">Home</Link>
//         <Link to="/notices" className="nav-icon">Notices</Link>
//         <Link to="/notifications" className="nav-icon">Alerts</Link>
//         <Link to="/profile" className="nav-icon">Profile</Link>

//         <div className="profile" onClick={() => setOpen((value) => !value)}>
//           {user?.fullName?.charAt(0)?.toUpperCase() || "U"}

//           {open ? (
//             <div className="dropdown">
//               <div onClick={() => navigate("/edit-profile")}>Edit Profile</div>
//               <div onClick={handleLogout}>Logout</div>
//             </div>
//           ) : null}
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { clearAuth, getStoredUser } from "../api/api";
import "../styles/dashboard.css";

export default function Navbar({ newCount = 0 }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = getStoredUser();

  const handleLogout = () => {
    clearAuth();
    navigate("/login", { replace: true });
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="navbar">
      <Link
        to={user?.role === "ADMIN" ? "/admin" : "/dashboard"}
        className="logo"
      >
        Smart Campus
      </Link>

      <div className="nav-right">
        <Link
          to="/dashboard"
          className={`nav-icon ${isActive("/dashboard") ? "active" : ""}`}
        >
          Home
        </Link>

        <Link
          to="/notices"
          className={`nav-icon ${isActive("/notices") ? "active" : ""}`}
        >
          Notices
        </Link>

        {/* 🔔 NOTIFICATION BELL */}
        <div
          className={`nav-icon notification ${isActive("/notifications") ? "active" : ""}`}
          onClick={() => navigate("/notifications")}
        >
          🔔
          {newCount > 0 && (
            <span className="badge">{newCount}</span>
          )}
        </div>

        <Link
          to="/profile"
          className={`nav-icon ${isActive("/profile") ? "active" : ""}`}
        >
          Profile
        </Link>

        {/* 👤 PROFILE */}
        <div
          className="profile"
          onClick={() => setOpen((value) => !value)}
        >
          {user?.fullName?.charAt(0)?.toUpperCase() || "U"}

          {open && (
            <div className="dropdown">
              <div onClick={() => navigate("/edit-profile")}>
                Edit Profile
              </div>
              <div onClick={handleLogout}>Logout</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}