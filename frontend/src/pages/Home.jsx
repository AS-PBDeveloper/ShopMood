import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { apiFetch } from "../services/api";
import "../styles/product.css";

const categories = [
  {
    id: "Electronics",
    name: "Electronics",
    icon: "⚡",
    subtitle: "Audio, Keyboards & Wearables",
    image: "/images/products/smartwatch.jpg",
  },
  {
    id: "Footwear",
    name: "Footwear",
    icon: "👟",
    subtitle: "Running & Casual Sneakers",
    image: "/images/products/sneakers.jpg",
  },
  {
    id: "Accessories",
    name: "Accessories",
    icon: "🎒",
    subtitle: "Handcrafted Bags & Leather",
    image: "/images/products/backpack.jpg",
  },
  {
    id: "Furniture",
    name: "Home & Living",
    icon: "🛋️",
    subtitle: "Modern Chairs & Minimalist Decor",
    image: "/images/products/keyboard.jpg",
  },
  {
    id: "Clothing",
    name: "Fashion & Apparel",
    icon: "👕",
    subtitle: "Essentials & Daily Staples",
    image: "/images/products/hoodie.jpg",
  },
];

const reviews = [
  {
    id: 1,
    name: "Aarav Sharma",
    avatar: "AS",
    rating: 5,
    verified: true,
    item: "Horizon Pro Smartwatch",
    comment:
      "The Horizon Pro smartwatch is nothing short of exceptional. The AMOLED display is vivid even in direct sunlight, and the leather strap feels like a luxury Swiss watch. Battery easily lasts 4 full days!",
  },
  {
    id: 2,
    name: "Sneha Patel",
    avatar: "SP",
    rating: 5,
    verified: true,
    item: "KeyCraft Custom Mechanical Keyboard",
    comment:
      "As a developer typing 8+ hours a day, KeyCraft transformed my desk setup. The tactile key switches feel smooth, the sound profile is deeply satisfying, and the build quality is tank-like.",
  },
  {
    id: 3,
    name: "Vikram Malhotra",
    avatar: "VM",
    rating: 5,
    verified: true,
    item: "Heritage Artisan Leather Backpack",
    comment:
      "Arrived in premium packaging in just 48 hours. Genuine full-grain leather that already has a rich patina. The dedicated 16-inch laptop compartment is perfectly cushioned.",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await apiFetch("/api/products");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredTrending =
    activeFilter === "All"
      ? products.slice(0, 8)
      : products
          .filter(
            (p) =>
              p.category &&
              p.category.toLowerCase() === activeFilter.toLowerCase(),
          )
          .slice(0, 8);

  return (
    <div className="home-container">
      {/* 1. HERO BANNER / PROMOTION SECTION */}
      <section className="hero-section">
        <div className="hero-banner-card">
          <div className="hero-image-backdrop">
            <img
              src="/images/hero-banner.jpg"
              alt="ShopMood New Season Collection"
              className="hero-bg-img"
            />
            <div className="hero-overlay-gradient" />
          </div>

          <div className="hero-content">
            <span className="hero-badge">✨ NEW SEASON COLLECTION 2026</span>
            <h1 className="hero-title">
              Elevated Style &amp; <br />
              <span className="gradient-text">Innovative Tech</span>
            </h1>
            <p className="hero-subtitle">
              Discover curated products you'll love with unmatched craftsmanship,
              modern aesthetics, and everyday performance.
            </p>

            <div className="hero-cta-group">
              <Link to="/shop" className="btn hero-btn-primary">
                Shop Now →
              </Link>
              <a href="#categories" className="btn hero-btn-secondary">
                Explore Categories
              </a>
            </div>

            {/* Quick Trust Badges */}
            <div className="hero-trust-row">
              <div className="trust-item">
                <span className="trust-icon">🚀</span>
                <span>Express Delivery</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">🔒</span>
                <span>Verified Payments</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">🛡️</span>
                <span>30-Day Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY SECTION */}
      <section id="categories" className="categories-section">
        <div className="section-header">
          <div>
            <span className="section-eyebrow">BROWSE BY INTEREST</span>
            <h2 className="section-title">Shop by Category</h2>
          </div>
          <Link to="/shop" className="section-link">
            See All Categories →
          </Link>
        </div>

        <div className="categories-grid">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="category-card"
              onClick={() => navigate(`/shop?category=${cat.id}`)}
            >
              <div className="category-img-wrap">
                <img src={cat.image} alt={cat.name} className="category-img" />
                <div className="category-overlay" />
              </div>
              <div className="category-info">
                <span className="category-icon">{cat.icon}</span>
                <h3 className="category-name">{cat.name}</h3>
                <p className="category-subtitle">{cat.subtitle}</p>
                <span className="category-btn">Explore →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TRENDING PRODUCTS SECTION */}
      <section className="trending-section">
        <div className="section-header">
          <div>
            <span className="section-eyebrow">HOT RIGHT NOW</span>
            <h2 className="section-title">Trending Products</h2>
          </div>

          {/* Filter Pills */}
          <div className="filter-pills">
            {["All", "Electronics", "Accessories", "Footwear"].map((cat) => (
              <button
                key={cat}
                className={`filter-pill ${activeFilter === cat ? "active" : ""}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="products-loading-skeleton">
            <p>Loading curated catalogue...</p>
          </div>
        ) : (
          <div className="product-grid">
            {filteredTrending.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <div className="view-more-container">
          <Link to="/shop" className="btn btn-view-more">
            Browse Entire Collection ({products.length} Items) →
          </Link>
        </div>
      </section>

      {/* 4. SPECIAL OFFER PROMOTION BANNER */}
      <section className="special-offer-section">
        <div className="offer-banner-card">
          <img
            src="/images/special-offer.jpg"
            alt="Seasonal Special Offer"
            className="offer-bg-img"
          />
          <div className="offer-gradient-overlay" />

          <div className="offer-content">
            <span className="offer-badge">🔥 LIMITED TIME DEAL</span>
            <h2 className="offer-heading">
              UP TO 50% OFF <br />
              <span className="offer-subheading">Select Luxury Essentials</span>
            </h2>
            <p className="offer-desc">
              Upgrade your personal setup today. Handcrafted leather goods, studio
              audio, and performance footwear on exclusive promotion.
            </p>
            <Link to="/shop?sale=true" className="btn offer-btn">
              Shop Collection →
            </Link>
          </div>
        </div>
      </section>

      {/* 5. CUSTOMER REVIEWS & TESTIMONIALS */}
      <section className="reviews-section">
        <div className="section-header text-center">
          <span className="section-eyebrow">COMMUNITY FEEDBACK</span>
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtext">
            Over 10,000+ satisfied customers trust ShopMood for daily essentials.
          </p>
        </div>

        <div className="reviews-grid">
          {reviews.map((rev) => (
            <div key={rev.id} className="review-card">
              <div className="review-stars">
                {"★".repeat(rev.rating)}
              </div>
              <p className="review-comment">"{rev.comment}"</p>
              <div className="review-author-row">
                <div className="author-avatar">{rev.avatar}</div>
                <div className="author-info">
                  <div className="author-name-wrap">
                    <h4 className="author-name">{rev.name}</h4>
                    {rev.verified && (
                      <span className="verified-badge">✓ Verified Buyer</span>
                    )}
                  </div>
                  <span className="purchased-item">{rev.item}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. NEWSLETTER / PERKS BANNER */}
      <section className="perks-strip">
        <div className="perk-box">
          <span className="perk-icon">📦</span>
          <div>
            <h4>Free Express Shipping</h4>
            <p>On all domestic orders over ₹999</p>
          </div>
        </div>
        <div className="perk-box">
          <span className="perk-icon">💳</span>
          <div>
            <h4>Flexible Payments</h4>
            <p>Cards, UPI, Netbanking &amp; COD</p>
          </div>
        </div>
        <div className="perk-box">
          <span className="perk-icon">🎧</span>
          <div>
            <h4>Dedicated 24/7 Support</h4>
            <p>Instant help whenever you need it</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
