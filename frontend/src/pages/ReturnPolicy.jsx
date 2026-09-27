import React from "react";
import { Link } from "react-router-dom";

const ReturnPolicy = () => {
  return (
    <div className="stitch-page-container" style={{ maxWidth: "900px" }}>
      <div className="stitch-card policy-card">
        <span className="stitch-badge orange" style={{ marginBottom: "14px" }}>
          CUSTOMER PROTECTION
        </span>
        <h1 className="stitch-title" style={{ fontSize: "2.4rem", marginBottom: "14px" }}>
          Return &amp; Refund Policy
        </h1>
        <p className="stitch-subtitle" style={{ fontSize: "1rem", lineHeight: "1.7", marginBottom: "32px" }}>
          Last updated: 2026. At ShopMood, we stand firmly behind the craftsmanship and quality of our products. If you are not completely satisfied, we make returns straightforward.
        </p>

        <div className="policy-section-block">
          <div className="policy-icon-row">
            <span className="policy-icon">⏱️</span>
            <div>
              <h3>1. 30-Day Hassle-Free Window</h3>
              <p>
                You may initiate an exchange or return for any eligible item within <strong>30 days of confirmed delivery</strong>. The process is handled smoothly via your account dashboard or through our customer support desk.
              </p>
            </div>
          </div>
        </div>

        <div className="policy-section-block">
          <div className="policy-icon-row">
            <span className="policy-icon">📦</span>
            <div>
              <h3>2. Condition Requirements</h3>
              <p>
                To qualify for a full refund, returned items must be in their original, unworn condition with factory tags and standard packaging intact. All original accessories and power cables must be included.
              </p>
            </div>
          </div>
        </div>

        <div className="policy-section-block">
          <div className="policy-icon-row">
            <span className="policy-icon">💳</span>
            <div>
              <h3>3. Fast Refund Processing</h3>
              <p>
                Once your return package arrives at our fulfillment facility and passes physical inspection, your refund will be triggered immediately to your original payment method within <strong>5–7 business days</strong>.
              </p>
            </div>
          </div>
        </div>

        <div className="policy-section-block">
          <div className="policy-icon-row">
            <span className="policy-icon">🚚</span>
            <div>
              <h3>4. Free Return Pickups</h3>
              <p>
                We arrange scheduled doorstep pickups across eligible domestic postal zones. For remote locations, prepaid courier labels are issued directly to your email address.
              </p>
            </div>
          </div>
        </div>

        <div className="policy-footer-support">
          <div>
            <h4>Need to start a return?</h4>
            <p>Our dedicated care team is available 24/7 to assist you.</p>
          </div>
          <Link to="/profile" className="stitch-btn-primary">
            View My Orders →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
