import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useSelector } from "react-redux";
import "../styles/navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (user && user.token) {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${user.token}` },
        credentials: "include",
      });
    }

    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <img
            src="/ShopMoodLogo.png"
            alt="ShopMood"
            style={{
              height: "36px",
              width: "36px",
              borderRadius: "8px",
              objectFit: "cover",
              filter: "drop-shadow(0 2px 8px rgba(249, 115, 22, 0.35))",
            }}
          />
          ShopMood
        </Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/shop">Shop</Link>
        </li>
        <li>
          <Link to="/cart">Cart ({cartItems.length})</Link>
        </li>
        {user ? (
          <>
            <li>
              <Link to="/profile">Hi, {user.name}</Link>
            </li>
            {user.role === "admin" && (
              <li>
                <Link to="/admin">Admin</Link>
              </li>
            )}
            <li>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
