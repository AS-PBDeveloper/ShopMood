import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data);
        navigate("/");
      } else {
        setErrorMessage(
          data.errors
            ? data.errors.map((error) => error.message).join("\n")
            : data.message || "Invalid email or password",
        );
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Network error connecting to auth server.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail("admin@shopmood.com");
    setPassword("password123");
  };

  return (
    <div className="auth-container">
      <div className="auth-card-modern">
        {/* Brand Header */}
        <div className="auth-header">
          <Link to="/">
            <img src="/ShopMoodLogo.png" alt="ShopMood Logo" className="auth-brand-logo" />
          </Link>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to manage your bag, orders, and account</p>
        </div>

        {errorMessage && (
          <div className="auth-error-banner">
            <span>⚠️ {errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form-inner">
          <div className="stitch-form-group">
            <label className="stitch-label">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="stitch-input"
            />
          </div>

          <div className="stitch-form-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label className="stitch-label">Password</label>
            </div>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="stitch-input"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="stitch-btn-primary auth-submit-btn"
          >
            {loading ? "Authenticating..." : "Sign In to Account →"}
          </button>
        </form>

        {/* Quick Demo Credentials Helper */}
        <div className="demo-credentials-card">
          <div className="demo-header">
            <span>💡 Quick Test Credentials</span>
            <button type="button" onClick={fillDemoAccount} className="btn-auto-fill">
              Auto-fill Admin
            </button>
          </div>
          <p>
            <strong>Email:</strong> admin@shopmood.com | <strong>Pass:</strong> password123
          </p>
        </div>

        <div className="auth-footer-prompt">
          <p>
            Don't have an account yet? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
