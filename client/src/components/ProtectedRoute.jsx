import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getStoredToken, getStoredUser } from "../api/api";

export default function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const token = getStoredToken();
  const user = getStoredUser();

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === "ADMIN" ? "/admin" : "/dashboard"} replace />;
  }

  return children;
}
