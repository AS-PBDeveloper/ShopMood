import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { useWishlist } from "../context/WishlistContext";
import "../styles/product.css";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isWishlisted = isInWishlist(id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addToCart({
          productId: product._id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          qty,
        }),
      );
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      dispatch(
        addToCart({
          productId: product._id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          qty,
        }),
      );
      navigate("/checkout");
    }
  };

  if (loading) {
    return (
      <div className="stitch-page-container">
        <div className="stitch-empty-state">
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product || product.message === "Product not found") {
    return (
      <div className="stitch-page-container">
        <div className="stitch-empty-state">
          <span className="stitch-empty-icon">🔍</span>
          <h2 className="stitch-empty-title">Product Not Found</h2>
          <p className="stitch-empty-text">
            The product you're looking for might have been retired or does not exist.
          </p>
          <Link to="/shop" className="stitch-btn-primary">
            Explore All Products →
          </Link>
        </div>
      </div>
    );
  }

  const rating = product.ratings || 4.8;
  const numReviews = product.numReviews || 24;
  const originalPrice = (product.price * 1.25).toFixed(2);
  const inStock = product.stock > 0;

  return (
    <div className="stitch-page-container">
      {/* Category Breadcrumbs */}
      <nav className="product-breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb-sep">/</span>
        <Link to="/shop">Shop</Link>
        <span className="breadcrumb-sep">/</span>
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`}>
          {product.category}
        </Link>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{product.name}</span>
      </nav>

      <div className="product-detail-layout">
        {/* Left Column: Product Image Showcase */}
        <div className="product-media-column">
          <div className="product-media-card">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="product-detail-main-img"
            />
            <button
              className={`product-detail-wishlist-btn ${isWishlisted ? "active" : ""}`}
              onClick={() => toggleWishlist(product)}
              title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
            >
              {isWishlisted ? "♥" : "♡"}
            </button>
            <span className="product-detail-badge">{product.category}</span>
          </div>

          <div className="product-perks-grid">
            <div className="detail-perk">
              <span className="perk-emoji">🚀</span>
              <div>
                <strong>Express Delivery</strong>
                <p>Ships within 24 hours</p>
              </div>
            </div>
            <div className="detail-perk">
              <span className="perk-emoji">🛡️</span>
              <div>
                <strong>1-Year Warranty</strong>
                <p>Genuine brand guarantee</p>
              </div>
            </div>
            <div className="detail-perk">
              <span className="perk-emoji">🔄</span>
              <div>
                <strong>30-Day Returns</strong>
                <p>Hassle-free refunds</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Information & Actions */}
        <div className="product-info-column">
          <div className="stitch-card product-purchase-card">
            <span className="stitch-badge orange" style={{ marginBottom: "12px" }}>
              {product.category.toUpperCase()}
            </span>

            <h1 className="product-detail-name">{product.name}</h1>

            {/* Rating Stars Row */}
            <div className="product-detail-ratings-row">
              <span className="stars">
                {"★".repeat(Math.floor(rating))}
                {"☆".repeat(5 - Math.floor(rating))}
              </span>
              <span className="rating-score">{rating}</span>
              <span className="rating-divider">•</span>
              <span className="reviews-count">{numReviews} Verified Reviews</span>
            </div>

            {/* Price Box */}
            <div className="detail-price-box">
              <div className="price-main-row">
                <span className="detail-active-price">
                  ₹{Number(product.price).toFixed(2)}
                </span>
                <span className="detail-strike-price">₹{originalPrice}</span>
                <span className="discount-pill">SAVE 20%</span>
              </div>
              <span className="tax-inclusive-text">
                All applicable taxes and import duties included
              </span>
            </div>

            {/* Stock Availability */}
            <div className="detail-stock-indicator">
              {inStock ? (
                <span className="stock-status in-stock">
                  <span className="stock-dot live" /> In Stock ({product.stock} units ready to ship)
                </span>
              ) : (
                <span className="stock-status out-stock">
                  <span className="stock-dot dead" /> Currently Sold Out
                </span>
              )}
            </div>

            {/* Description Paragraph */}
            <div className="detail-description-section">
              <h3>Product Overview</h3>
              <p>{product.description}</p>
            </div>

            {/* Quantity Selector */}
            {inStock && (
              <div className="detail-qty-group">
                <label className="stitch-label">Quantity</label>
                <div className="qty-picker">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="qty-btn"
                    disabled={qty <= 1}
                  >
                    -
                  </button>
                  <span className="qty-value">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="qty-btn"
                    disabled={qty >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Dual CTA Buttons */}
            <div className="detail-actions-row">
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`stitch-btn-primary btn-add-bag ${added ? "added" : ""}`}
              >
                {added ? "✓ Added to Shopping Bag!" : "Add to Shopping Bag"}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!inStock}
                className="btn-buy-instant"
              >
                Buy Now ⚡
              </button>
            </div>

            {/* Security Guarantee Strip */}
            <div className="detail-security-strip">
              <span>🔒 Guaranteed Safe Checkout | 100% Buyer Protection</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
