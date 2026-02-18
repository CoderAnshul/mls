import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
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

  // Cart is now initialized from localStorage in useState

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

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
    // Automatically open cart when item is added
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

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
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
