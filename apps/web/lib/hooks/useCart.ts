'use client';

import { useState, useEffect } from 'react';

export type CartItemType = 'dish' | 'menu';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  type: CartItemType;
  restaurantId: number;
  restaurantName?: string;
}

export function useCart() {
  // Always initialize cart as an empty array
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on component mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('foodhub-cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Ensure the parsed cart is an array
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        } else {
          console.error('Cart from localStorage is not an array, resetting');
          localStorage.removeItem('foodhub-cart');
          setCart([]);
        }
      }
    } catch (error) {
      console.error('Failed to parse cart from localStorage:', error);
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
    if (quantity <= 0) {
      removeFromCart(id, type);
      return;
    }

    setCart(prevCart => 
      prevCart.map(item => 
        item.id === id && item.type === type
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Get cart total
  const getCartTotal = () => {
    return Array.isArray(cart) ? cart.reduce((total, item) => total + (item.price * item.quantity), 0) : 0;
  };

  // Get cart item count
  const getCartItemCount = () => {
    return Array.isArray(cart) ? cart.reduce((count, item) => count + item.quantity, 0) : 0;
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    isLoaded
  };
}
