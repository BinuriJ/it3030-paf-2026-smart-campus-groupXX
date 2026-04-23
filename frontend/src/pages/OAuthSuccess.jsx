import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api, { POST_LOGIN_REDIRECT_KEY, storeAuth } from "../api/api";

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setError("Missing OAuth token.");
      return;
    }

    const completeLogin = async () => {
      try {
        const { data: user } = await api.get("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        storeAuth({ token, user });

        const requestedPath = localStorage.getItem(POST_LOGIN_REDIRECT_KEY);
        localStorage.removeItem(POST_LOGIN_REDIRECT_KEY);

        navigate(
          requestedPath || (user.role === "ADMIN" ? "/admin" : "/dashboard"),
          { replace: true }
        );
      } catch (requestError) {
        setError(
          requestError?.response?.data?.message ||
            requestError?.message ||
            "Google login failed."
        );
      }
    };

    completeLogin();
  }, [navigate, searchParams]);

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-left">
          <h2>{error ? "Authentication Failed" : "Signing you in..."}</h2>
          <p className="error">{error || "Please wait while we finish your Google login."}</p>
        </div>
      </div>
    </div>
  );
}
