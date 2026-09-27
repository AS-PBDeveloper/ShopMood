import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../services/api";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const fetchMyOrders = async () => {
      try {
        const res = await apiFetch("/api/orders/myorders");
        const data = await res.json();
        if (res.ok) {
          setOrders(Array.isArray(data) ? data : []);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user) return null;

  const totalSpent = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);

  return (
    <div className="stitch-page-container">
      {/* 1. Profile Header Hero Card */}
      <div className="stitch-card profile-hero-card">
        <div className="profile-hero-left">
          <div className="profile-large-avatar">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>

          <div className="profile-details-text">
            <div className="profile-name-row">
              <h1 className="profile-name">{user.name}</h1>
              <span className={`stitch-badge ${user.role === "admin" ? "orange" : "blue"}`}>
                {user.role ? user.role.toUpperCase() : "CUSTOMER"}
              </span>
            </div>
            <p className="profile-email">📧 {user.email}</p>

            <div className="profile-stats-chips">
              <span className="profile-stat-chip">
                <strong>{orders.length}</strong> Total Orders
              </span>
              <span className="profile-stat-chip">
                <strong>₹{totalSpent.toFixed(2)}</strong> Total Value
              </span>
              {user.role === "admin" && (
                <Link to="/admin" className="profile-stat-chip admin-chip">
                  ⚙️ Open Admin Control Panel →
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="profile-hero-actions">
          <button onClick={handleLogout} className="stitch-btn-danger">
            Sign Out
          </button>
        </div>
      </div>

      {/* 2. Order History Section */}
      <div className="profile-orders-section" style={{ marginTop: "40px" }}>
        <div className="stitch-header-bar">
          <div>
            <span className="stitch-badge orange">ACTIVITY</span>
            <h2 className="stitch-title" style={{ fontSize: "1.8rem" }}>
              My Orders &amp; Receipts
            </h2>
            <p className="stitch-subtitle">
              Track recent package statuses, tracking identifiers, and transaction records
            </p>
          </div>
          <Link to="/shop" className="stitch-btn-secondary">
            + Continue Shopping
          </Link>
        </div>

        {loading ? (
          <div className="stitch-empty-state">
            <p>Fetching your order records...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="stitch-empty-state">
            <span className="stitch-empty-icon">📦</span>
            <h3 className="stitch-empty-title">No Orders Placed Yet</h3>
            <p className="stitch-empty-text">
              You haven't made any purchases with this account. Explore our curated collections and place your first order.
            </p>
            <Link to="/shop" className="stitch-btn-primary">
              Explore Storefront →
            </Link>
          </div>
        ) : (
          <div className="profile-orders-list">
            {orders.map((order) => (
              <div key={order._id} className="stitch-card profile-order-card">
                <div className="order-card-header">
                  <div className="order-id-block">
                    <span className="order-label">ORDER ID</span>
                    <span className="order-code">#{order._id.substring(0, 10).toUpperCase()}</span>
                  </div>

                  <div className="order-meta-group">
                    <div className="order-meta-item">
                      <span className="order-label">PLACED ON</span>
                      <span className="order-val">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="order-meta-item">
                      <span className="order-label">TOTAL AMOUNT</span>
                      <span className="order-val order-price">
                        ₹{Number(order.totalAmount).toFixed(2)}
                      </span>
                    </div>

                    <span
                      className={`order-status-pill ${
                        order.status === "Delivered"
                          ? "status-delivered"
                          : order.status === "Shipped"
                          ? "status-shipped"
                          : "status-pending"
                      }`}
                    >
                      ● {order.status || "Processing"}
                    </span>
                  </div>
                </div>

                {/* Items preview */}
                {order.items && order.items.length > 0 && (
                  <div className="order-items-strip">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="order-item-chip">
                        {it.imageUrl && (
                          <img src={it.imageUrl} alt={it.name} className="order-item-img" />
                        )}
                        <span className="order-item-title">
                          {it.name} <strong>x{it.qty || 1}</strong>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
