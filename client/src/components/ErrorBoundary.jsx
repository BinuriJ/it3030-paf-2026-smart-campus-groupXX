import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Frontend render error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="dashboard">
          <h2 className="page-title">Something went wrong while rendering this page.</h2>
        </div>
      );
    }

    return this.props.children;
  }
}
