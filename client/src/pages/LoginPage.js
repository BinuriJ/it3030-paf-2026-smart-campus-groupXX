import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  const login = () => {
    localStorage.setItem("userId", userId);
    localStorage.setItem("role", role);
    navigate("/dashboard");
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <input placeholder="User ID" onChange={e => setUserId(e.target.value)} />
      <select onChange={e => setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="lecturer">Lecturer</option>
        <option value="admin">Admin</option>
      </select>
      <button onClick={login}>Login</button>
    </div>
  );
}

export default LoginPage;

