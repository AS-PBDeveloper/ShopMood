import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../services/api";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await apiFetch("/api/analytics");
        const data = await res.json();
        if (res.ok) {
          setStats(data);
        } else {
          setStats({
            totalOrders: 0,
            totalProducts: 0,
            totalUsers: 0,
            totalRevenue: 0,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, [user, navigate]);

  return (
    <div className="stitch-page-container">
      {/* Header bar */}
      <div className="stitch-header-bar">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <span className="stitch-badge orange">ADMINISTRATOR CONSOLE</span>
          </div>
          <h1 className="stitch-title">Dashboard Overview</h1>
          <p className="stitch-subtitle">
            Welcome back, <strong>{user?.name}</strong>. Here's your real-time store performance.
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <Link to="/admin/add-product" className="stitch-btn-primary">
            + Add New Product
          </Link>
          <Link to="/shop" className="stitch-btn-secondary">
            View Storefront →
          </Link>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="admin-stats-grid">
        <div className="stitch-card stat-metric-card revenue">
          <div className="stat-metric-header">
            <span className="stat-metric-title">Gross Revenue</span>
            <span className="stat-metric-icon">💰</span>
          </div>
          <div className="stat-metric-value">
            ₹{stats ? Number(stats.totalRevenue).toFixed(2) : "..."}
          </div>
          <p className="stat-metric-subtext">Verified customer transactions</p>
        </div>

        <div className="stitch-card stat-metric-card orders">
          <div className="stat-metric-header">
            <span className="stat-metric-title">Total Orders</span>
            <span className="stat-metric-icon">📦</span>
          </div>
          <div className="stat-metric-value">{stats ? stats.totalOrders : "..."}</div>
          <p className="stat-metric-subtext">Across all fulfillment stages</p>
        </div>

        <div className="stitch-card stat-metric-card products">
          <div className="stat-metric-header">
            <span className="stat-metric-title">Live Products</span>
            <span className="stat-metric-icon">🛍️</span>
          </div>
          <div className="stat-metric-value">{stats ? stats.totalProducts : "..."}</div>
          <p className="stat-metric-subtext">Active items in catalog</p>
        </div>

        <div className="stitch-card stat-metric-card users">
          <div className="stat-metric-header">
            <span className="stat-metric-title">Registered Users</span>
            <span className="stat-metric-icon">👥</span>
          </div>
          <div className="stat-metric-value">{stats ? stats.totalUsers : "..."}</div>
          <p className="stat-metric-subtext">Customer and admin accounts</p>
        </div>
      </div>

      {/* Administrative Quick Actions Strip */}
      <div className="stitch-card admin-quick-actions-card" style={{ marginTop: "32px" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "20px", color: "#fff" }}>
          Management Modules
        </h3>
        <div className="admin-nav-tiles-grid">
          <Link to="/admin/products" className="admin-nav-tile">
            <span className="nav-tile-icon">📦</span>
            <div>
              <h4>Manage Products</h4>
              <p>Update inventory, edit pricing, or remove catalog items</p>
            </div>
            <span className="tile-arrow">→</span>
          </Link>

          <Link to="/admin/orders" className="admin-nav-tile">
            <span className="nav-tile-icon">🚚</span>
            <div>
              <h4>Customer Orders</h4>
              <p>Review customer orders and update dispatch / delivery status</p>
            </div>
            <span className="tile-arrow">→</span>
          </Link>

          <Link to="/admin/users" className="admin-nav-tile">
            <span className="nav-tile-icon">👥</span>
            <div>
              <h4>User Directory</h4>
              <p>Audit registered accounts, emails, and assigned privileges</p>
            </div>
            <span className="tile-arrow">→</span>
          </Link>

          <Link to="/admin/add-product" className="admin-nav-tile">
            <span className="nav-tile-icon">✨</span>
            <div>
              <h4>Create New Product</h4>
              <p>Upload photography to Cloudinary and publish new listings</p>
            </div>
            <span className="tile-arrow">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
