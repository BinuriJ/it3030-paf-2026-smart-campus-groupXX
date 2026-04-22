import { useNavigate } from "react-router-dom";

function Dashboard() {
  const nav = useNavigate();
  const role = localStorage.getItem("role");

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Segoe UI, sans-serif",
      background: "linear-gradient(135deg, #F2F0E6, #E8E4D9)"
    },

    card: {
      width: "420px",
      background: "#ffffff",
      padding: "30px",
      borderRadius: "18px",
      boxShadow: "0 15px 35px rgba(47,58,86,0.15)",
      border: "1px solid #E0DCC8",
      textAlign: "center"
    },

    title: {
      fontSize: "24px",
      fontWeight: "800",
      color: "#2F3A56",
      marginBottom: "5px"
    },

    subtitle: {
      fontSize: "13px",
      color: "#6B7280",
      marginBottom: "20px"
    },

    roleBadge: {
      display: "inline-block",
      padding: "4px 10px",
      borderRadius: "999px",
      fontSize: "11px",
      fontWeight: "700",
      background: role === "admin" ? "#2F3A56" : "#C9C2A5",
      color: role === "admin" ? "#fff" : "#2F3A56",
      marginBottom: "20px"
    },

    button: {
      width: "100%",
      padding: "12px",
      marginBottom: "12px",
      borderRadius: "10px",
      border: "none",
      fontWeight: "600",
      cursor: "pointer",
      transition: "0.2s ease-in-out"
    },

    primaryBtn: {
      background: "#2F3A56",
      color: "white"
    },

    secondaryBtn: {
      background: "#4B5A78",
      color: "white"
    },

    adminBtn: {
      background: "#B91C1C",
      color: "white"
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.title}>Dashboard</div>
        <div style={styles.subtitle}>
          Smart Campus Booking System
        </div>

        <div style={styles.roleBadge}>
          {role === "admin" ? "ADMIN" : "USER"}
        </div>

        <button
          style={{ ...styles.button, ...styles.primaryBtn }}
          onClick={() => nav("/booking")}
        >
          📅 Make Booking
        </button>

        <button
          style={{ ...styles.button, ...styles.secondaryBtn }}
          onClick={() => nav("/my-bookings")}
        >
          📋 My Bookings
        </button>

        {role === "admin" && (
          <button
            style={{ ...styles.button, ...styles.adminBtn }}
            onClick={() => nav("/admin")}
          >
            🛠 Admin Panel
          </button>
        )}
      </div>
    </div>
  );
}

export default Dashboard;