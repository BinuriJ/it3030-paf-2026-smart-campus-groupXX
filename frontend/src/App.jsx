import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import StudentNoticeDashboard from "./pages/StudentNoticeDashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Notices from "./pages/Notices";
import Notifications from "./pages/Notifications";
import AdminNoticeDashboard from "./pages/AdminNoticeDashboard";
import AuthLoginPage from "./pages/AuthLoginPage";
import RoleSelect from "./pages/RoleSelect";
import AuthRegisterPage from "./pages/AuthRegisterPage";
import UserProfilePage from "./pages/UserProfilePage";
import StudentProfilePage from "./pages/StudentProfilePage";
import EditProfile from "./pages/EditProfile";
import OAuthSuccess from "./pages/OAuthSuccess";
import ProtectedRoute from "./components/ProtectedRoute";
import { getStoredToken, getStoredUser } from "./api/api";

function HomeRoute() {
  const token = getStoredToken();
  const user = getStoredUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={user.role === "ADMIN" ? "/admin" : "/dashboard"} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/login" element={<AuthLoginPage />} />
        <Route path="/register" element={<AuthRegisterPage />} />
        <Route path="/role" element={<RoleSelect />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <StudentNoticeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notices"
          element={
            <ProtectedRoute>
              <Notices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />


        <Route
  path="/about"
  element={
    <ProtectedRoute>
      <About />
    </ProtectedRoute>
  }
/>

<Route
  path="/contact"
  element={
    <ProtectedRoute>
      <Contact />
    </ProtectedRoute>
  }
/>



        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-profile"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminNoticeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/create"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminNoticeDashboard initialPage="create" />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
