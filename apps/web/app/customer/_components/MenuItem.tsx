"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Vegan, Flame } from "lucide-react";
import { useRouter } from "next/navigation";
import { MenuItem as MenuItemType } from "../restaurant/restaurantData";

interface MenuItemProps {
  item: MenuItemType;
  restaurantId: string;
  onAddToCart: (item: MenuItemType, quantity: number) => void;
}

export default function MenuItem({ item, restaurantId, onAddToCart }: MenuItemProps) {
  const router = useRouter();
  
  const handleAddToCart = () => {
    // Check if the item has customization options
    if (isCustomizable()) {
      // Navigate to the item detail page for customization
      router.push(`/customer/restaurant/${restaurantId}/item/${item.id}`);
    } else {
      // Add directly to cart if no customization options
      onAddToCart(item, 1);
    }
  };
  
  // Function to check if an item is customizable
  const isCustomizable = () => {
    return !!(
      (item.customizationOptions?.sizes && item.customizationOptions.sizes.length > 0) ||
      (item.customizationOptions?.ingredients && item.customizationOptions.ingredients.length > 0) ||
      (item.customizationOptions?.sauces && item.customizationOptions.sauces.length > 0)
    );
  };
  
  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex">
        {/* Item image */}
        <div className="h-24 w-24 rounded-lg overflow-hidden shrink-0">
          <Image 
            src={item.image} 
            alt={item.name} 
            width={96} 
            height={96} 
            className="h-full w-full object-cover"
          />
        </div>
        
        {/* Item details */}
        <div className="ml-4 flex-1">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium text-gray-900">{item.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                {item.vegetarian && (
                  <span className="inline-flex items-center text-green-600 text-xs">
                    <Vegan className="h-3 w-3 mr-1" /> Vegetarian
                  </span>
                )}
                {item.spicy && (
                  <span className="inline-flex items-center text-red-600 text-xs">
                    <Flame className="h-3 w-3 mr-1" /> Spicy
                  </span>
                )}
                {item.popular && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
                    Popular
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className="font-medium text-gray-900">{item.price}</span>
              {isCustomizable() && (
                <div className="text-xs text-gray-500 mt-1">Customizable</div>
              )}
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{item.description}</p>
          
          <div className="mt-3 flex justify-end">
            <button
              onClick={handleAddToCart}
              className="px-3 py-1.5 bg-[#009E73] text-white rounded-lg text-sm font-medium flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}