import React from "react";
import { Link } from "react-router-dom";

const Disclaimer = () => {
  return (
    <div className="stitch-page-container" style={{ maxWidth: "900px" }}>
      <div className="stitch-card policy-card">
        <span className="stitch-badge orange" style={{ marginBottom: "14px" }}>
          LEGAL &amp; COMPLIANCE
        </span>
        <h1 className="stitch-title" style={{ fontSize: "2.4rem", marginBottom: "14px" }}>
          Legal &amp; Platform Disclaimer
        </h1>
        <p className="stitch-subtitle" style={{ fontSize: "1rem", lineHeight: "1.7", marginBottom: "32px" }}>
          This document details terms regarding demonstrative functionality, sandbox environments, and educational architectural parameters across the ShopMood platform.
        </p>

        <div className="policy-section-block">
          <div className="policy-icon-row">
            <span className="policy-icon">🎓</span>
            <div>
              <h3>1. Demonstrative &amp; Portfolio Purpose</h3>
              <p>
                The data matrices, visual interfaces, and transactional pipelines represented across the ShopMood domain serve as a high-fidelity demonstration of robust MERN-stack software engineering, REST APIs, and responsive frontends.
              </p>
            </div>
          </div>
        </div>

        <div className="policy-section-block">
          <div className="policy-icon-row">
            <span className="policy-icon">🔒</span>
            <div>
              <h3>2. Sandboxed Payment Integrations</h3>
              <p>
                All financial interfaces and checkout flows connect strictly to test/sandbox environments (such as Razorpay sandbox keys or local test bypasses). No real monetary charges or actual financial debits are executed.
              </p>
            </div>
          </div>
        </div>

        <div className="policy-section-block">
          <div className="policy-icon-row">
            <span className="policy-icon">📸</span>
            <div>
              <h3>3. Creative Assets &amp; Photography</h3>
              <p>
                Product photography and banners utilized throughout this application are generated via advanced AI creative tools or open commercial visual assets for realistic interface representation.
              </p>
            </div>
          </div>
        </div>

        <div className="policy-footer-support">
          <div>
            <h4>Questions or Feedback?</h4>
            <p>Connect with our engineering team for technical inquiries.</p>
          </div>
          <Link to="/about" className="stitch-btn-secondary">
            About the Creator →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
