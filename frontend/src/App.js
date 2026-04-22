import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import BookingPage from "./components/BookingPage";
import MyBookingsPage from "./components/MyBookingsPage";
import AdminPanel from "./components/BookingAdminPanel";
import EditBookingPage from "./components/EditBookingPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="/admin" element={<AdminPanel />} />

        {/* ✅ ADD THIS */}
        <Route path="/edit-booking/:id" element={<EditBookingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;