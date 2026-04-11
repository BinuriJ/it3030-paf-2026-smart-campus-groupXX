// // import React, { useEffect, useState } from "react";
// // import { Link, useLocation, useNavigate } from "react-router-dom";
// // import { clearAuth, getStoredUser } from "../api/api";
// // import { fetchUnreadNoticeCount } from "../api/studentNotices";
// // import "../styles/dashboard.css";

// // export default function Navbar({ newCount }) {
// //   const [open, setOpen] = useState(false);
// //   const [fallbackCount, setFallbackCount] = useState(0);
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const user = getStoredUser();
// //   const resolvedCount = typeof newCount === "number" ? newCount : fallbackCount;

// //   const handleLogout = () => {
// //     clearAuth();
// //     navigate("/login", { replace: true });
// //   };

// //   const isActive = (path) => location.pathname === path;

// //   useEffect(() => {
// //     if (typeof newCount === "number" || !user?._id || user.role === "ADMIN") {
// //       return;
// //     }

// //     const loadUnreadCount = async () => {
// //       try {
// //         const count = await fetchUnreadNoticeCount(user._id);
// //         setFallbackCount(count);
// //       } catch {
// //         setFallbackCount(0);
// //       }
// //     };

// //     loadUnreadCount();
// //   }, [newCount, user?._id, user?.role]);

// //   return (
// //     <div className="navbar">
// //       <Link
// //         to={user?.role === "ADMIN" ? "/admin" : "/dashboard"}
// //         className="logo"
// //       >
// //         Smart Campus
// //       </Link>

// //       <div className="nav-right">
// //         <Link
// //           to="/dashboard"
// //           className={`nav-icon ${isActive("/dashboard") ? "active" : ""}`}
// //         >
// //           Home
// //         </Link>

// //         <Link
// //           to="/notices"
// //           className={`nav-icon ${isActive("/notices") ? "active" : ""}`}
// //         >
// //           Notices
// //         </Link>

// //         <div
// //           className={`nav-icon notification ${isActive("/notifications") ? "active" : ""}`}
// //           onClick={() => navigate("/notifications")}
// //           onKeyDown={(event) => {
// //             if (event.key === "Enter" || event.key === " ") {
// //               navigate("/notifications");
// //             }
// //           }}
// //           role="button"
// //           tabIndex={0}
// //         >
// //           <span>Notifications</span>
// //           {resolvedCount > 0 ? <span className="badge">{resolvedCount}</span> : null}
// //         </div>

// //         <Link
// //           to="/profile"
// //           className={`nav-icon ${isActive("/profile") ? "active" : ""}`}
// //         >
// //           Profile
// //         </Link>

// //         <div
// //           className="profile"
// //           onClick={() => setOpen((value) => !value)}
// //         >
// //           {user?.fullName?.charAt(0)?.toUpperCase() || "U"}

// //           {open ? (
// //             <div className="dropdown">
// //               <div onClick={() => navigate("/edit-profile")}>
// //                 Edit Profile
// //               </div>
// //               <div onClick={handleLogout}>Logout</div>
// //             </div>
// //           ) : null}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


// import React, { useEffect, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { clearAuth, getStoredUser } from "../api/api";
// import { fetchUnreadNoticeCount } from "../api/studentNotices";
// import "../styles/dashboard.css";

// export default function Navbar({ newCount }) {
//   const [open, setOpen] = useState(false);
//   const [fallbackCount, setFallbackCount] = useState(0);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const user = getStoredUser();

//   const resolvedCount =
//     typeof newCount === "number" ? newCount : fallbackCount;

//   const handleLogout = () => {
//     clearAuth();
//     navigate("/login", { replace: true });
//   };

//   const isActive = (path) => location.pathname === path;

//   useEffect(() => {
//     if (
//       typeof newCount === "number" ||
//       !user?._id ||
//       user?.role === "ADMIN"
//     ) {
//       return;
//     }

//     const loadUnreadCount = async () => {
//       try {
//         const count = await fetchUnreadNoticeCount(user._id);
//         setFallbackCount(count);
//       } catch {
//         setFallbackCount(0);
//       }
//     };

//     loadUnreadCount();
//   }, [newCount, user?._id, user?.role]);

//   if (!user) {
//     return (
//       <div className="navbar">
//         <Link to="/dashboard" className="logo">
//           Smart Campus
//         </Link>
//         <div className="nav-right">
//           <span className="nav-icon">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="navbar">
//       <Link
//         to={user?.role === "ADMIN" ? "/admin" : "/dashboard"}
//         className="logo"
//       >
//         Smart Campus
//       </Link>

