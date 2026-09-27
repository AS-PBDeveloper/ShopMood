import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="stitch-page-container">
      {/* Hero Header */}
      <div className="stitch-card about-hero-card">
        <div className="about-hero-content">
          <span className="stitch-badge orange">OUR STORY &amp; VISION</span>
          <h1 className="stitch-title" style={{ fontSize: "2.6rem", margin: "14px 0" }}>
            Engineered for Modern Living.
          </h1>
          <p className="stitch-subtitle" style={{ fontSize: "1.1rem", lineHeight: "1.7", maxWidth: "650px" }}>
            ShopMood was born out of a simple passion: to build high-performance e-commerce experiences with uncompromising visual craftsmanship, robust architectures, and customer-first values.
          </p>
        </div>

        <div className="about-stats-grid">
          <div className="about-stat-item">
            <span className="stat-number">10K+</span>
            <span className="stat-desc">Curated Orders Delivered</span>
          </div>
          <div className="about-stat-item">
            <span className="stat-number">99.8%</span>
            <span className="stat-desc">Customer Satisfaction</span>
          </div>
          <div className="about-stat-item">
            <span className="stat-number">24/7</span>
            <span className="stat-desc">Fulfillment &amp; Support</span>
          </div>
        </div>
      </div>

      {/* Brand Values Grid */}
      <div className="about-values-grid">
        <div className="stitch-card value-card">
          <span className="value-icon">💎</span>
          <h3>Uncompromising Quality</h3>
          <p>Every product in our catalog undergoes rigorous quality evaluation, from materials to real-world durability.</p>
        </div>
        <div className="stitch-card value-card">
          <span className="value-icon">⚡</span>
          <h3>Speed &amp; Performance</h3>
          <p>Powered by modern full-stack web technologies ensuring sub-second response times and immediate checkout.</p>
        </div>
        <div className="stitch-card value-card">
          <span className="value-icon">🛡️</span>
          <h3>100% Buyer Protection</h3>
          <p>30-day hassle-free returns, genuine manufacturer warranties, and end-to-end encrypted transactions.</p>
        </div>
      </div>

      {/* Creator Showcase Card */}
      <div className="stitch-card creator-card">
        <div className="creator-profile">
          <img src="/dp.jpg" alt="Shivansh Vasu" className="creator-avatar" />
          <div className="creator-info">
            <span className="stitch-badge orange">FOUNDER &amp; LEAD ENGINEER</span>
            <h2 className="creator-name">Shivansh Vasu</h2>
            <p className="creator-handle">@theshivanshvasu</p>
            <p className="creator-bio">
              Full-Stack Software Engineer &amp; Tech Educator passionate about building scalable web applications, beautiful UI design systems, and developer communities.
            </p>

            <div className="creator-socials-row">
              <a href="https://theshivanshvasu.com" target="_blank" rel="noreferrer" className="creator-social-btn">
                🌐 Portfolio
              </a>
              <a href="https://youtube.com/@shivanshvasu" target="_blank" rel="noreferrer" className="creator-social-btn youtube">
                📺 YouTube
              </a>
              <a href="https://instagram.com/theshivanshvasuofficial" target="_blank" rel="noreferrer" className="creator-social-btn instagram">
                📸 Instagram
              </a>
              <a href="https://www.linkedin.com/in/theshivanshvasu" target="_blank" rel="noreferrer" className="creator-social-btn linkedin">
                💼 LinkedIn
              </a>
              <a href="https://x.com/theshivanshvasu" target="_blank" rel="noreferrer" className="creator-social-btn twitter">
                ✖️ Twitter
              </a>
            </div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <Link to="/shop" className="stitch-btn-primary">
          Explore the Collection →
        </Link>
      </div>
    </div>
  );
};

export default About;
