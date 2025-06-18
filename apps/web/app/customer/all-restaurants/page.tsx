"use client";

import { useState } from "react";
import CustomerNavbar from "../_components/CustomerNavbar";
import Link from "next/link";
import { ArrowLeft, Filter, Store } from "lucide-react";
import { useRestaurants } from "@/hooks/useRestaurants";
import RestaurantCardApi from "../_components/RestaurantCardApi";

export default function AllRestaurantsPage() {
  const [sortBy, setSortBy] = useState<'name' | 'rating'>('name');
  const { restaurants, loading, error } = useRestaurants();
  
  // Sort restaurants based on selected criteria
  const sortedRestaurants = [...restaurants].sort((a, b) => {
    if (sortBy === 'rating') {
      return (b.rating || 0) - (a.rating || 0);
    } else {
      return a.firstName.localeCompare(b.firstName);
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
              <Store className="h-7 w-7 text-[#009E73] mr-2" />
              <h1 className="text-3xl font-bold text-gray-900">All Restaurants</h1>
            </div>
          </div>
          
          {/* Sorting options */}
          <div className="flex items-center space-x-2">
            <div className="bg-white rounded-lg shadow-xs p-2 flex items-center">
              <Filter className="h-5 w-5 text-gray-500 mr-2" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'rating')}
                className="bg-transparent border-none text-gray-700 focus:outline-hidden text-sm font-medium"
              >
                <option value="name">Name (A-Z)</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Loading state */}
        {loading && (
          <div className="text-center py-16">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-16 w-16 bg-gray-200 rounded-full mb-4"></div>
              <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className="text-center py-16">
            <Store className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Error loading restaurants</h3>
            <p className="text-gray-500">{error}</p>
          </div>
        )}
        
        {/* Restaurant grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedRestaurants.map((restaurant) => (
              <RestaurantCardApi key={restaurant.userId} restaurant={restaurant} />
            ))}
          </div>
        )}
        
        {/* No results */}
        {!loading && !error && sortedRestaurants.length === 0 && (
          <div className="text-center py-16">
            <Store className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No restaurants found</h3>
            <p className="text-gray-500">Check back later for new restaurants</p>
          </div>
        )}
      </div>
    </div>
  );
}
