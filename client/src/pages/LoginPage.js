import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  const login = () => {
    if (!userName) {
      alert("Please enter username");
      return;
    }

    localStorage.setItem("userName", userName);
    localStorage.setItem("role", role);

    navigate("/dashboard");
  };

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
      width: "380px",
      background: "#ffffff",
      padding: "35px",
      borderRadius: "18px",
      boxShadow: "0 15px 35px rgba(47,58,86,0.15)",
      border: "1px solid #E0DCC8",
      textAlign: "center"
    },

    title: {
      fontSize: "26px",
      fontWeight: "800",
      color: "#2F3A56",
      marginBottom: "8px"
    },

    subtitle: {
      fontSize: "13px",
      color: "#6B7280",
      marginBottom: "25px"
    },

    input: {
      width: "100%",
      padding: "12px",
      marginBottom: "12px",
      borderRadius: "10px",
      border: "1px solid #D6D3C4",
      outline: "none",
      fontSize: "14px"
    },

    select: {
      width: "100%",
      padding: "12px",
      marginBottom: "20px",
      borderRadius: "10px",
      border: "1px solid #D6D3C4",
      fontSize: "14px",
      background: "white"
    },

    button: {
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: "none",
      background: "#2F3A56",
      color: "white",
      fontWeight: "700",
      cursor: "pointer",
      fontSize: "15px",
      transition: "0.2s ease"
    },

    hint: {
      fontSize: "12px",
      marginTop: "15px",
      color: "#6B7280"
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <div style={styles.title}>Welcome Back</div>
        <div style={styles.subtitle}>
          Smart Campus Booking System Login
        </div>

        <input
          style={styles.input}
          placeholder="Enter Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />

        <select
          style={styles.select}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">🎓 Student</option>
          <option value="lecturer">👨‍🏫 Lecturer</option>
          <option value="admin">🛠 Admin</option>
        </select>

        <button style={styles.button} onClick={login}>
          Login
        </button>

        <div style={styles.hint}>
          Please enter your credentials to continue
        </div>
      </div>
    </div>
  );
}

export default LoginPage;