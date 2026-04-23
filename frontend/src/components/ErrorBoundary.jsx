import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Frontend render error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
          fontFamily: "'Inter', sans-serif",
          padding: "24px"
        }}>
          <div style={{
            background: "white",
            borderRadius: "24px",
            padding: "48px",
            maxWidth: "480px",
            width: "100%",
            boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
            border: "1px solid #f1f5f9",
            textAlign: "center"
          }}>
            <div style={{
              width: "64px",
              height: "64px",
              background: "#fef2f2",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              fontSize: "28px"
            }}>⚠️</div>
            <h2 style={{
              fontSize: "22px",
              fontWeight: "800",
              color: "#0f172a",
              marginBottom: "8px"
            }}>Something went wrong</h2>
            <p style={{
              fontSize: "14px",
              color: "#64748b",
              marginBottom: "32px",
              lineHeight: "1.6"
            }}>
              A rendering error occurred on this page. This is usually caused by missing data or a temporary issue.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: "12px 24px",
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: "700",
                  fontSize: "14px",
                  cursor: "pointer"
                }}
              >
                Reload Page
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                style={{
                  padding: "12px 24px",
                  background: "#f1f5f9",
                  color: "#334155",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: "700",
                  fontSize: "14px",
                  cursor: "pointer"
                }}
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
