import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  // Password strength check
  const hasMinLength = password.length >= 6;
  const hasNumber = /\d/.test(password);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!hasMinLength || !hasNumber) {
      setErrorMessage("Password must be at least 6 characters and contain at least one number.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("🎉 Registration Successful! Please sign in with your credentials.");
        navigate("/login");
      } else {
        setErrorMessage(
          data.errors
            ? data.errors.map((error) => error.message).join("\n")
            : data.message || "Registration failed",
        );
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Network error connecting to registration server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card-modern">
        <div className="auth-header">
          <Link to="/">
            <img src="/ShopMoodLogo.png" alt="ShopMood Logo" className="auth-brand-logo" />
          </Link>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join ShopMood for exclusive seasonal drops &amp; offers</p>
        </div>

        {errorMessage && (
          <div className="auth-error-banner">
            <span>⚠️ {errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form-inner">
          <div className="stitch-form-group">
            <label className="stitch-label">Full Name</label>
            <input
              type="text"
              placeholder="e.g. Alex Morgan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="stitch-input"
            />
          </div>

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
            <label className="stitch-label">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters + 1 number"
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

            {/* Password Validation Checklist */}
            <div className="password-rules-list">
              <span className={`rule-item ${hasMinLength ? "valid" : ""}`}>
                {hasMinLength ? "✓" : "○"} Min 6 characters
              </span>
              <span className={`rule-item ${hasNumber ? "valid" : ""}`}>
                {hasNumber ? "✓" : "○"} At least one number
              </span>
            </div>
          </div>

          <div className="stitch-form-group">
            <label className="stitch-label">Confirm Password</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-type password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="stitch-input"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {confirmPassword && (
              <span className={`match-feedback ${passwordsMatch ? "valid" : "invalid"}`}>
                {passwordsMatch ? "✓ Passwords match" : "✕ Passwords do not match"}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="stitch-btn-primary auth-submit-btn"
          >
            {loading ? "Creating Account..." : "Create Account →"}
          </button>
        </form>

        <div className="auth-footer-prompt">
          <p>
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
