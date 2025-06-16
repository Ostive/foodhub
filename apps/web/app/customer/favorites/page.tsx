"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CustomerNavbar from "../_components/CustomerNavbar";
import RestaurantCard from "../_components/RestaurantCard";
import Image from "next/image";
import Link from "next/link";
import { Heart, Search, Filter, Trash2 } from "lucide-react";
import { isLoggedIn } from "../_utils/authState";

interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  rating: number;
  delivery: string;
  deliveryFee: string;
  distance: string;
  reviewCount: number;
  description: string;
}

export default function FavoritesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [selectedToRemove, setSelectedToRemove] = useState<string[]>([]);
  
  // Check authentication
  useEffect(() => {
    if (!isLoggedIn.value) {
      router.push("/customer/login");
    }
  }, [router]);
  
  // Mock favorite restaurants data
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<Restaurant[]>([
    {
      id: "restaurant-1",
      name: "Burger Palace",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80",
      cuisine: "American",
      rating: 4.5,
      delivery: "15-25 min",
      deliveryFee: "$1.99",
      distance: "1.2 mi",
      reviewCount: 324,
      description: "Juicy burgers and crispy fries"
    },
    {
      id: "restaurant-3",
      name: "Sushi Express",
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80",
      cuisine: "Japanese",
      rating: 4.7,
      delivery: "20-35 min",
      deliveryFee: "$2.99",
      distance: "2.5 mi",
      reviewCount: 512,
      description: "Fresh sushi and authentic Japanese cuisine"
    },
    {
      id: "taco-fiesta",
      name: "Taco Fiesta",
      image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80",
      cuisine: "Mexican",
      rating: 4.3,
      delivery: "15-30 min",
      deliveryFee: "$1.99",
      distance: "1.8 mi",
      reviewCount: 287,
      description: "Authentic Mexican tacos and burritos"
    },
    {
      id: "pizza-paradise",
      name: "Pizza Paradise",
      image: "https://images.unsplash.com/photo-1594007654729-407eedc4fe24?auto=format&fit=crop&w=1200&q=80",
      cuisine: "Italian",
      rating: 4.6,
      delivery: "20-30 min",
      deliveryFee: "$2.99",
      distance: "2.1 mi",
      reviewCount: 418,
      description: "Delicious pizzas with a variety of toppings"
    }
  ]);
  
  // Get unique cuisines for filter
  const cuisines = Array.from(new Set(favoriteRestaurants.map(r => r.cuisine)));
  
  // Filter restaurants based on search query and selected cuisine
  const filteredRestaurants = favoriteRestaurants.filter(restaurant => {
    // Filter by search query
    if (searchQuery && !restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by cuisine
    if (selectedCuisine && restaurant.cuisine !== selectedCuisine) {
      return false;
    }
    
    return true;
  });
  
  const toggleRemoveMode = () => {
    setIsRemoving(!isRemoving);
    setSelectedToRemove([]);
  };
  
  const toggleRestaurantSelection = (id: string) => {
    if (selectedToRemove.includes(id)) {
      setSelectedToRemove(selectedToRemove.filter(restId => restId !== id));
    } else {
      setSelectedToRemove([...selectedToRemove, id]);
    }
  };
  
  const removeSelectedRestaurants = () => {
    setFavoriteRestaurants(favoriteRestaurants.filter(restaurant => !selectedToRemove.includes(restaurant.id)));
    setSelectedToRemove([]);
    setIsRemoving(false);
  };
  
  return (
    <div className="bg-[#f8f9fa] min-h-svh">
      <CustomerNavbar forceLight={true} />
      <main className="pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Saved Restaurants</h1>
            <button 
              onClick={toggleRemoveMode}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${isRemoving ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {isRemoving ? (
                <>
                  <X className="h-4 w-4 mr-1" /> Cancel
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-1" /> Edit
                </>
              )}
            </button>
          </div>
          
          {/* Search and Filter */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search saved restaurants"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <select
                value={selectedCuisine || ''}
                onChange={(e) => setSelectedCuisine(e.target.value || null)}
                className="appearance-none w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent bg-white pr-10"
              >
                <option value="">All Cuisines</option>
                {cuisines.map(cuisine => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          
          {/* Remove Selected Button */}
          {isRemoving && selectedToRemove.length > 0 && (
            <div className="mb-4 flex justify-end">
              <button 
                onClick={removeSelectedRestaurants}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-1" /> Remove Selected ({selectedToRemove.length})
              </button>
            </div>
          )}
          
          {/* Restaurants Grid */}
          {filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredRestaurants.map((restaurant) => (
                <div key={restaurant.id} className="relative">
                  {isRemoving && (
                    <div 
                      onClick={() => toggleRestaurantSelection(restaurant.id)}
                      className={`absolute top-2 right-2 z-10 h-6 w-6 rounded-full border-2 flex items-center justify-center cursor-pointer ${selectedToRemove.includes(restaurant.id) ? 'bg-[#4CAF50] border-[#4CAF50]' : 'bg-white/80 border-gray-300'}`}
                    >
                      {selectedToRemove.includes(restaurant.id) && (
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  )}
                  <RestaurantCard restaurant={restaurant} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 text-gray-400">
                <Heart className="h-full w-full" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No saved restaurants</h3>
              <p className="mt-1 text-gray-500">
                {searchQuery || selectedCuisine ? 
                  "Try a different search term or filter" : 
                  "You haven't saved any restaurants yet"}
              </p>
              <Link href="/customer" className="mt-6 inline-block px-6 py-3 bg-[#4CAF50] text-white rounded-full font-medium">
                Browse Restaurants
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
