import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";

const AdminOrders = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const fetchOrders = async () => {
      try {
        const res = await apiFetch("/api/orders");
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, navigate]);

  const updateStatus = async (id, status) => {
    try {
      const res = await apiFetch(`/api/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders(
          orders.map((order) =>
            order._id === id ? { ...order, status } : order,
          ),
        );
      } else {
        alert("Failed to update order status.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === "All") return true;
    return o.status === statusFilter;
  });

  return (
    <div className="stitch-page-container">
      <div className="stitch-header-bar">
        <div>
          <span className="stitch-badge orange">LOGISTICS &amp; FULFILLMENT</span>
          <h1 className="stitch-title">Customer Orders</h1>
          <p className="stitch-subtitle">
            Track customer shipments, transaction receipts, and dispatch states
          </p>
        </div>

        <Link to="/admin" className="stitch-btn-secondary">
          ← Dashboard
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="stitch-card" style={{ padding: "14px 20px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {["All", "Pending", "Shipped", "Delivered"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`cat-pill-btn ${statusFilter === st ? "active" : ""}`}
            >
              {st} ({st === "All" ? orders.length : orders.filter((o) => o.status === st).length})
            </button>
          ))}
        </div>

        <span style={{ color: "#a1a1aa", fontSize: "0.88rem" }}>
          Total Value: <strong>₹{orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0).toFixed(2)}</strong>
        </span>
      </div>

      {/* Orders Table */}
      <div className="stitch-table-wrapper">
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#a1a1aa" }}>
            Loading orders list...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="stitch-empty-state">
            <span className="stitch-empty-icon">📦</span>
            <h3 className="stitch-empty-title">No orders found</h3>
            <p className="stitch-empty-text">No orders currently match the selected status filter.</p>
          </div>
        ) : (
          <table className="stitch-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items Count</th>
                <th>Total Value</th>
                <th>Date</th>
                <th>Fulfillment Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <span style={{ fontFamily: "monospace", color: "#fb923c", fontWeight: 700 }}>
                      #{order._id.substring(0, 8).toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: "#fff" }}>
                      {order.userId?.name || order.address?.fullName || "Guest Customer"}
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "#71717a" }}>
                      {order.userId?.email || "No email"}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: "#d4d4d8" }}>
                      {order.items?.length || 0} {order.items?.length === 1 ? "item" : "items"}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: "#10b981", fontSize: "0.98rem" }}>
                      ₹{Number(order.totalAmount).toFixed(2)}
                    </strong>
                  </td>
                  <td>
                    <span style={{ color: "#a1a1aa", fontSize: "0.85rem" }}>
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </td>
                  <td>
                    <select
                      value={order.status || "Pending"}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className={`order-status-select ${
                        order.status === "Delivered"
                          ? "status-delivered"
                          : order.status === "Shipped"
                          ? "status-shipped"
                          : "status-pending"
                      }`}
                    >
                      <option value="Pending">● Pending</option>
                      <option value="Shipped">● Shipped</option>
                      <option value="Delivered">● Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
