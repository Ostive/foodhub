"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface CartTotalDisplayProps {
  menuItems: any[];
  restaurantId: string;
}

export default function CartTotalDisplay({ menuItems, restaurantId }: CartTotalDisplayProps) {
  const { cartItems, getTotalItems } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  
  const cartItemCount = getTotalItems();
  
  // Calculate cart total
  const calculateCartTotal = (): string => {
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
