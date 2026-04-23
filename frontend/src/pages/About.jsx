import React from "react";
import UserNavbarMenu from "../components/UserNavbarMenu";
import "../styles/notice-dashboard.css";

export default function About() {
  return (
    <div className="about-page">
      <UserNavbarMenu />

      {/* HERO */}
      <div className="about-hero">
        <div className="about-left">
          <h1>About Smart Campus</h1>
          <p>
            Smart Campus is designed to simplify student life by connecting
            services, notices, and facilities into one powerful platform.
          </p>
        </div>
        <div className="about-right">
          <img src="/students.png" alt="students" />
        </div>
      </div>

      {/* FEATURES */}
      <div className="features">
        <div className="feature-card">
          <h3>📢 Notices</h3>
          <p>Stay updated with real-time campus announcements.</p>
        </div>

        <div className="feature-card">
          <h3>📅 Bookings</h3>
          <p>Book facilities anytime, anywhere.</p>
        </div>

        <div className="feature-card">
          <h3>💳 Payments</h3>
          <p>Secure and easy payment management.</p>
        </div>
      </div>

      {/* TEAM */}
      <div className="team">
        <h2>Our Mission</h2>
        <p>
          To create a seamless digital campus experience for students across the world.
        </p>
      </div>
    </div>
  );
}
