import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import BookingPage from "./pages/BookingPage";
import ViewBookings from "./pages/ViewBookings";
import AdminPage from "./pages/AdminPage";

function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Resource Booking System</h1>

      <button onClick={() => window.location.href = "/booking"}>
        Go to Booking Page
      </button>

      <br /><br />

      <button onClick={() => window.location.href = "/view"}>
        View My Bookings
      </button>

      <br /><br />

      <button onClick={() => window.location.href = "/admin"}>
        Admin Panel
      </button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/view" element={<ViewBookings />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
