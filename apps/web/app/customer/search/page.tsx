"use client";

import { useState, useEffect } from "react";
import CustomerNavbar from "../_components/CustomerNavbar";
import RestaurantCard from "../_components/RestaurantCard";
import restaurantsData from "../restaurant/restaurantData";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Search, Filter, X, MapPin, Star, Clock, ChevronDown } from "lucide-react";

type SearchResult = {
  id: string;
  type: "restaurant" | "dish" | "cuisine";
  name: string;
  image: string;
  restaurant?: string;
  restaurantId?: string;
  price?: string;
  rating?: number;
  distance?: string;
  deliveryTime?: string;
  deliveryFee?: string;
  cuisine?: string;
  description?: string;
};

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "restaurants" | "dishes" | "cuisines">("all");
  const [sortOption, setSortOption] = useState<"relevance" | "rating" | "delivery_time" | "distance">("relevance");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches] = useState<string[]>(["Pizza", "Burger", "Sushi", "Vegan", "Thai", "Indian", "Italian", "Mexican"]);
  
  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);
  
  // Save recent searches to localStorage when they change
  useEffect(() => {
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  }, [recentSearches]);
  
  // Perform search when query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }
    
    performSearch(searchQuery);
  }, [searchQuery, selectedFilter, sortOption]);
  
  const performSearch = (query: string) => {
    const results: SearchResult[] = [];
    const lowerCaseQuery = query.toLowerCase();
    
    // Search through restaurants
    if (selectedFilter === "all" || selectedFilter === "restaurants") {
      for (const id in restaurantsData) {
        const restaurant = restaurantsData[id];
        if (!restaurant) continue;
        
        if (
          restaurant.name.toLowerCase().includes(lowerCaseQuery) ||
          restaurant.cuisine.toLowerCase().includes(lowerCaseQuery) ||
          restaurant.description.toLowerCase().includes(lowerCaseQuery)
        ) {
          results.push({
            id: restaurant.id,
            type: "restaurant",
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
    
    // Search through menu items
    if (selectedFilter === "all" || selectedFilter === "dishes") {
      for (const restaurantId in restaurantsData) {
        const restaurant = restaurantsData[restaurantId];
        if (!restaurant) continue;
        
        restaurant.menuCategories.forEach(category => {
          category.items.forEach(item => {
            if (
              item.name.toLowerCase().includes(lowerCaseQuery) ||
              item.description.toLowerCase().includes(lowerCaseQuery)
            ) {
              results.push({
                id: `${restaurantId}-${item.id}`,
                type: "dish",
                name: item.name,
                image: item.image,
                restaurant: restaurant.name,
                restaurantId: restaurantId,
                price: item.price,
                description: item.description
              });
            }
          });
        });
      }
    }
    
    // Search through cuisines
    if (selectedFilter === "all" || selectedFilter === "cuisines") {
      const cuisines = new Set<string>();
      
      for (const id in restaurantsData) {
        const restaurant = restaurantsData[id];
        if (!restaurant) continue;
        
        if (restaurant.cuisine.toLowerCase().includes(lowerCaseQuery)) {
          cuisines.add(restaurant.cuisine);
        }
      }
      
      cuisines.forEach(cuisine => {
        // Find a restaurant with this cuisine for the image
        for (const id in restaurantsData) {
          const restaurant = restaurantsData[id];
          if (!restaurant) continue;
          
          if (restaurant.cuisine === cuisine) {
            results.push({
              id: cuisine.toLowerCase().replace(/\s+/g, '-'),
              type: "cuisine",
              name: cuisine,
              image: restaurant.image
            });
            break;
          }
        }
      });
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
          const aTime = parseInt(a.deliveryTime.split('-')[0]);
          const bTime = parseInt(b.deliveryTime.split('-')[0]);
          return aTime - bTime;
        });
        break;
      case "distance":
        sortedResults = sortedResults.sort((a, b) => {
          if (!a.distance || !b.distance) return 0;
          const aDistance = parseFloat(a.distance.replace(' mi', ''));
          const bDistance = parseFloat(b.distance.replace(' mi', ''));
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
    if (searchQuery.trim() === "") return;
    
    // Add to recent searches if not already there
    if (!recentSearches.includes(searchQuery)) {
      setRecentSearches(prev => [searchQuery, ...prev.slice(0, 4)]);
    }
  };
  
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };
  
  const handleSearchClick = (term: string) => {
    setSearchQuery(term);
    // Add to recent searches if not already there
    if (!recentSearches.includes(term)) {
      setRecentSearches(prev => [term, ...prev.slice(0, 4)]);
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Search</h1>
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
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
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
              <div className="flex items-center overflow-x-auto hide-scrollbar pb-2">
                <button 
                  onClick={() => setSelectedFilter("all")} 
                  className={`px-4 py-2 rounded-full text-sm font-medium mr-2 whitespace-nowrap ${selectedFilter === "all" ? 'bg-[#4CAF50] text-white' : 'bg-white text-gray-700'}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setSelectedFilter("restaurants")} 
                  className={`px-4 py-2 rounded-full text-sm font-medium mr-2 whitespace-nowrap ${selectedFilter === "restaurants" ? 'bg-[#4CAF50] text-white' : 'bg-white text-gray-700'}`}
                >
                  Restaurants
                </button>
                <button 
                  onClick={() => setSelectedFilter("dishes")} 
                  className={`px-4 py-2 rounded-full text-sm font-medium mr-2 whitespace-nowrap ${selectedFilter === "dishes" ? 'bg-[#4CAF50] text-white' : 'bg-white text-gray-700'}`}
                >
                  Dishes
                </button>
                <button 
                  onClick={() => setSelectedFilter("cuisines")} 
                  className={`px-4 py-2 rounded-full text-sm font-medium mr-2 whitespace-nowrap ${selectedFilter === "cuisines" ? 'bg-[#4CAF50] text-white' : 'bg-white text-gray-700'}`}
                >
                  Cuisines
                </button>
              </div>
              
              <div className="ml-auto">
                <div className="relative inline-block text-left">
                  <div>
                    <button
                      type="button"
                      className="inline-flex justify-center w-full rounded-full border border-gray-300 shadow-xs px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-[#4CAF50]"
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
                        className={`block px-4 py-2 text-sm w-full text-left ${sortOption === 'relevance' ? 'text-[#4CAF50] font-medium' : 'text-gray-700'}`}
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
                        className={`block px-4 py-2 text-sm w-full text-left ${sortOption === 'rating' ? 'text-[#4CAF50] font-medium' : 'text-gray-700'}`}
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
                        className={`block px-4 py-2 text-sm w-full text-left ${sortOption === 'delivery_time' ? 'text-[#4CAF50] font-medium' : 'text-gray-700'}`}
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
                        className={`block px-4 py-2 text-sm w-full text-left ${sortOption === 'distance' ? 'text-[#4CAF50] font-medium' : 'text-gray-700'}`}
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
                  if (result.type === "restaurant") {
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
                  } else if (result.type === "dish") {
                    return (
                      <Link href={`/customer/restaurant/${result.restaurantId}`} key={result.id} className="block">
                        <div className="bg-white rounded-xl shadow-xs overflow-hidden hover:shadow-md transition-shadow">
                          <div className="relative h-48">
                            <Image 
                              src={result.image} 
                              alt={result.name} 
                              fill
                              className="object-cover object-center" 
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{result.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{result.restaurant}</p>
                            <p className="text-[#4CAF50] font-bold">{result.price}</p>
                          </div>
                        </div>
                      </Link>
                    );
                  } else {
                    // Cuisine
                    return (
                      <Link href={`/customer/search?q=${encodeURIComponent(result.name)}`} key={result.id} className="block">
                        <div className="bg-white rounded-xl shadow-xs overflow-hidden hover:shadow-md transition-shadow">
                          <div className="relative h-48">
                            <Image 
                              src={result.image} 
                              alt={result.name} 
                              fill
                              className="object-cover object-center" 
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <h3 className="text-2xl font-bold text-white">{result.name}</h3>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  }
                })}
              </div>
            </div>
          ) : searchQuery ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No results found for "{searchQuery}"</p>
              <p className="text-gray-400 mt-2">Try a different search term or browse categories</p>
            </div>
          ) : (
            <div>
              {/* Recent searches */}
              {recentSearches.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Searches</h2>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearchClick(term)}
                        className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Popular searches */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Popular Searches</h2>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearchClick(term)}
                      className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Popular cuisines */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Popular Cuisines</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {["Italian", "Japanese", "Mexican", "Indian", "Thai", "Chinese", "American", "Mediterranean"].map((cuisine, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearchClick(cuisine)}
                      className="relative h-32 rounded-xl overflow-hidden"
                    >
                      <Image 
                        src={`https://source.unsplash.com/random/400x300/?${cuisine.toLowerCase()},food`} 
                        alt={cuisine}
                        fill
                        className="object-cover object-center" 
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <h3 className="text-xl font-bold text-white">{cuisine}</h3>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
