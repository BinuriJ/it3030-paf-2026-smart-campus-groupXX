import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api, { API_BASE_URL, POST_LOGIN_REDIRECT_KEY, storeAuth } from "../api/api";
import "../styles/notice-dashboard.css";

function getErrorMessage(error) {
  return error?.response?.data?.message || error?.message || "Login failed. Please try again.";
}

export default function AuthLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isFormValid = useMemo(
    () => email.trim() !== "" && password.trim() !== "",
    [email, password]
  );

  const redirectAfterLogin = (role) => {
    const requestedPath =
      location.state?.from?.pathname || localStorage.getItem(POST_LOGIN_REDIRECT_KEY);

    localStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
    navigate(requestedPath || (role === "ADMIN" ? "/admin" : "/dashboard"), {
      replace: true,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid || loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/api/auth/login", {
        email: email.trim(),
        password,
      });

      storeAuth(data);
      redirectAfterLogin(data.user.role);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const requestedPath = location.state?.from?.pathname;
    if (requestedPath) {
      localStorage.setItem(POST_LOGIN_REDIRECT_KEY, requestedPath);
    }

    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-left">
          <h2>Log in</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />

            {error ? <p className="error">{error}</p> : null}

            <button type="submit" disabled={!isFormValid || loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        <div className="divider">OR</div>

        <div className="login-right">
          <button className="google-btn" onClick={handleGoogleLogin}>
            Continue with Google
          </button>
        </div>
      </div>

      <div className="org-login">
        <p>Need an account?</p>
        <button onClick={() => navigate("/register")}>Create Account</button>
      </div>
    </div>
  );
}
