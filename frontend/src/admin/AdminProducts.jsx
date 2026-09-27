import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../services/api";

const AdminProducts = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const fetchProducts = async () => {
      try {
        const res = await apiFetch("/api/products");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [user, navigate]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you strictly sure you want to delete "${name}"?`)) {
      const res = await apiFetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts(products.filter((p) => p._id !== id));
      } else {
        alert("Failed to delete product.");
      }
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="stitch-page-container">
      <div className="stitch-header-bar">
        <div>
          <span className="stitch-badge orange">INVENTORY MANAGEMENT</span>
          <h1 className="stitch-title">Products Catalogue</h1>
          <p className="stitch-subtitle">
            Manage product listings, pricing, live stock units, and assets
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Link to="/admin" className="stitch-btn-secondary">
            ← Dashboard
          </Link>
          <Link to="/admin/add-product" className="stitch-btn-primary">
            + Add New Product
          </Link>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="stitch-card" style={{ padding: "16px 24px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", maxWidth: "400px" }}>
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="stitch-input"
            style={{ padding: "9px 14px" }}
          />
        </div>
        <span style={{ color: "#a1a1aa", fontSize: "0.9rem" }}>
          Showing <strong>{filtered.length}</strong> of {products.length} products
        </span>
      </div>

      {/* Products Table */}
      <div className="stitch-table-wrapper">
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#a1a1aa" }}>
            Loading products catalog...
          </div>
        ) : filtered.length === 0 ? (
          <div className="stitch-empty-state">
            <span className="stitch-empty-icon">📦</span>
            <h3 className="stitch-empty-title">No products match</h3>
            <p className="stitch-empty-text">Try adjusting your search criteria or add a new product.</p>
          </div>
        ) : (
          <table className="stitch-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock Units</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "8px",
                          objectFit: "cover",
                          background: "#09090b",
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: "#fff" }}>{product.name}</div>
                        <span style={{ fontSize: "0.75rem", color: "#71717a" }}>
                          ID: {product._id.substring(0, 8)}...
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="stitch-badge orange">{product.category}</span>
                  </td>
                  <td>
                    <strong style={{ color: "#fff", fontSize: "1rem" }}>
                      ₹{Number(product.price).toFixed(2)}
                    </strong>
                  </td>
                  <td>
                    <span
                      className={`stitch-badge ${
                        product.stock > 10 ? "green" : product.stock > 0 ? "amber" : "orange"
                      }`}
                    >
                      ● {product.stock} in stock
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                      <Link
                        to={`/admin/edit-product/${product._id}`}
                        className="stitch-btn-secondary"
                        style={{ padding: "7px 14px", fontSize: "0.85rem" }}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id, product.name)}
                        className="stitch-btn-danger"
                      >
                        Delete
                      </button>
                    </div>
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

export default AdminProducts;
