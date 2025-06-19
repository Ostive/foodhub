"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define the shape of a cart item
export interface CartItem {
  id: string;
  quantity: number;
}

// Define the shape of the cart context
interface CartContextType {
  cartItems: Record<string, number>;
  addToCart: (itemId: string) => void;
  removeFromCart: (itemId: string) => void;
  getItemQuantity: (itemId: string) => number;
  getTotalItems: () => number;
  getCartTotal: (menuItems: any[]) => string;
  clearCart: () => void;
}

// Create the context with default values
const CartContext = createContext<CartContextType>({
  cartItems: {},
  addToCart: () => {},
  removeFromCart: () => {},
  getItemQuantity: () => 0,
  getTotalItems: () => 0,
  getCartTotal: () => "$0.00",
  clearCart: () => {},
});

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);

// Cart provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Initialize cart from localStorage if available
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [lastAddedItem, setLastAddedItem] = useState<string | null>(null);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('foodhub-cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('foodhub-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (itemId: string) => {
    setCartItems(prev => {
      const newItems = { ...prev };
      if (newItems[itemId]) {
        newItems[itemId] += 1;
      } else {
        newItems[itemId] = 1;
      }
      return newItems;
    });
    
    // Set the last added item for visual feedback
    setLastAddedItem(itemId);
    
    // Dispatch an event that an item was added to the cart
    // This allows components to react to cart changes
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('itemAddedToCart', { 
        detail: { itemId } 
      }));
    }
    
    // Clear the visual feedback after 2 seconds
    setTimeout(() => {
      setLastAddedItem(null);
    }, 2000);
  };

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    setCartItems(prev => {
      const newItems = { ...prev };
      if (newItems[itemId] && newItems[itemId] > 1) {
        newItems[itemId] -= 1;
      } else {
        delete newItems[itemId];
      }
      return newItems;
    });
  };

  // Get quantity of a specific item in cart
  const getItemQuantity = (itemId: string): number => {
    return cartItems[itemId] || 0;
  };

  // Get total number of items in cart
  const getTotalItems = (): number => {
    return Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);
  };

  // Calculate total price of items in cart
  const getCartTotal = (menuItems: any[]): string => {
    let total = 0;
    
    Object.entries(cartItems).forEach(([itemId, quantity]) => {
      // Find the item in the menu items
      const item = menuItems.find(item => item.id === itemId);
      if (item) {
        const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
        total += price * quantity;
      }
    });
    
    return `$${total.toFixed(2)}`;
  };

  // Clear the entire cart
  const clearCart = () => {
    setCartItems({});
  };

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        getItemQuantity, 
        getTotalItems, 
        getCartTotal,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
