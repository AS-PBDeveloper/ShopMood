import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../services/api";

const AddProduct = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Electronics",
    stock: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please select a product image to upload.");

    setLoading(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("stock", formData.stock);
    data.append("image", image);

    try {
      const res = await apiFetch("/api/products", {
        method: "POST",
        body: data,
      });
      const responseData = await res.json();

      if (res.ok) {
        alert("🎉 Product published successfully!");
        navigate("/admin/products");
      } else {
        alert(
          responseData.errors
            ? responseData.errors.map((e) => e.message).join("\n")
            : responseData.message || "Error creating product",
        );
      }
    } catch (error) {
      console.error(error);
      alert("Network error publishing product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stitch-page-container" style={{ maxWidth: "780px" }}>
      <div className="stitch-header-bar">
        <div>
          <span className="stitch-badge orange">CATALOG CREATION</span>
          <h1 className="stitch-title">Add New Product</h1>
          <p className="stitch-subtitle">
            Create a new item in the catalog with high-resolution imagery and specs
          </p>
        </div>
        <Link to="/admin/products" className="stitch-btn-secondary">
          ← Cancel &amp; Back
        </Link>
      </div>

      <div className="stitch-card">
        <form onSubmit={handleSubmit}>
          <div className="stitch-form-group">
            <label className="stitch-label">Product Title / Name</label>
            <input
              type="text"
              placeholder="e.g. Minimalist Wireless Audio Monitor"
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
                placeholder="299.99"
                required
                className="stitch-input"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            <div className="stitch-form-group flex-1">
              <label className="stitch-label">Initial Stock Quantity</label>
              <input
                type="number"
                min="0"
                placeholder="25"
                required
                className="stitch-input"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>
          </div>

          <div className="stitch-form-group">
            <label className="stitch-label">Detailed Product Description</label>
            <textarea
              rows="5"
              placeholder="Provide key features, dimensions, technical materials, and warranty information..."
              required
              className="stitch-textarea"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Media Upload Box */}
          <div className="stitch-form-group">
            <label className="stitch-label">Product Image (Cloudinary Integration)</label>
            <div className="image-upload-zone">
              <input
                type="file"
                accept="image/*"
                required
                onChange={handleImageChange}
                id="product-file-input"
                style={{ display: "none" }}
              />
              <label htmlFor="product-file-input" className="image-upload-label">
                {imagePreview ? (
                  <div className="image-preview-wrapper">
                    <img src={imagePreview} alt="Preview" className="uploaded-preview-img" />
                    <span className="change-img-text">Click to Change Image</span>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <span className="upload-icon">📷</span>
                    <strong>Click to Browse Photo</strong>
                    <p>PNG, JPG, or WEBP up to 5MB (Uploads securely to Cloudinary)</p>
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
              {loading ? "Uploading & Publishing..." : "Publish Product →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
