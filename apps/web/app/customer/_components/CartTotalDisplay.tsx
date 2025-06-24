"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/hooks/useCart';
import type { ExtendedDish } from '@/app/customer/restaurant/[restaurantId]/_components/RestaurantDetailsClient';

interface CartTotalDisplayProps {
  menuItems: ExtendedDish[];
  restaurantId: string;
}

export default function CartTotalDisplay({ menuItems, restaurantId }: CartTotalDisplayProps) {
  const { cart: rawCart, getCartItemCount } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  
  // Ensure cart is always an array
  const cart = Array.isArray(rawCart) ? rawCart : [];
  
  const cartItemCount = getCartItemCount();
  
  // Calculate cart total
  const calculateCartTotal = (): string => {
    let total = 0;
    
    // Safely iterate over cart items
    for (let i = 0; i < cart.length; i++) {
      const cartItem = cart[i];
      if (!cartItem) continue;
      
      // Find the item in the menu items to get the most up-to-date price
      const item = menuItems.find(item => item.dishId === cartItem.id);
      if (item) {
        // Use cost property from the menu item
        total += item.cost * cartItem.quantity;
      } else {
        // Fallback to the price stored in the cart item
        total += cartItem.price * cartItem.quantity;
      }
    }
    
    return `$${total.toFixed(2)}`;
  };
  
  const cartTotal = calculateCartTotal();
  
  // Show the cart total display only if there are items in the cart
  useEffect(() => {
    setIsVisible(cartItemCount > 0);
  }, [cartItemCount]);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-6 left-0 right-0 mx-auto w-full max-w-md px-4 z-50">
      <Link href={`/customer/cart`}>
        <div className="flex items-center justify-between bg-[#4CAF50] text-white py-3 px-5 rounded-xl shadow-lg">
          <div className="flex items-center">
            <ShoppingBag className="w-5 h-5 mr-3" />
            <span className="font-medium">View Cart ({cartItemCount} items)</span>
          </div>
          <div className="font-bold text-lg">{cartTotal}</div>
        </div>
      </Link>
    </div>
  );
}
