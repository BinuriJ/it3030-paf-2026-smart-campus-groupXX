import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import BookingPage from "./pages/BookingPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import AdminPanel from "./pages/AdminPanel";
import EditBookingPage from "./pages/EditBookingPage";
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