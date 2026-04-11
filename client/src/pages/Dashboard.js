import { useNavigate } from "react-router-dom";

function Dashboard() {
  const nav = useNavigate();
  const role = localStorage.getItem("role");

  return (
    <div className="container">
      <h2>Dashboard</h2>

      <button onClick={() => nav("/booking")}>Make Booking</button>
      <button onClick={() => nav("/my-bookings")}>My Bookings</button>

      {role === "admin" && (
        <button onClick={() => nav("/admin")}>Admin Panel</button>
      )}
    </div>
  );
}

export default Dashboard;