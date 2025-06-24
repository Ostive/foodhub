"use client";

import { useState } from "react";
import CustomerNavbar from "../../_components/CustomerNavbar";
import Link from "next/link";
import { ArrowLeft, Filter, TrendingUp } from "lucide-react";
import { Restaurant } from "@/lib/api/restaurants-api";
import RestaurantCardApi from "../../_components/RestaurantCardApi";

interface PopularRestaurantsClientProps {
  initialRestaurants: Restaurant[];
  error: string | null;
}

export default function PopularRestaurantsClient({ initialRestaurants, error }: PopularRestaurantsClientProps) {
  const [sortBy, setSortBy] = useState<'rating' | 'popularity'>('popularity');
  
  // Sort restaurants based on selected criteria
  const sortedRestaurants = [...initialRestaurants].sort((a, b) => {
    if (sortBy === 'rating') {
      return (b.rating || 0) - (a.rating || 0);
    } else {
      // Sort by popularity (using reviewCount as a proxy for popularity)
      return (b.reviewCount || 0) - (a.reviewCount || 0);
    }
  });

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
              <TrendingUp className="h-7 w-7 text-[#009E73] mr-2" />
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
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            Error loading restaurants: {error}
          </div>
        )}
        
        {/* Restaurant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedRestaurants.length > 0 ? (
            sortedRestaurants.map((restaurant) => (
              <RestaurantCardApi
                key={restaurant.id}
                restaurant={restaurant}
              />
            ))
          ) : !error ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No popular restaurants found</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
