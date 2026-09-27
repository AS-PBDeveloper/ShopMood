import React, { createContext, useContext, useState, useEffect } from "react";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem("shopmood_wishlist");
      return stored ? JSON.parse(stored) : [];
    } catch (_) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("shopmood_wishlist", JSON.stringify(wishlist));
    } catch (_) {}
  }, [wishlist]);

  const isInWishlist = (productId) => {
    if (!productId) return false;
    return wishlist.some(
      (item) => (typeof item === "object" ? item._id : item) === productId,
    );
  };

  const toggleWishlist = (product) => {
    if (!product) return;
    const id = typeof product === "object" ? product._id : product;
    setWishlist((prev) => {
      const exists = prev.some(
        (item) => (typeof item === "object" ? item._id : item) === id,
      );
      if (exists) {
        return prev.filter(
          (item) => (typeof item === "object" ? item._id : item) !== id,
        );
      } else {
        return [...prev, product];
      }
    });
  };

  const addToWishlist = (product) => {
    if (!product) return;
    const id = typeof product === "object" ? product._id : product;
    setWishlist((prev) => {
      const exists = prev.some(
        (item) => (typeof item === "object" ? item._id : item) === id,
      );
      if (exists) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) =>
      prev.filter(
        (item) => (typeof item === "object" ? item._id : item) !== productId,
      ),
    );
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
