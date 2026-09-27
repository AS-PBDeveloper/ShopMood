import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";

const Wishlist = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const dispatch = useDispatch();
  const [movingId, setMovingId] = useState(null);

  const handleMoveToCart = (product) => {
    setMovingId(product._id);
    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        qty: 1,
      }),
    );
    setTimeout(() => {
      removeFromWishlist(product._id);
      setMovingId(null);
    }, 600);
  };

  if (wishlist.length === 0) {
    return (
      <div className="stitch-page-container">
        <div className="stitch-empty-state">
          <span className="stitch-empty-icon">🤍</span>
          <h2 className="stitch-empty-title">Your Wishlist is Empty</h2>
          <p className="stitch-empty-text">
            Explore our curated collections and click the heart icon on any product to save your favorite items for later.
          </p>
          <Link to="/shop" className="stitch-btn-primary">
            Explore Products Now →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="stitch-page-container">
      <div className="stitch-header-bar">
        <div>
          <span className="stitch-badge orange">SAVED ITEMS</span>
          <h1 className="stitch-title">My Wishlist</h1>
          <p className="stitch-subtitle">
            You have saved {wishlist.length} {wishlist.length === 1 ? "product" : "products"}
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to remove all saved items from your wishlist?")) {
                clearWishlist();
              }
            }}
            className="stitch-btn-danger"
          >
            Clear Wishlist
          </button>
          <Link to="/shop" className="stitch-btn-secondary">
            + Continue Shopping
          </Link>
        </div>
      </div>

      <div className="product-grid">
        {wishlist.map((product) => {
          const rating = product.ratings || 4.8;
          const numReviews = product.numReviews || 24;
          const originalPrice = (product.price * 1.25).toFixed(2);
          const isMoving = movingId === product._id;

          return (
            <div key={product._id} className="product-card">
              <div className="product-image-container">
                <Link to={`/product/${product._id}`}>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="product-image"
                  />
                </Link>

                {product.category && (
                  <span className="category-tag">{product.category}</span>
                )}

                <button
                  className="wishlist-btn active"
                  onClick={() => removeFromWishlist(product._id)}
                  title="Remove from Wishlist"
                  aria-label="Remove from Wishlist"
                >
                  ♥
                </button>
              </div>

              <div className="product-info">
                <div className="product-rating">
                  <span className="stars">
                    {"★".repeat(Math.floor(rating))}
                    {"☆".repeat(5 - Math.floor(rating))}
                  </span>
                  <span className="rating-text">
                    {rating} ({numReviews})
                  </span>
                </div>

                <Link to={`/product/${product._id}`}>
                  <h3 className="product-title" title={product.name}>
                    {product.name}
                  </h3>
                </Link>

                <div className="price-row">
                  <div className="price-block">
                    <span className="price">₹{Number(product.price).toFixed(2)}</span>
                    <span className="original-price">₹{originalPrice}</span>
                  </div>
                  <span className="discount-tag">20% OFF</span>
                </div>

                <div className="card-actions">
                  <button
                    className={`btn-quick-add ${isMoving ? "added" : ""}`}
                    onClick={() => handleMoveToCart(product)}
                    disabled={isMoving}
                  >
                    {isMoving ? "✓ Moved to Cart!" : "Move to Bag 🛒"}
                  </button>
                  <Link to={`/product/${product._id}`} className="btn-details">
                    Details →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
