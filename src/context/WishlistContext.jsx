import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../utils/api';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch (error) {
      console.error('Failed to parse wishlist from localStorage:', error);
      return [];
    }
  });
  const { user, isAuthenticated } = useAuth();

  // Load wishlist on mount or auth change
  useEffect(() => {
    const fetchWishlist = async () => {
      if (isAuthenticated) {
        try {
          const data = await api.user.getWishlist();
          setWishlist(data);
        } catch (error) {
          console.error('Failed to fetch wishlist from DB:', error);
          // Fallback to local on error or keep as is
        }
      } else {
        // Already initialized from localStorage in useState
      }
    };

    fetchWishlist();
  }, [isAuthenticated]);

  // Save guest wishlist to localStorage whenever it changes
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isAuthenticated]);

  const toggleWishlist = async (product) => {
    if (isAuthenticated) {
      try {
        const updatedWishlist = await api.user.toggleWishlist(product._id || product.id);
        setWishlist(updatedWishlist);
      } catch (error) {
        console.error('Failed to toggle wishlist in DB:', error);
      }
    } else {
      setWishlist((prev) => {
        const productId = product._id || product.id;
        const exists = prev.find((item) => item._id === productId || item.id === productId);
        if (exists) {
          return prev.filter((item) => item._id !== productId && item.id !== productId);
        } else {
          return [...prev, { ...product, id: productId, _id: productId }];
        }
      });
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId || item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
