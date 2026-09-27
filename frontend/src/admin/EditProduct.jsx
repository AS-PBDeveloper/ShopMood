import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useParams, useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../services/api";

const EditProduct = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    imageUrl: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setFormData({
          name: data.name || "",
          description: data.description || "",
          price: data.price || "",
          category: data.category || "Electronics",
          stock: data.stock || "",
          imageUrl: data.imageUrl || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    fetchProduct();
  }, [id, user, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("stock", formData.stock);
    if (image) data.append("image", image);

    try {
      const res = await apiFetch(`/api/products/${id}`, {
        method: "PUT",
        body: data,
      });
      if (res.ok) {
        alert("✓ Product updated successfully!");
        navigate("/admin/products");
      } else {
        const responseData = await res.json();
        alert(
          responseData.errors
            ? responseData.errors.map((e) => e.message).join("\n")
            : responseData.message || "Error updating product",
        );
      }
    } catch (error) {
      console.error(error);
      alert("Network error updating product.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="stitch-page-container">
        <div className="stitch-empty-state">
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  const currentDisplayImg = imagePreview || formData.imageUrl;

  return (
    <div className="stitch-page-container" style={{ maxWidth: "780px" }}>
      <div className="stitch-header-bar">
        <div>
          <span className="stitch-badge orange">INVENTORY EDITOR</span>
          <h1 className="stitch-title">Edit Product</h1>
          <p className="stitch-subtitle">
            Update pricing, descriptions, categories, or replace media
          </p>
        </div>
        <Link to="/admin/products" className="stitch-btn-secondary">
          ← Cancel &amp; Back
        </Link>
      </div>

      <div className="stitch-card">
        <form onSubmit={handleSubmit}>
          <div className="stitch-form-group">
            <label className="stitch-label">Product Name / Title</label>
            <input
              type="text"
              required
              className="stitch-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-inline-row">
            <div className="stitch-form-group flex-1">
              <label className="stitch-label">Category</label>
              <select
                className="stitch-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Electronics">Electronics</option>
                <option value="Footwear">Footwear</option>
                <option value="Accessories">Accessories</option>
                <option value="Furniture">Furniture</option>
                <option value="Clothing">Clothing</option>
              </select>
            </div>

            <div className="stitch-form-group flex-1">
              <label className="stitch-label">Price (INR ₹)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                className="stitch-input"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            <div className="stitch-form-group flex-1">
              <label className="stitch-label">Stock Units</label>
              <input
                type="number"
                min="0"
                required
                className="stitch-input"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>
          </div>

          <div className="stitch-form-group">
            <label className="stitch-label">Description</label>
            <textarea
              rows="5"
              required
              className="stitch-textarea"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Media Replacement */}
          <div className="stitch-form-group">
            <label className="stitch-label">Product Image</label>
            <div className="image-upload-zone">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="edit-file-input"
                style={{ display: "none" }}
              />
              <label htmlFor="edit-file-input" className="image-upload-label">
                {currentDisplayImg ? (
                  <div className="image-preview-wrapper">
                    <img src={currentDisplayImg} alt="Preview" className="uploaded-preview-img" />
                    <span className="change-img-text">Click to Choose Replacement Image</span>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <span className="upload-icon">📷</span>
                    <strong>Click to Choose Replacement Image</strong>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "24px" }}>
            <Link to="/admin/products" className="stitch-btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="stitch-btn-primary"
              style={{ minWidth: "160px" }}
            >
              {loading ? "Saving Changes..." : "Save Product Updates →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
