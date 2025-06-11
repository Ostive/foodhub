"use client";

import Image from "next/image";
import { Heart, Star, Clock, Bike } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface RestaurantCardProps {
  restaurant: {
    id?: string;
    name: string;
    image: string;
    rating: number;
    cuisine: string;
    delivery: string;
    deliveryFee: string;
    distance: string;
    featured?: boolean;
    reviewCount: number;
    description: string;
  };
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const [liked, setLiked] = useState(false);
  const restaurantId = restaurant.id || restaurant.name.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <Link href={`/customer/restaurant/${restaurantId}`} className="block">
      <div className="flex flex-col group cursor-pointer">
        {/* Image container with like button and rating */}
        <div className="relative h-48 mb-2">
          <div className="rounded-xl overflow-hidden h-full w-full shadow-md">
            <Image 
              src={restaurant.image} 
              alt={restaurant.name} 
              width={400} 
              height={300} 
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
            />
          </div>
          
          {/* Like button */}
          <button 
            className={`absolute top-3 right-3 z-20 p-2 rounded-full shadow-md transition-colors ${liked ? 'bg-[#FF9800]/90 text-white' : 'bg-white/90 text-gray-700 hover:text-[#FF9800]'}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setLiked(!liked);
            }}
          >
            <Heart size={18} className={liked ? 'fill-current' : ''} />
          </button>
          
          {/* Rating badge */}
          <div className="absolute bottom-3 left-3 z-20 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-md flex items-center">
            <Star size={14} className="mr-1 text-[#FF9800] fill-[#FF9800]" />
            <span className="text-xs font-medium text-gray-800">{restaurant.rating}</span>
            <span className="text-xs text-gray-500 ml-1">({restaurant.reviewCount})</span>
          </div>
        </div>
        
        {/* Content below image */}
        <div className="px-1 py-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{restaurant.name}</h3>
          
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center text-sm text-gray-500">
              <Clock size={14} className="mr-1" />
              <span>{restaurant.delivery}</span>
            </div>
            <div className="flex items-center text-sm font-medium text-gray-900">
              <Bike size={14} className="mr-1 text-[#4CAF50]" />
              <span>{restaurant.deliveryFee}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
