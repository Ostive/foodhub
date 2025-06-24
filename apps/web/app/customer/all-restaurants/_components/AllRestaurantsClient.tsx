"use client";

import { useState } from "react";
import CustomerNavbar from "../../_components/CustomerNavbar";
import Link from "next/link";
import { ArrowLeft, Filter, Store } from "lucide-react";
import { Restaurant } from "@/lib/api/restaurants-api";
import RestaurantCardApi from "../../_components/RestaurantCardApi";

// Extended restaurant type to handle both Restaurant interface and API response structure
type ExtendedRestaurant = Restaurant | {
  userId?: number;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  tags?: string[];
  [key: string]: any; // Allow for other properties
};

interface AllRestaurantsClientProps {
  initialRestaurants: ExtendedRestaurant[];
  error: string | null;
}

export default function AllRestaurantsClient({ initialRestaurants, error }: AllRestaurantsClientProps) {
  const [sortBy, setSortBy] = useState<'name' | 'rating'>('name');
  
  // Helper function to get restaurant name regardless of data structure
  const getRestaurantName = (restaurant: ExtendedRestaurant): string => {
    if ('name' in restaurant && restaurant.name) {
      return restaurant.name;
    } else if ('firstName' in restaurant && restaurant.firstName) {
      return restaurant.firstName;
    }
    return '';
  };

  // Sort restaurants based on selected criteria
  const sortedRestaurants = [...initialRestaurants].sort((a, b) => {
    if (sortBy === 'rating') {
      return (b.rating || 0) - (a.rating || 0);
    } else {
      const nameA = getRestaurantName(a);
      const nameB = getRestaurantName(b);
      return nameA.localeCompare(nameB);
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
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            Error loading restaurants: {error}
          </div>
        )}
        
        {/* Restaurant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedRestaurants.length > 0 ? (
            sortedRestaurants.map((restaurant) => {
              // Ensure restaurant has the expected structure for RestaurantCardApi
              const adaptedRestaurant = {
                userId: restaurant.id || restaurant.userId,
                name: 'name' in restaurant ? restaurant.name : undefined,
                firstName: 'firstName' in restaurant ? restaurant.firstName : undefined,
                lastName: 'lastName' in restaurant ? restaurant.lastName : undefined,
                profilePicture: 'profilePicture' in restaurant ? restaurant.profilePicture : undefined,
                rating: restaurant.rating,
                cuisineType: restaurant.cuisineType,
                priceRange: restaurant.priceRange,
                averagePreparationTime: restaurant.averagePreparationTime
              };
              
              return (
                <RestaurantCardApi
                  key={adaptedRestaurant.userId}
                  restaurant={adaptedRestaurant as any}
                />
              );
            })
          ) : !error ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No restaurants found</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
