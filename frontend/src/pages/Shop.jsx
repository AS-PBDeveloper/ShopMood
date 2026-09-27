import React, { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { apiFetch } from "../services/api";
import "../styles/product.css";

const Shop = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  // Read initial query params from URL (e.g. ?category=Electronics or ?search=smartwatch)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const catParam = params.get("category");
    const searchParam = params.get("search");

    if (catParam) {
      setSelectedCategory(catParam);
    } else {
      setSelectedCategory("All");
    }

    if (searchParam) {
      setSearch(searchParam);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await apiFetch("/api/products");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()) ||
          (p.category && p.category.toLowerCase().includes(search.toLowerCase()));

        const matchesCat =
          selectedCategory === "All" ||
          (p.category &&
            p.category.toLowerCase() === selectedCategory.toLowerCase());

        return matchesSearch && matchesCat;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return (b.ratings || 0) - (a.ratings || 0);
        return 0; // featured / default
      });
  }, [products, search, selectedCategory, sortBy]);

  return (
    <div className="shop-page-wrapper">
      {/* Top Page Header */}
      <div className="shop-header">
        <div>
          <span className="section-eyebrow">CATALOGUE</span>
          <h1 className="shop-title">Discover Our Products</h1>
          <p className="shop-desc">
            Showing {filteredProducts.length} of {products.length} curated essentials
          </p>
        </div>

        {/* Search input */}
        <div className="shop-search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Filter by name or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input-field"
          />
          {search && (
            <button className="clear-search-btn" onClick={() => setSearch("")}>
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filter & Sorting Controls Toolbar */}
      <div className="shop-toolbar">
        {/* Category Pills */}
        <div className="category-pills-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`cat-pill-btn ${selectedCategory.toLowerCase() === cat.toLowerCase() ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="sort-selector-wrap">
          <label htmlFor="sort-select">Sort By:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-dropdown"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Product Grid Area */}
      {loading ? (
        <div className="shop-loading-state">
          <p>Loading curated catalogue...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="shop-empty-state">
          <h3>No products match your criteria</h3>
          <p>Try clearing your search query or selecting a different category.</p>
          <button
            className="btn"
            onClick={() => {
              setSearch("");
              setSelectedCategory("All");
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
