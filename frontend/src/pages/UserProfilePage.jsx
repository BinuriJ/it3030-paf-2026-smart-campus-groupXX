import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbarMenu from "../components/UserNavbarMenu";
import api, { getStoredUser, syncStoredUser } from "../api/api";
import "../styles/user-profile.css";

export default function UserProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const role = user?.role || "";
  const roleClassName = role.toLowerCase();

  useEffect(() => {
    const storedUser = getStoredUser();
    if (!storedUser?._id) {
      navigate("/login", { replace: true });
      return;
    }

    const loadProfile = async () => {
      try {
        const { data } = await api.get(`/api/users/${storedUser._id}`);
        setUser(data);
        syncStoredUser(data);
      } catch (requestError) {
        setUser(storedUser);
      }
    };

    loadProfile();
  }, [navigate]);

  if (!user) {
    return <p className="profile-loading">Loading...</p>;
  }

  return (
    <div className="dashboard">
      <UserNavbarMenu />

      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar">{(user?.fullName || "").charAt(0).toUpperCase() || "U"}</div>

            <div>
              <h2>{user?.fullName || "-"}</h2>
              <span className={`role-badge ${roleClassName}`}>{role || "-"}</span>
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

          {role === "STUDENT" ? (
            <div className="section">
              <h3>Student Details</h3>
              <div className="grid">
                <p><strong>Department:</strong> {user?.department || "-"}</p>
                <p><strong>Student ID:</strong> {user?.studentId || "-"}</p>
                <p><strong>Academic Year:</strong> {user?.academicYear || "-"}</p>
                <p><strong>Age:</strong> {user?.age ?? "-"}</p>
              </div>
            </div>
          ) : null}

          {role === "ADMIN" ? (
            <div className="section">
              <h3>Admin Details</h3>
              <div className="grid">
                <p><strong>Organization:</strong> {user?.orgName || "-"}</p>
                <p><strong>Admin Type:</strong> {user?.adminType || "-"}</p>
              </div>
            </div>
          ) : null}

          {role === "LECTURER" ? (
            <div className="section">
              <h3>Lecturer Details</h3>
              <div className="grid">
                <p><strong>Staff ID:</strong> {user?.staffId || "-"}</p>
                <p><strong>Specialization:</strong> {user?.specialization || "-"}</p>
              </div>
            </div>
          ) : null}

          <button className="edit-btn" onClick={() => navigate("/edit-profile")}>
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
