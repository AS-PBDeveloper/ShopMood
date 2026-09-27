import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { useWishlist } from "../context/WishlistContext";
import "../styles/product.css";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [added, setAdded] = useState(false);

  const isWishlisted = isInWishlist(product._id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        qty: 1,
      }),
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const rating = product.ratings || 4.8;
  const numReviews = product.numReviews || 24;
  const originalPrice = (product.price * 1.25).toFixed(2);

  return (
    <div className="product-card">
      <div className="product-image-container">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-image"
            loading="lazy"
          />
        </Link>

        {product.category && (
          <span className="category-tag">{product.category}</span>
        )}

        <button
          className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
          onClick={handleWishlistClick}
          title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
          aria-label="Wishlist"
        >
          {isWishlisted ? "♥" : "♡"}
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
            className={`btn-quick-add ${added ? "added" : ""}`}
            onClick={handleQuickAdd}
          >
            {added ? "✓ Added!" : "+ Add to Cart"}
          </button>
          <Link to={`/product/${product._id}`} className="btn-details">
            Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
