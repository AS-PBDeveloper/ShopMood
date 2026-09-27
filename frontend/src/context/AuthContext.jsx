import React, { createContext, useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "../redux/cartSlice";
import { apiFetch } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(
    localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
  );

  const logout = useCallback(
    async ({ callApi = true } = {}) => {
      if (callApi) {
        try {
          await apiFetch("/api/auth/logout", {
            method: "POST",
          });
        } catch (_) {
          // Best-effort — still clear local state
        }
      }
      setUser(null);
      localStorage.removeItem("userInfo");
      dispatch(clearCart());
    },
    [dispatch],
  );

  // Verify session on initial mount
  useEffect(() => {
    const stored = localStorage.getItem("userInfo");
    if (!stored) return;
    const storedUser = JSON.parse(stored);
    if (!storedUser.token) return;

    apiFetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) {
          // Token invalid even after refresh attempt; force logout
          logout({ callApi: false });
        } else {
          return res.json().then((fresh) => {
            // Merge live profile data with stored token
            const merged = { ...storedUser, ...fresh };
            setUser(merged);
            localStorage.setItem("userInfo", JSON.stringify(merged));
          });
        }
      })
      .catch(() => {
        /* Network error — keep stale session for offline tolerance */
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for forced logout events from apiFetch (refresh token expired)
  useEffect(() => {
    const handler = () => logout({ callApi: false });
    window.addEventListener("auth:logout", handler);
    return () => window.removeEventListener("auth:logout", handler);
  }, [logout]);

  // Clear cart when user signs out
  useEffect(() => {
    if (!user) {
      dispatch(clearCart());
    }
  }, [dispatch, user]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("userInfo", JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
