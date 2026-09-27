import React, { useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { removeFromCart, addToCart, clearCart } from "../redux/cartSlice";
import "../styles/cart.css";

const Cart = () => {
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMessage, setCouponMessage] = useState(null);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQty = (item, qty) => {
    if (qty > 0) {
      dispatch(addToCart({ ...item, qty }));
    } else {
      dispatch(removeFromCart(item.productId));
    }
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === "MOOD20") {
      setDiscountPercent(0.2);
      setCouponMessage({ type: "success", text: "✓ 20% discount applied successfully!" });
    } else {
      setDiscountPercent(0);
      setCouponMessage({ type: "error", text: "Invalid promo code. Try MOOD20" });
    }
  };

  const rawTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );
  const discountAmount = rawTotal * discountPercent;
  const finalTotal = Math.max(0, rawTotal - discountAmount);
  const freeShippingThreshold = 999;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - rawTotal);
  const shippingProgress = Math.min(100, (rawTotal / freeShippingThreshold) * 100);

  if (!user) {
    return (
      <div className="stitch-page-container">
        <div className="stitch-empty-state">
          <span className="stitch-empty-icon">🔒</span>
          <h2 className="stitch-empty-title">Sign in to View Your Cart</h2>
          <p className="stitch-empty-text">
            Your items are waiting for you. Log in to your ShopMood account to access your saved bag and checkout seamlessly.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <Link to="/login" className="stitch-btn-primary">
              Sign In to Account
            </Link>
            <Link to="/shop" className="stitch-btn-secondary">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="stitch-page-container">
        <div className="stitch-empty-state">
          <span className="stitch-empty-icon">🛍️</span>
          <h2 className="stitch-empty-title">Your Shopping Cart is Empty</h2>
          <p className="stitch-empty-text">
            Looks like you haven't added any products to your bag yet. Discover our latest seasonal drops and tech essentials.
          </p>
          <Link to="/shop" className="stitch-btn-primary">
            Start Exploring Products →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="stitch-page-container">
      {/* Checkout Steps Indicator */}
      <div className="checkout-step-bar">
        <div className="step-item active">
          <span className="step-num">1</span>
          <span className="step-label">Shopping Bag</span>
        </div>
        <div className="step-divider" />
        <div className="step-item">
          <span className="step-num">2</span>
          <span className="step-label">Delivery Address</span>
        </div>
        <div className="step-divider" />
        <div className="step-item">
          <span className="step-num">3</span>
          <span className="step-label">Payment &amp; Review</span>
        </div>
      </div>

      <div className="stitch-header-bar">
        <div>
          <span className="stitch-badge orange">YOUR BAG</span>
          <h1 className="stitch-title">Shopping Cart</h1>
          <p className="stitch-subtitle">
            {cartItems.length} unique {cartItems.length === 1 ? "item" : "items"} selected
          </p>
        </div>

        <button
          className="clear-cart-link"
          onClick={() => {
            if (window.confirm("Are you sure you want to clear your entire bag?")) {
              dispatch(clearCart());
            }
          }}
        >
          Clear All Items
        </button>
      </div>

      <div className="cart-grid-layout">
        {/* Left: Items List */}
        <div className="cart-items-column">
          {/* Free Shipping Progress Indicator */}
          <div className="shipping-progress-card">
            <div className="shipping-progress-text">
              {remainingForFreeShipping > 0 ? (
                <span>
                  Add <strong>₹{remainingForFreeShipping.toFixed(2)}</strong> more to unlock <strong>FREE Express Shipping</strong>!
                </span>
              ) : (
                <span className="free-shipping-unlocked">
                  🎉 Congratulations! You've unlocked <strong>FREE Express Delivery</strong>.
                </span>
              )}
            </div>
            <div className="shipping-meter-bg">
              <div
                className="shipping-meter-fill"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>

          <div className="cart-items-wrapper">
            {cartItems.map((item) => (
              <div key={item.productId} className="cart-item-card">
                <Link to={`/product/${item.productId}`} className="cart-item-thumb">
                  <img src={item.imageUrl} alt={item.name} />
                </Link>

                <div className="cart-item-main">
                  <div className="cart-item-header">
                    <Link to={`/product/${item.productId}`} className="cart-item-name">
                      {item.name}
                    </Link>
                    <button
                      className="cart-remove-icon-btn"
                      onClick={() => handleRemove(item.productId)}
                      title="Remove Item"
                    >
                      ✕
                    </button>
                  </div>

                  <span className="cart-item-price-unit">
                    ₹{Number(item.price).toFixed(2)} each
                  </span>

                  <div className="cart-item-footer">
                    <div className="qty-picker">
                      <button
                        onClick={() => handleUpdateQty(item, item.qty - 1)}
                        className="qty-btn"
                        title="Decrease"
                      >
                        -
                      </button>
                      <span className="qty-value">{item.qty}</span>
                      <button
                        onClick={() => handleUpdateQty(item, item.qty + 1)}
                        className="qty-btn"
                        title="Increase"
                      >
                        +
                      </button>
                    </div>

                    <div className="cart-item-total-price">
                      ₹{(item.price * item.qty).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Order Summary Card */}
        <div className="cart-summary-column">
          <div className="stitch-card cart-summary-card">
            <h3 className="summary-title">Order Summary</h3>

            {/* Promo Code Form */}
            <form className="coupon-box" onSubmit={handleApplyCoupon}>
              <input
                type="text"
                placeholder="Promo code (e.g. MOOD20)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button type="submit" className="coupon-apply-btn">
                Apply
              </button>
            </form>
            {couponMessage && (
              <p className={`coupon-msg ${couponMessage.type}`}>
                {couponMessage.text}
              </p>
            )}

            <div className="summary-breakdown">
              <div className="summary-row">
                <span>Subtotal ({cartItems.reduce((acc, i) => acc + i.qty, 0)} items)</span>
                <span>₹{rawTotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="summary-row discount">
                  <span>Special Promo (20% OFF)</span>
                  <span>- ₹{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="summary-row">
                <span>Estimated Shipping</span>
                <span className="free-tag">
                  {rawTotal >= freeShippingThreshold ? "FREE" : "₹99.00"}
                </span>
              </div>

              <div className="summary-row">
                <span>GST &amp; Taxes</span>
                <span className="free-tag">Included</span>
              </div>

              <div className="summary-divider" />

              <div className="summary-total-row">
                <div>
                  <span className="total-label">Grand Total</span>
                  <p className="tax-subtext">Includes all applicable duties</p>
                </div>
                <span className="total-amount">₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="stitch-btn-primary btn-block-checkout"
            >
              Proceed to Secure Checkout →
            </button>

            <Link to="/shop" className="continue-shopping-link">
              ← Continue Shopping
            </Link>

            <div className="cart-trust-badges">
              <div className="trust-pill">🔒 256-bit SSL Encrypted</div>
              <div className="trust-pill">🛡️ 30-Day Money Back</div>
              <div className="trust-pill">⚡ Instant Dispatch</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
