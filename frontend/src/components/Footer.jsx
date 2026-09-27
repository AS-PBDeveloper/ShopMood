import React, { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="enhanced-footer">
      <div className="footer-top">
        {/* Brand & Newsletter Column */}
        <div className="footer-col brand-col">
          <div className="footer-logo-wrap">
            <img
              src="/ShopMoodLogo.png"
              alt="ShopMood Logo"
              style={{
                height: "38px",
                width: "38px",
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
            <span className="footer-brand-title">ShopMood</span>
          </div>
          <p className="footer-desc">
            Your destination for elevated lifestyle essentials, high-performance tech, and contemporary fashion designed for modern living.
          </p>

          <form className="footer-newsletter" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="newsletter-btn">
              {subscribed ? "✓ Subscribed" : "Subscribe"}
            </button>
          </form>
          {subscribed && (
            <span className="subscribe-success">
              🎉 Welcome to the Mood Club! Check your inbox for 10% off.
            </span>
          )}
        </div>

        {/* Column 2: Shop */}
        <div className="footer-col">
          <h4 className="footer-col-title">Shop Categories</h4>
          <ul className="footer-links">
            <li>
              <Link to="/shop">All Products</Link>
            </li>
            <li>
              <Link to="/shop?category=Electronics">Electronics &amp; Audio</Link>
            </li>
            <li>
              <Link to="/shop?category=Footwear">Footwear &amp; Sneakers</Link>
            </li>
            <li>
              <Link to="/shop?category=Accessories">Bags &amp; Accessories</Link>
            </li>
            <li>
              <Link to="/shop?category=Furniture">Home &amp; Living</Link>
            </li>
            <li>
              <Link to="/shop?sale=true" style={{ color: "#f97316" }}>
                Seasonal Sale 🔥
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: About & Policies */}
        <div className="footer-col">
          <h4 className="footer-col-title">About &amp; Company</h4>
          <ul className="footer-links">
            <li>
              <Link to="/about">Our Story</Link>
            </li>
            <li>
              <Link to="/return">Return &amp; Refund Policy</Link>
            </li>
            <li>
              <Link to="/disclaimer">Disclaimer &amp; Terms</Link>
            </li>
            <li>
              <Link to="/about">Careers at ShopMood</Link>
            </li>
            <li>
              <Link to="/about">Sustainability</Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Support & Follow */}
        <div className="footer-col">
          <h4 className="footer-col-title">Support &amp; Social</h4>
          <ul className="footer-links">
            <li>
              <span>📧 support@shopmood.com</span>
            </li>
            <li>
              <span>📞 +91 (800) 123-4567</span>
            </li>
            <li>
              <span>⏰ 24/7 Customer Care</span>
            </li>
          </ul>

          <h5 style={{ color: "#fff", marginTop: "20px", marginBottom: "10px", fontSize: "0.95rem" }}>
            Follow Us
          </h5>
          <div className="social-links-row">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon">
              Instagram
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon">
              Facebook
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon">
              Twitter
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="social-icon">
              GitHub
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} <strong>ShopMood</strong>. Built strictly with Node.js, Express, MongoDB &amp; React.
          </p>
          <div className="payment-badges">
            <span className="pay-badge">VISA</span>
            <span className="pay-badge">Mastercard</span>
            <span className="pay-badge">UPI</span>
            <span className="pay-badge">Razorpay</span>
            <span className="pay-badge">Netbanking</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
