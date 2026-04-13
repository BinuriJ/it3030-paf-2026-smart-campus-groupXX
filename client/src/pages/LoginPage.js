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

  return (
    <div className="container" style={{ padding: "20px" }}>
      <h2>Login</h2>

      <input
        placeholder="User Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />

      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="lecturer">Lecturer</option>
        <option value="admin">Admin</option>
      </select>

      <button onClick={login}>Login</button>
    </div>
  );
}

export default LoginPage;