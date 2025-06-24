"use client";

import Image from "next/image";
import { Bike, Clock, Heart, Star, MapPin, Store } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
// Define a more flexible restaurant type for the card component
interface RestaurantCardType {
  userId?: number | string;
  name?: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  rating?: number;
  cuisineType?: string[];
  priceRange?: string;
  averagePreparationTime?: string;
  [key: string]: any; // Allow for other properties
}

interface RestaurantCardApiProps {
  restaurant: RestaurantCardType;
}

export default function RestaurantCardApi({ restaurant }: RestaurantCardApiProps) {
  const [liked, setLiked] = useState(false);
  const restaurantId = restaurant.userId;
  
  // Default image if none is provided
  const restaurantImage = restaurant.profilePicture || "/images/restaurant-placeholder.jpg";
  
  // Default rating if none is provided
  const rating = restaurant.rating || 4.0;
  
  return (
    <Link href={`/customer/restaurant/${restaurantId}`} className="block">
      <div className="flex flex-col group cursor-pointer">
        {/* Image container with like button and rating */}
        <div className="relative h-48 mb-2">
          <div className="rounded-xl overflow-hidden h-full w-full shadow-md">
            <Image 
              src={restaurantImage}
              alt={restaurant.name || restaurant.firstName || 'Restaurant'}
              width={400}
              height={300}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                // Fallback if image fails to load
                const target = e.target as HTMLImageElement;
                target.src = "/images/restaurant-placeholder.jpg";
              }}
            />
          </div>
          
          {/* Like button */}
          <button 
            className={`absolute top-3 right-3 z-20 p-2 rounded-full shadow-md transition-colors ${liked ? 'bg-[#D55E00]/90 text-white' : 'bg-white/90 text-gray-700 hover:text-[#D55E00]'}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setLiked(!liked);
            }}
          >
            <Heart size={18} className={liked ? 'fill-current' : ''} />
          </button>
          
          {/* Rating badge */}
          <div className="absolute bottom-3 left-3 z-20 bg-white/90 backdrop-blur-xs rounded-full px-2 py-1 shadow-md flex items-center">
            <Star size={14} className="mr-1 text-[#D55E00] fill-[#D55E00]" />
            <span className="text-xs font-medium text-gray-800">{rating.toFixed(1)}</span>
          </div>
        </div>
        
        {/* Content below image */}
        <div className="px-1 py-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{restaurant.name || restaurant.firstName || 'Restaurant'}</h3>
          
          {restaurant.cuisineType && (
            <p className="text-sm text-gray-500 mb-2">{restaurant.cuisineType}</p>
          )}
          
          {restaurant.priceRange && (
            <div className="flex items-center text-sm font-medium text-gray-900 mb-2">
              <span>{restaurant.priceRange}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-500">
              <Clock size={14} className="mr-1" />
              <span>{restaurant.averagePreparationTime || '25-35'} min</span>
            </div>
            <div className="flex items-center text-sm font-medium text-gray-900">
              <Bike size={14} className="mr-1 text-[#009E73]" />
              <span>5€</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
