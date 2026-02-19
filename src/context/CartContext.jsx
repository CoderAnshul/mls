import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../utils/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Failed to parse cart from localStorage:', error);
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const skipSync = useRef(false);

  // Mark as initialized from localStorage on mount
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // Fetch cart from backend when user logs in
  useEffect(() => {
    const fetchDBCart = async () => {
      if (user) {
        try {
          const dbCart = await api.user.getCart();
          // Transform DB cart format (product populated) to frontend format
          const formattedCart = dbCart.map(item => ({
            ...item.product,
            selectedSize: item.selectedSize,
            selectedLength: item.selectedLength,
            selectedColor: item.selectedColor,
            quantity: item.quantity,
            _id: item.product._id,
            id: item.product._id
          }));
          
          skipSync.current = true;
          setCart(formattedCart);
        } catch (error) {
          console.error('Failed to fetch cart from DB:', error);
        }
      }
    };

    fetchDBCart();
  }, [user]);

  // Sync cart to localStorage and backend whenever it changes
  useEffect(() => {
    if (!isInitialized) return;

    localStorage.setItem('cart', JSON.stringify(cart));

    const syncWithBackend = async () => {
      if (user && !skipSync.current) {
        try {
          await api.user.syncCart(cart);
        } catch (error) {
          console.error('Failed to sync cart with backend:', error);
        }
      }
      skipSync.current = false;
    };

    syncWithBackend();
  }, [cart, user, isInitialized]);

  const addToCart = (product, size, length, color) => {
    setCart((prev) => {
      const productId = product._id || product.id;
      const existingIndex = prev.findIndex(
        (item) => 
          (item._id === productId || item.id === productId) && 
          item.selectedSize === size && 
          item.selectedLength === length &&
          item.selectedColor === color
      );

      if (existingIndex > -1) {
        const newCart = [...prev];
        newCart[existingIndex].quantity += 1;
        return newCart;
      } else {
        return [...prev, { 
          ...product, 
          id: productId, 
          _id: productId, 
          selectedSize: size, 
          selectedLength: length, 
          selectedColor: color,
          quantity: 1 
        }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId, size, length, color) => {
    setCart((prev) => prev.filter(
      (item) => !(
        (item._id === productId || item.id === productId) && 
        item.selectedSize === size && 
        item.selectedLength === length &&
        item.selectedColor === color
      )
    ));
  };

  const updateQuantity = (productId, size, length, color, newQuantity) => {
    setCart((prev) => prev.map((item) => {
      const isMatch = (item._id === productId || item.id === productId) && 
                      item.selectedSize === size && 
                      item.selectedLength === length &&
                      item.selectedColor === color;
      
      if (isMatch) {
        return { ...item, quantity: Math.max(1, newQuantity) };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity,
      clearCart, 
      cartCount, 
      cartTotal,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};
