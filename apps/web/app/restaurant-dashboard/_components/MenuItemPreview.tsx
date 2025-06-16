"use client";

import Image from "next/image";
import { Star, Clock, Tag, AlertCircle } from "lucide-react";

interface MenuItemPreviewProps {
  item: {
    name: string;
    description: string;
    price: number;
    image: string;
    prepTime: string;
    isVegetarian?: boolean;
    isVegan?: boolean;
    isGlutenFree?: boolean;
    isPopular?: boolean;
    allergens?: string[];
  };
  showDetails?: boolean;
}

const MenuItemPreview = ({ item, showDetails = true }: MenuItemPreviewProps) => {
  const {
    name,
    description,
    price,
    image,
    prepTime,
    isVegetarian,
    isVegan,
    isGlutenFree,
    isPopular,
    allergens
  } = item;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="relative">
        {/* Image */}
        <div className="h-48 w-full relative">
          <Image
            src={image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        
        {/* Popular badge */}
        {isPopular && (
          <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <Star className="h-3 w-3 mr-1" />
            Popular
          </div>
        )}
        
        {/* Price badge */}
        <div className="absolute top-3 right-3 bg-white text-gray-900 font-bold px-3 py-1 rounded-full shadow-md">
          ${price.toFixed(2)}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{description}</p>
        
        {showDetails && (
          <div className="mt-3 space-y-2">
            {/* Prep time */}
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              <span>{prepTime} min prep time</span>
            </div>
            
            {/* Dietary info */}
            <div className="flex flex-wrap gap-2">
              {isVegetarian && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Vegetarian
                </span>
              )}
              {isVegan && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Vegan
                </span>
              )}
              {isGlutenFree && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  Gluten Free
                </span>
              )}
            </div>
            
            {/* Allergens */}
            {allergens && allergens.length > 0 && (
              <div className="flex items-start text-xs">
                <AlertCircle className="h-4 w-4 mr-1 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-gray-600">
                  Contains: {allergens.join(", ")}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuItemPreview;
