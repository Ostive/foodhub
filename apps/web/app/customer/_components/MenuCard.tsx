"use client";

import { useState } from "react";
import Image from "next/image";
import { Clock, ChevronDown, ChevronUp, Plus, Star, Utensils } from "lucide-react";
import { ExtendedMenu } from "../restaurant/[restaurantId]/_components/RestaurantDetailsClient";

interface MenuCardProps {
  menu: ExtendedMenu;
  onViewDishes: () => void;
  onAddToCart?: () => void;
}

export default function MenuCard({ menu, onViewDishes, onAddToCart }: MenuCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  
  // Toggle expanded state for description
  const toggleExpanded = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Handle add to cart with animation
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart();
      setIsHighlighted(true);
      setTimeout(() => setIsHighlighted(false), 1500);
    }
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 ${
        isHighlighted ? 'shadow-lg border border-[#009E73] bg-green-50' : 'hover:shadow-md hover:border-gray-300'
      }`}
    >
      <div className="flex flex-col">
        {/* Menu header with image if available */}
        {menu.picture && (
          <div className="relative h-40 w-full">
            <Image
              src={menu.picture}
              alt={menu.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-3 left-4 text-white">
              <h2 className="text-xl font-bold">{menu.name}</h2>
              <div className="flex items-center mt-1">
                <span className="font-medium text-white bg-[#009E73]/80 px-2 py-0.5 rounded-full text-sm">
                  ${menu.cost.toFixed(2)}
                </span>
                {menu.dishes && (
                  <span className="ml-2 text-xs bg-white/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
                    {menu.dishes.length} items
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Menu content */}
        <div className="p-4">
          {/* Only show name and price here if there's no image */}
          {!menu.picture && (
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-xl font-bold text-gray-800">{menu.name}</h2>
              <span className="font-medium text-[#009E73] bg-green-50 px-2 py-0.5 rounded-full">
                ${menu.cost.toFixed(2)}
              </span>
            </div>
          )}
          
          {/* Description with expand/collapse */}
          {menu.description && (
            <div className="mt-2">
              <p className={`text-sm text-gray-600 ${isExpanded ? '' : 'line-clamp-2'}`}>
                {menu.description}
              </p>
              {menu.description.length > 100 && (
                <button 
                  onClick={toggleExpanded}
                  className="text-xs text-gray-500 flex items-center mt-1 hover:text-gray-700"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" /> Show less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" /> Show more
                    </>
                  )}
                </button>
              )}
            </div>
          )}
          
          {/* Menu details */}
          <div className="mt-4 flex flex-wrap gap-2">
            {menu.isVegetarian && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Vegetarian
              </span>
            )}
            {menu.spicyLevel && menu.spicyLevel > 0 && (
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                Spicy {Array(menu.spicyLevel).fill('🌶️').join('')}
              </span>
            )}
            {menu.tags && menu.tags.length > 0 && menu.tags.map((tag, index) => (
              <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          
          {/* Dishes preview if available */}
          {menu.dishes && menu.dishes.length > 0 && isExpanded && (
            <div className="mt-4 border-t border-gray-100 pt-3">
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Utensils className="h-3 w-3 mr-1" /> Included Dishes
              </h3>
              <ul className="text-sm text-gray-600 space-y-1 ml-5 list-disc">
                {menu.dishes.slice(0, 3).map(dish => (
                  <li key={dish.dishId}>{dish.name}</li>
                ))}
                {menu.dishes.length > 3 && (
                  <li className="text-gray-500">
                    +{menu.dishes.length - 3} more dishes
                  </li>
                )}
              </ul>
            </div>
          )}
          
          {/* Footer with date and actions */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              <span>Added {formatDate(menu.createdAt)}</span>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={onViewDishes}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-medium flex items-center transition-colors"
              >
                View Dishes
              </button>
              
              {onAddToCart && (
                <button
                  onClick={handleAddToCart}
                  className="px-3 py-1.5 bg-[#009E73] text-white rounded-lg text-sm font-medium flex items-center hover:bg-[#008c65] transition-colors shadow-sm hover:shadow"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add All
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
