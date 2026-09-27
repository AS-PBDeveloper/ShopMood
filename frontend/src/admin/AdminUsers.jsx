import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";

const AdminUsers = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const fetchUsers = async () => {
      try {
        const res = await apiFetch("/api/auth/users");
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [user, navigate]);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const adminCount = users.filter((u) => u.role === "admin").length;
  const userCount = users.filter((u) => u.role !== "admin").length;

  return (
    <div className="stitch-page-container">
      <div className="stitch-header-bar">
        <div>
          <span className="stitch-badge orange">IDENTITY &amp; ACCESS</span>
          <h1 className="stitch-title">User Directory</h1>
          <p className="stitch-subtitle">
            Auditing registered customer accounts, staff privileges, and authentication records
          </p>
        </div>

        <Link to="/admin" className="stitch-btn-secondary">
          ← Dashboard
        </Link>
      </div>

      {/* Top Filter and Stats Bar */}
      <div className="stitch-card" style={{ padding: "16px 24px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", maxWidth: "380px" }}>
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="stitch-input"
            style={{ padding: "9px 14px" }}
          />
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span className="stitch-badge orange">
            👑 {adminCount} {adminCount === 1 ? "Admin" : "Admins"}
          </span>
          <span className="stitch-badge green">
            👤 {userCount} {userCount === 1 ? "Customer" : "Customers"}
          </span>
        </div>
      </div>

      {/* Users Table */}
      <div className="stitch-table-wrapper">
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#a1a1aa" }}>
            Loading user directory...
          </div>
        ) : filtered.length === 0 ? (
          <div className="stitch-empty-state">
            <span className="stitch-empty-icon">👥</span>
            <h3 className="stitch-empty-title">No users found</h3>
            <p className="stitch-empty-text">No accounts match your search filter.</p>
          </div>
        ) : (
          <table className="stitch-table">
            <thead>
              <tr>
                <th>User Account</th>
                <th>Email Address</th>
                <th>Role &amp; Permissions</th>
                <th>Registered Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div className="author-avatar" style={{ width: "36px", height: "36px", fontSize: "0.85rem" }}>
                        {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "#fff" }}>{u.name}</div>
                        <span style={{ fontSize: "0.75rem", color: "#71717a" }}>
                          ID: {u._id.substring(0, 8)}...
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ color: "#d4d4d8" }}>{u.email}</span>
                  </td>
                  <td>
                    <span className={`stitch-badge ${u.role === "admin" ? "orange" : "green"}`}>
                      ● {u.role ? u.role.toUpperCase() : "USER"}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: "#a1a1aa", fontSize: "0.88rem" }}>
                      {new Date(u.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
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

export default AdminUsers;
