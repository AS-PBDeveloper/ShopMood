import React from "react";
import { Link } from "react-router-dom";

const OrderSuccess = () => {
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + 3);

  return (
    <div className="stitch-page-container" style={{ maxWidth: "680px", textAlign: "center" }}>
      <div className="stitch-card order-success-card">
        {/* Animated Checkmark Bubble */}
        <div className="success-icon-bubble">
          <span className="success-checkmark">✓</span>
        </div>

        <span className="stitch-badge green" style={{ marginBottom: "16px" }}>
          PAYMENT CONFIRMED
        </span>

        <h1 className="stitch-title" style={{ fontSize: "2.4rem", marginBottom: "12px" }}>
          Order Successfully Placed!
        </h1>

        <p className="stitch-subtitle" style={{ fontSize: "1.05rem", lineHeight: "1.6", marginBottom: "28px" }}>
          Thank you for choosing ShopMood. Your transaction has been securely processed and our fulfillment team is preparing your items.
        </p>

        {/* Order Details Receipt Box */}
        <div className="success-details-box">
          <div className="success-meta-row">
            <span className="meta-label">Estimated Delivery:</span>
            <span className="meta-value">
              {estimatedDate.toLocaleDateString("en-IN", {
                weekday: "long",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="success-meta-row">
            <span className="meta-label">Shipping Method:</span>
            <span className="meta-value">ShopMood Express Logistics</span>
          </div>

          <div className="success-meta-row">
            <span className="meta-label">Order Confirmation:</span>
            <span className="meta-value">Sent via Email / Profile</span>
          </div>
        </div>

        <div className="success-actions-row">
          <Link to="/profile" className="stitch-btn-primary">
            View in My Orders →
          </Link>
          <Link to="/shop" className="stitch-btn-secondary">
            Continue Shopping
          </Link>
        </div>

        <div className="order-support-footer">
          <p>
            Need help with your order? Our team is available 24/7 at{" "}
            <a href="mailto:support@shopmood.com" style={{ color: "#f97316" }}>
              support@shopmood.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