//       <div className="nav-right">
//         {/* Home */}
//         <Link
//           to="/dashboard"
//           className={`nav-icon ${
//             isActive("/dashboard") ? "active" : ""
//           }`}
//         >
//           Home
//         </Link>

//         {/* Notices with unread count ✅ */}
//         <Link
//           to="/notices"
//           className={`nav-icon ${
//             isActive("/notices") ? "active" : ""
//           }`}
//         >
//           Notices
//           {resolvedCount > 0 ? (
//             <span className="badge">{resolvedCount}</span>
//           ) : null}
//         </Link>

//         {/* Notifications (no badge ❌) */}
//         <div
//           className={`nav-icon notification ${
//             isActive("/notifications") ? "active" : ""
//           }`}
//           onClick={() => navigate("/notifications")}
//           onKeyDown={(event) => {
//             if (event.key === "Enter" || event.key === " ") {
//               navigate("/notifications");
//             }
//           }}
//           role="button"
//           tabIndex={0}
//         >
//           <span>Notifications</span>
//         </div>

//         {/* Profile */}
//         <Link
//           to="/profile"
//           className={`nav-icon ${
//             isActive("/profile") ? "active" : ""
//           }`}
//         >
//           Profile
//         </Link>

//         {/* User dropdown */}
//         <div
//           className="profile"
//           onClick={() => setOpen((value) => !value)}
//         >
//           {user?.fullName?.charAt(0)?.toUpperCase() || "U"}

//           {open ? (
//             <div className="dropdown">
//               <div onClick={() => navigate("/edit-profile")}>
//                 Edit Profile
//               </div>
//               <div onClick={handleLogout}>Logout</div>
//             </div>
//           ) : null}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearAuth, getStoredUser } from "../api/api";
import { fetchUnreadNoticeCount } from "../api/studentNotices";
import "../styles/dashboard.css";

export default function Navbar({ newCount }) {
  const [open, setOpen] = useState(false);
  const [fallbackCount, setFallbackCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const user = getStoredUser();

  const resolvedCount =
    typeof newCount === "number" ? newCount : fallbackCount;

  const handleLogout = () => {
    clearAuth();
    navigate("/login", { replace: true });
  };

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    if (
      typeof newCount === "number" ||
      !user?._id ||
      user?.role === "ADMIN"
    ) {
      return;
    }

    const loadUnreadCount = async () => {
      try {
        const count = await fetchUnreadNoticeCount(user._id);
        setFallbackCount(count);
      } catch {
        setFallbackCount(0);
      }
    };

    loadUnreadCount();
  }, [newCount, user?._id, user?.role]);

  if (!user) {
    return (
      <div className="navbar">
        <Link to="/dashboard" className="logo">
          Smart Campus
        </Link>
        <div className="nav-right">
          <span className="nav-icon">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="navbar">
      {/* Logo */}
      <Link
        to={user?.role === "ADMIN" ? "/admin" : "/dashboard"}
        className="logo"
      >
        Smart Campus
      </Link>

      <div className="nav-right">
        {/* Home */}
        <Link
          to="/dashboard"
          className={`nav-icon ${
            isActive("/dashboard") ? "active" : ""
          }`}
        >
          Home
        </Link>

        {/* Notices with unread count */}
        <Link
          to="/notices"
          className={`nav-icon ${
            isActive("/notices") ? "active" : ""
          }`}
        >
          Notices
          {resolvedCount > 0 ? (
            <span className="badge">{resolvedCount}</span>
          ) : null}
        </Link>

        {/* Notifications */}
        <div
          className={`nav-icon notification ${
            isActive("/notifications") ? "active" : ""
          }`}
          onClick={() => navigate("/notifications")}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              navigate("/notifications");
            }
          }}
          role="button"
          tabIndex={0}
        >
          <span>Notifications</span>
        </div>

        {/* Profile (ROLE BASED NAVIGATION ✅) */}
        <Link
          to={user?.role === "STUDENT" ? "/student-profile" : "/profile"}
          className={`nav-icon ${
            isActive("/profile") || isActive("/student-profile")
              ? "active"
              : ""
          }`}
        >
          Profile
        </Link>

        {/* User dropdown */}
        <div
          className="profile"
          onClick={() => setOpen((value) => !value)}
        >
          {user?.fullName?.charAt(0)?.toUpperCase() || "U"}

          {open ? (
            <div className="dropdown">
              <div onClick={() => navigate("/edit-profile")}>
                Edit Profile
              </div>
              <div onClick={handleLogout}>Logout</div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}