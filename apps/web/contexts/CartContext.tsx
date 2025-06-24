'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem, CartItemType } from '@/lib/hooks/useCart';

// Define the shape of our context
type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number, type: CartItemType) => void;
  updateQuantity: (id: number, type: CartItemType, quantity: number) => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  isLoaded: boolean;
};

// Create the context
const CartContext = createContext<CartContextType | null>(null);

// Provider component
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('foodhub-cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        } else {
          // Reset cart if it's not an array
          setCart([]);
        }
      }
    } catch (error) {
      // Reset cart if parsing fails
      localStorage.removeItem('foodhub-cart');
      setCart([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('foodhub-cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  // Add item to cart
  const addToCart = (item: CartItem) => {
    // Force quantity to be exactly 1 for all operations
    const normalizedItem = { ...item, quantity: 1 };
    
    setCart(prevCart => {
      if (!Array.isArray(prevCart)) return [normalizedItem];
      
      // Check if item already exists in cart
      const existingItemIndex = prevCart.findIndex(
        cartItem => cartItem.id === normalizedItem.id && cartItem.type === normalizedItem.type
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedCart = [...prevCart];
        // Only add 1 to quantity
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      } else {
        // Add new item if it doesn't exist
        return [...prevCart, normalizedItem];
      }
    });
  };

  // Remove item from cart (decrements quantity by 1, or removes if quantity becomes 0)
  const removeFromCart = (id: number, type: CartItemType) => {
    setCart(prevCart => {
      if (!Array.isArray(prevCart)) return [];
      
      // Find the item
      const existingItemIndex = prevCart.findIndex(
        cartItem => cartItem.id === id && cartItem.type === type
      );
      
      // If item not found, return unchanged cart
      if (existingItemIndex === -1) return prevCart;
      
      const updatedCart = [...prevCart];
      // Decrement quantity
      if (updatedCart[existingItemIndex].quantity > 1) {
        updatedCart[existingItemIndex].quantity -= 1;
        return updatedCart;
      } else {
        // Remove item if quantity becomes 0
        return updatedCart.filter((_, index) => index !== existingItemIndex);
      }
    });
  };

  // Update item quantity
  const updateQuantity = (id: number, type: CartItemType, quantity: number) => {
    setCart(prevCart => {
      if (!Array.isArray(prevCart)) return [];
      
      return prevCart.map(item => {
        if (item.id === id && item.type === type) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  // Calculate cart total
  const getCartTotal = () => {
    if (!Array.isArray(cart)) return 0;
    
    return cart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  // Get cart item count
  const getCartItemCount = () => {
    if (!Array.isArray(cart)) return 0;
    
    return cart.reduce((count, item) => {
      return count + item.quantity;
    }, 0);
  };

  // Context value
  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartItemCount,
    isLoaded
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}