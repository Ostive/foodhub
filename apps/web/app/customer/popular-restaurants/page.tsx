"use client";

import { useState } from "react";
import CustomerNavbar from "../_components/CustomerNavbar";
import RestaurantCard from "../_components/RestaurantCard";
import Link from "next/link";
import { ArrowLeft, Filter, Star, TrendingUp } from "lucide-react";
import restaurantsData from "../restaurant/restaurantData";
import { Restaurant } from "../restaurant/restaurantData";

export default function PopularRestaurantsPage() {
  const [sortBy, setSortBy] = useState<'rating' | 'popularity'>('popularity');
  
  // Get all restaurants and sort them by rating or popularity (review count)
  const getPopularRestaurants = (): Restaurant[] => {
    const restaurantsArray = Object.values(restaurantsData);
    
    // Sort by selected criteria
    if (sortBy === 'rating') {
      return [...restaurantsArray].sort((a, b) => b.rating - a.rating);
    } else {
      return [...restaurantsArray].sort((a, b) => b.reviewCount - a.reviewCount);
    }
  };
  
  const popularRestaurants = getPopularRestaurants();

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20">
      <CustomerNavbar />
      
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Link href="/customer" className="mr-4">
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </Link>
            <div className="flex items-center">
              <TrendingUp className="h-7 w-7 text-[#4CAF50] mr-2" />
              <h1 className="text-3xl font-bold text-gray-900">Popular Restaurants</h1>
            </div>
          </div>
          
          {/* Sorting options */}
          <div className="flex items-center space-x-2">
            <div className="bg-white rounded-lg shadow-xs p-2 flex items-center">
              <Filter className="h-5 w-5 text-gray-500 mr-2" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'rating' | 'popularity')}
                className="bg-transparent border-none text-gray-700 focus:outline-hidden text-sm font-medium"
              >
                <option value="popularity">Most Popular</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Restaurant grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {popularRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
        
        {/* No results */}
        {popularRestaurants.length === 0 && (
          <div className="text-center py-16">
            <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No restaurants found</h3>
            <p className="text-gray-500">Try changing your filters or check back later</p>
          </div>
        )}
      </div>
    </div>
  );
}
