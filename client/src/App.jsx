/*import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AdminNotice from "./pages/AdminNotice";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/admin" element={<AdminNotice />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; */

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Notices from "./pages/Notices";
import Notifications from "./pages/Notifications";
import AdminDashboard from "./pages/AdminDashboard";
import AdminNotice from "./pages/AdminNotice";
import Login from "./pages/Login";
import RoleSelect from "./pages/RoleSelect";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔐 FIRST PAGE */}
        <Route path="/" element={<Login />} />

        {/* LOGIN FLOW */}
        <Route path="/login" element={<Login />} />
        <Route path="/role" element={<RoleSelect />} />

        {/* 👨‍🎓 STUDENT */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/notifications" element={<Notifications />} />

        {/* 👨‍💼 ADMIN */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/create" element={<AdminNotice />} />

        {/* 🧾 REGISTER */}
        <Route path="/register" element={<Register />} />

        {/* 👤 PROFILE */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />

        {/* ❌ fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;