import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useSelector } from "react-redux";
import { apiFetch } from "../services/api";
import "../styles/navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { wishlistCount } = useWishlist();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchBoxRef = useRef(null);

  // Debounced live search suggestions
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await apiFetch(
          `/api/products?keyword=${encodeURIComponent(searchTerm.trim())}`,
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          setSearchResults(data.slice(0, 5));
          setShowDropdown(true);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setShowDropdown(false);
      setMobileMenuOpen(false);
    }
  };

  const handleSelectProduct = (productId) => {
    navigate(`/product/${productId}`);
    setShowDropdown(false);
    setSearchTerm("");
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + (item.qty || 1), 0);

  return (
    <header className="site-header">
      {/* Top Promotional Bar */}
      <div className="top-banner">
        <span>🎉 Free express delivery on orders over ₹999 | Use code <strong>MOOD20</strong> for 20% off!</span>
      </div>

      <nav className="navbar">
        {/* Brand Logo & Name */}
        <div className="navbar-brand">
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>
            <img
              src="/ShopMoodLogo.png"
              alt="ShopMood Logo"
              className="brand-logo"
            />
            <span className="brand-name">ShopMood</span>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>

        {/* Navigation Categories & Search */}
        <div className={`nav-center ${mobileMenuOpen ? "open" : ""}`}>
          <ul className="category-links">
            <li>
              <Link to="/shop" onClick={() => setMobileMenuOpen(false)}>
                All Products
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Electronics" onClick={() => setMobileMenuOpen(false)}>
                Electronics
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Footwear" onClick={() => setMobileMenuOpen(false)}>
                Footwear
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Clothing" onClick={() => setMobileMenuOpen(false)}>
                Clothing
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Accessories" onClick={() => setMobileMenuOpen(false)}>
                Accessories
              </Link>
            </li>
            <li>
              <Link to="/shop?sale=true" className="sale-link" onClick={() => setMobileMenuOpen(false)}>
                Sale 🔥
              </Link>
            </li>
          </ul>

          {/* Fully Functional Search Bar with Live Suggestions Dropdown */}
          <div className="navbar-search-wrapper" ref={searchBoxRef}>
            <form className="navbar-search" onSubmit={handleSearchSubmit}>
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search products, categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) setShowDropdown(true);
                }}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => {
                    setSearchTerm("");
                    setShowDropdown(false);
                  }}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </form>

            {/* Live Autocomplete Suggestions Overlay */}
            {showDropdown && (
              <div className="search-dropdown-menu">
                {isSearching ? (
                  <div className="search-status-item">Searching catalogue...</div>
                ) : searchResults.length > 0 ? (
                  <>
                    <div className="search-dropdown-header">
                      <span>Matching Products</span>
                      <span>{searchResults.length} items</span>
                    </div>
                    {searchResults.map((product) => (
                      <div
                        key={product._id}
                        className="search-dropdown-item"
                        onClick={() => handleSelectProduct(product._id)}
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="search-item-thumb"
                        />
                        <div className="search-item-info">
                          <span className="search-item-title">{product.name}</span>
                          <div className="search-item-sub">
                            <span className="search-item-cat">{product.category}</span>
                            <span className="search-item-price">
                              ₹{Number(product.price).toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <span className="search-item-arrow">→</span>
                      </div>
                    ))}
                    <button
                      className="search-view-all-btn"
                      onClick={handleSearchSubmit}
                    >
                      View all results for "{searchTerm}" →
                    </button>
                  </>
                ) : (
                  <div className="search-status-item">
                    No products found for "{searchTerm}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Actions: Wishlist, Cart, Profile */}
        <div className="navbar-actions">
          {/* Fully Functional Wishlist Button */}
          <Link
            to="/wishlist"
            className="action-icon-btn"
            title="My Saved Wishlist"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="icon" style={{ color: wishlistCount > 0 ? "#f87171" : "inherit" }}>
              {wishlistCount > 0 ? "♥" : "♡"}
            </span>
            {wishlistCount > 0 && <span className="action-badge">{wishlistCount}</span>}
          </Link>

          {/* Cart Link with Live Count */}
          <Link
            to="/cart"
            className="action-icon-btn"
            title="Shopping Cart"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="icon">🛒</span>
            {user && totalCartCount > 0 && (
              <span className="action-badge">{totalCartCount}</span>
            )}
          </Link>

          {/* User Authentication Menu */}
          {user ? (
            <div className="user-nav-dropdown">
              <Link
                to="/profile"
                className="user-greeting"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="user-avatar">{user.name.charAt(0).toUpperCase()}</span>
                <span className="user-name-text">Hi, {user.name.split(" ")[0]}</span>
              </Link>

              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="admin-badge-btn"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}

              <button onClick={handleLogout} className="btn-logout" title="Sign Out">
                Logout
              </button>
            </div>
          ) : (
            <div className="guest-nav">
              <Link
                to="/login"
                className="btn-signin"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-signup"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
