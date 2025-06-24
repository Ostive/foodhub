"use client";

import { useState } from "react";
import Image from "next/image";
import { Clock, Leaf, ChevronDown, ChevronUp, Info, Flame, Award, Heart } from "lucide-react";
import type { ExtendedDish } from "@/app/customer/restaurant/[restaurantId]/_components/RestaurantDetailsClient";

interface ExtendedDishCardProps {
  dish: ExtendedDish;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  isHighlighted?: boolean;
}

export default function ExtendedDishCard({ dish, quantity, onAdd, onRemove, isHighlighted = false }: ExtendedDishCardProps) {
  // State for expanded description
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Default image if none is provided
  const dishImage = dish.picture || dish.imageUrl || "/images/dish-placeholder.jpg";
  
  // Format date to be more readable
  const formattedDate = new Date(dish.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  // Check if dish has tags
  const hasTags = dish.tags && dish.tags.length > 0;
  
  // Determine if this is a popular dish (for demo purposes, we'll consider dishes with spicy level > 2 as popular)
  const isPopular = dish.spicyLevel && dish.spicyLevel > 2;

  return (
    <div 
      className={`bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 ${
        isHighlighted ? 'ring-2 ring-[#009E73] scale-105 z-10' : 'hover:shadow-lg hover:translate-y-[-4px]'
      }`}
    >
      <div className="relative h-52 overflow-hidden group">
        <Image
          src={dishImage}
          alt={dish.name}
          width={400}
          height={300}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            // Fallback if image fails to load
            const target = e.target as HTMLImageElement;
            target.src = "/images/dish-placeholder.jpg";
          }}
        />
        
        {/* Gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Price badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-md transform transition-transform duration-300 group-hover:scale-110">
          <span className="text-sm font-bold text-gray-900">${dish.cost.toFixed(2)}</span>
        </div>
        
        {/* Badges container */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 max-w-[80%]">
          {/* Vegetarian badge */}
          {dish.isVegetarian && (
            <div className="bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs font-medium flex items-center shadow-sm">
              <Leaf size={12} className="mr-1" />
              Vegetarian
            </div>
          )}
          
          {/* Spicy level badge */}
          {dish.spicyLevel && dish.spicyLevel > 0 && (
            <div className="bg-red-100 text-red-800 rounded-full px-2 py-1 text-xs font-medium flex items-center shadow-sm">
              <Flame size={12} className="mr-1" />
              Spicy {Array(dish.spicyLevel).fill('🌶️').join('')}
            </div>
          )}
          
          {/* Popular badge */}
          {isPopular && (
            <div className="bg-yellow-100 text-yellow-800 rounded-full px-2 py-1 text-xs font-medium flex items-center shadow-sm">
              <Award size={12} className="mr-1" />
              Popular
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-lg text-gray-800 flex-1">{dish.name}</h3>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={isExpanded ? "Show less" : "Show more"}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
        
        <p className={`text-gray-600 text-sm mb-3 ${isExpanded ? '' : 'line-clamp-2'} transition-all duration-300`}>
          {dish.description || 'No description available'}
        </p>
        
        {/* Tags */}
        {hasTags && isExpanded && dish.tags && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {dish.tags.map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center text-xs text-gray-500">
            <Clock size={14} className="mr-1" />
            <span>Added {formattedDate}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {quantity > 0 ? (
              <div className="flex items-center bg-gray-100 rounded-full overflow-hidden">
                <button 
                  onClick={onRemove}
                  className="p-1 hover:bg-gray-200 transition-colors"
                  aria-label="Remove one item"
                >
                  <span className="block w-6 h-6 flex items-center justify-center font-bold text-gray-600">-</span>
                </button>
                <span className="font-medium text-gray-800 w-6 text-center">{quantity}</span>
                <button 
                  onClick={onAdd}
                  className="p-1 hover:bg-gray-200 transition-colors"
                  aria-label="Add one more item"
                >
                  <span className="block w-6 h-6 flex items-center justify-center font-bold text-gray-600">+</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={onAdd}
                className="px-3 py-1.5 rounded-full bg-[#009E73] hover:bg-[#008c68] text-white flex items-center transition-all duration-300 hover:shadow-md"
                aria-label="Add to cart"
              >
                <span className="font-medium text-sm">Add</span>
                <span className="block w-4 h-4 ml-1 flex items-center justify-center font-bold">+</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
