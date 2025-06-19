"use client";

import Image from "next/image";
import { Dish } from "@/hooks/useRestaurantDishes";
import { Clock, Leaf } from "lucide-react";

interface DishCardProps {
  dish: Dish;
}

export default function DishCard({ dish }: DishCardProps) {
  // Default image if none is provided
  const dishImage = dish.image || "/images/dish-placeholder.jpg";

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48">
        <Image
          src={dishImage}
          alt={dish.name}
          width={400}
          height={300}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback if image fails to load
            const target = e.target as HTMLImageElement;
            target.src = "/images/dish-placeholder.jpg";
          }}
        />
        
        {/* Price badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs rounded-full px-3 py-1 shadow-md">
          <span className="text-sm font-bold text-gray-900">{dish.price.toFixed(2)}€</span>
        </div>
        
        {/* Dietary badges */}
        <div className="absolute bottom-3 left-3 flex space-x-2">
          {dish.isVegetarian && (
            <div className="bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs font-medium flex items-center">
              <Leaf size={12} className="mr-1" />
              Vegetarian
            </div>
          )}
          {dish.isVegan && (
            <div className="bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs font-medium flex items-center">
              <Leaf size={12} className="mr-1" />
              Vegan
            </div>
          )}
          {dish.isGlutenFree && (
            <div className="bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs font-medium">
              GF
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{dish.name}</h3>
        
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{dish.description}</p>
        
        <div className="flex justify-between items-center">
          {dish.category && (
            <span className="text-xs bg-gray-100 text-gray-800 rounded-full px-2 py-1">
              {dish.category}
            </span>
          )}
          
          {dish.preparationTime && (
            <div className="flex items-center text-xs text-gray-500">
              <Clock size={12} className="mr-1" />
              <span>{dish.preparationTime}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
