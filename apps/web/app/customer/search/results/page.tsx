"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import CustomerNavbar from "../../_components/CustomerNavbar";
import RestaurantCard from "../../_components/RestaurantCard";
import restaurantsData from "../../restaurant/restaurantData";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Search, Filter, X, MapPin, Star, Clock, ChevronDown } from "lucide-react";

type SearchResult = {
  id: string;
  name: string;
  image: string;
  rating?: number;
  distance?: string;
  deliveryTime?: string;
  deliveryFee?: string;
  cuisine?: string;
  description?: string;
};

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const isCategory = searchParams.get("category") === "true";
  
  const [searchQuery, setSearchQuery] = useState(query);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [sortOption, setSortOption] = useState<"relevance" | "rating" | "delivery_time" | "distance">("relevance");
  const [isSearchingByCategory, setIsSearchingByCategory] = useState(isCategory);
  
  // Perform search when query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }
    
    performSearch(searchQuery);
  }, [searchQuery, sortOption, isSearchingByCategory]);
  
  // Update search query when URL parameter changes
  useEffect(() => {
    setSearchQuery(query);
    setIsSearchingByCategory(isCategory);
  }, [query, isCategory]);
  
  const performSearch = (query: string) => {
    const results: SearchResult[] = [];
    const lowerCaseQuery = query.toLowerCase();
    
    // Search through restaurants
    for (const id in restaurantsData) {
      const restaurant = restaurantsData[id];
      if (!restaurant) continue;
      
      // If searching by category, only match cuisine exactly
      if (isSearchingByCategory) {
        if (restaurant.cuisine.toLowerCase() === lowerCaseQuery) {
          results.push({
            id: restaurant.id,
            name: restaurant.name,
            image: restaurant.image,
            rating: restaurant.rating,
            distance: restaurant.distance,
            deliveryTime: restaurant.deliveryTime,
            deliveryFee: restaurant.deliveryFee,
            cuisine: restaurant.cuisine,
            description: restaurant.description
          });
        }
      } else {
        // Regular search - match name, cuisine, or description
        if (
          restaurant.name.toLowerCase().includes(lowerCaseQuery) ||
          restaurant.cuisine.toLowerCase().includes(lowerCaseQuery) ||
          restaurant.description.toLowerCase().includes(lowerCaseQuery)
        ) {
          results.push({
            id: restaurant.id,
            name: restaurant.name,
            image: restaurant.image,
            rating: restaurant.rating,
            distance: restaurant.distance,
            deliveryTime: restaurant.deliveryTime,
            deliveryFee: restaurant.deliveryFee,
            cuisine: restaurant.cuisine,
            description: restaurant.description
          });
        }
      }
    }
    
    // Sort results
    let sortedResults = [...results];
    switch (sortOption) {
      case "rating":
        sortedResults = sortedResults.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "delivery_time":
        sortedResults = sortedResults.sort((a, b) => {
          if (!a.deliveryTime || !b.deliveryTime) return 0;
          const aTime = parseInt(a.deliveryTime?.split('-')[0] || '0');
          const bTime = parseInt(b.deliveryTime?.split('-')[0] || '0');
          return aTime - bTime;
        });
        break;
      case "distance":
        sortedResults = sortedResults.sort((a, b) => {
          if (!a.distance || !b.distance) return 0;
          const aDistance = parseFloat(a.distance?.replace(' mi', '') || '0');
          const bDistance = parseFloat(b.distance?.replace(' mi', '') || '0');
          return aDistance - bDistance;
        });
        break;
      default:
        // relevance - no additional sorting needed
        break;
    }
    
    setSearchResults(sortedResults);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update the URL without refreshing the page
    window.history.pushState({}, '', `/customer/search/results?q=${encodeURIComponent(searchQuery)}`);
  };
  
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    window.history.pushState({}, '', `/customer/search/results`);
  };
  
  return (
    <div className="bg-[#f8f9fa] min-h-svh">
      <CustomerNavbar />
      <main className="pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Search header */}
          <div className="flex items-center mb-6">
            <Link href="/customer" className="mr-4">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{isSearchingByCategory ? `${searchQuery} Restaurants` : 'Search Results'}</h1>
              <p className="text-gray-600">
                {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} {isSearchingByCategory ? `in ${searchQuery} cuisine` : `for "${searchQuery}"`}
              </p>
            </div>
          </div>
          
          {/* Search form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for restaurants, dishes, or cuisines"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#009E73] focus:border-transparent"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              )}
            </div>
          </form>
          
          {/* Filter and sort options */}
          {searchResults.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <div className="ml-auto">
                <div className="relative inline-block text-left">
                  <div>
                    <button
                      type="button"
                      className="inline-flex justify-center w-full rounded-full border border-gray-300 shadow-xs px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-[#009E73]"
                      id="sort-menu-button"
                      aria-expanded="true"
                      aria-haspopup="true"
                      onClick={() => document.getElementById('sort-dropdown')?.classList.toggle('hidden')}
                    >
                      Sort by: {sortOption.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      <ChevronDown className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                  <div
                    id="sort-dropdown"
                    className="hidden origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-hidden z-10"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="sort-menu-button"
                    tabIndex={-1}
                  >
                    <div className="py-1" role="none">
                      <button
                        onClick={() => {
                          setSortOption("relevance");
                          document.getElementById('sort-dropdown')?.classList.add('hidden');
                        }}
                        className={`block px-4 py-2 text-sm w-full text-left ${sortOption === 'relevance' ? 'text-[#009E73] font-medium' : 'text-gray-700'}`}
                        role="menuitem"
                        tabIndex={-1}
                      >
                        Relevance
                      </button>
                      <button
                        onClick={() => {
                          setSortOption("rating");
                          document.getElementById('sort-dropdown')?.classList.add('hidden');
                        }}
                        className={`block px-4 py-2 text-sm w-full text-left ${sortOption === 'rating' ? 'text-[#009E73] font-medium' : 'text-gray-700'}`}
                        role="menuitem"
                        tabIndex={-1}
                      >
                        Rating
                      </button>
                      <button
                        onClick={() => {
                          setSortOption("delivery_time");
                          document.getElementById('sort-dropdown')?.classList.add('hidden');
                        }}
                        className={`block px-4 py-2 text-sm w-full text-left ${sortOption === 'delivery_time' ? 'text-[#009E73] font-medium' : 'text-gray-700'}`}
                        role="menuitem"
                        tabIndex={-1}
                      >
                        Delivery Time
                      </button>
                      <button
                        onClick={() => {
                          setSortOption("distance");
                          document.getElementById('sort-dropdown')?.classList.add('hidden');
                        }}
                        className={`block px-4 py-2 text-sm w-full text-left ${sortOption === 'distance' ? 'text-[#009E73] font-medium' : 'text-gray-700'}`}
                        role="menuitem"
                        tabIndex={-1}
                      >
                        Distance
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Search results */}
          {searchResults.length > 0 ? (
            <div>
              <p className="text-gray-600 mb-4">{searchResults.length} results for "{searchQuery}"</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {searchResults.map((result) => {
                  return (
                    <div key={result.id}>
                      <RestaurantCard restaurant={{
                        id: result.id,
                        name: result.name,
                        image: result.image,
                        rating: result.rating || 0,
                        cuisine: result.cuisine || "",
                        delivery: result.deliveryTime || "",
                        deliveryFee: result.deliveryFee || "",
                        distance: result.distance || "",
                        reviewCount: 0,
                        description: result.description || ""
                      }} />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : searchQuery ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No results found for "{searchQuery}"</p>
              <p className="text-gray-400 mt-2">Try a different search term or browse categories</p>
              <Link href="/customer/search" className="mt-6 inline-block px-6 py-3 bg-[#009E73] text-white rounded-full font-medium">
                Browse Categories
              </Link>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Enter a search term to find restaurants, dishes, or cuisines</p>
              <Link href="/customer/search" className="mt-6 inline-block px-6 py-3 bg-[#009E73] text-white rounded-full font-medium">
                Browse Categories
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
