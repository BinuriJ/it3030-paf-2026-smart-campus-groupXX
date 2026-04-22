import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api, { getStoredUser, syncStoredUser } from "../api/api";
import "../styles/profile.css";

export default function StudentProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const role = user?.role || "";
  const roleClassName = role.toLowerCase();

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser?._id || storedUser?.role !== "STUDENT") {
      navigate("/login", { replace: true });
      return;
    }

    const loadProfile = async () => {
      try {
        const { data } = await api.get("/api/auth/me");

        if (data?.role !== "STUDENT") {
          navigate("/login", { replace: true });
          return;
        }

        setUser(data);
        syncStoredUser(data);
      } catch (error) {
        console.error("Failed to load current student profile", error);
        setUser(storedUser);
      }
    };

    loadProfile();
  }, [navigate]);

  if (!user) {
    return <p className="profile-loading">Loading student profile...</p>;
  }

  return (
    <div className="dashboard">
      <Navbar />

      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar">
              {(user?.fullName || "").charAt(0).toUpperCase() || "S"}
            </div>

            <div>
              <h2>{user?.fullName || "-"}</h2>
              <span className={`role-badge ${roleClassName}`}>
                {role || "STUDENT"}
              </span>
            </div>
          </div>

          <div className="section">
            <h3>Basic Information</h3>
            <div className="grid">
              <p><strong>Email:</strong> {user?.email || "-"}</p>
              <p><strong>Role:</strong> {role || "-"}</p>
              <p><strong>Phone:</strong> {user?.phone || "-"}</p>
              <p><strong>Address:</strong> {user?.address || "-"}</p>
            </div>
          </div>

          <div className="section">
            <h3>Student Details</h3>
            <div className="grid">
              <p><strong>Department:</strong> {user?.department || "-"}</p>
              <p><strong>Student ID:</strong> {user?.studentId || "-"}</p>
              <p><strong>Academic Year:</strong> {user?.academicYear || "-"}</p>
              <p><strong>Age:</strong> {user?.age ?? "-"}</p>
            </div>
          </div>

          <button
            className="edit-btn"
            onClick={() => navigate("/edit-profile")}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
