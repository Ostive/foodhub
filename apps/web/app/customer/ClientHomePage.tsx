"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Filter, ChevronDown, Star, Clock, Percent, Heart, ShoppingBag, ArrowRight, TrendingUp, Award, Bookmark, Users, ChevronLeft, ChevronRight, Store } from "lucide-react";
import CustomerNavbar from "./_components/CustomerNavbar";
import OverlayCard from "./_components/OverlayCard";
import RestaurantCard from "./_components/RestaurantCard";
import RestaurantCardApi from "./_components/RestaurantCardApi";
import SpecialOfferCard from "./_components/SpecialOfferCard";
import AddressSelectionModal from "./_components/AddressSelectionModal";
import Image from "next/image";
import Link from "next/link";
import { Restaurant } from "@/lib/api/restaurants-api";

// Categories data
const categories = [
  { name: "Pizza", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?auto=format&fit=crop&w=400&q=80" },
  { name: "Sushi", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?auto=format&fit=crop&w=400&q=80" },
  { name: "Burgers", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80" },
  { name: "Vegan", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80" },
  { name: "Desserts", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80" },
  { name: "Salads", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?auto=format&fit=crop&w=400&q=80" },
  { name: "Healthy", image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=400&q=80" },
  { name: "Indian", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80" },
  { name: "Chinese", image: "https://images.unsplash.com/photo-1523905330026-b8bd1f5f320e?auto=format&fit=crop&w=400&q=80" },
  { name: "Italian", image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=400&q=80" },
  { name: "Mexican", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=400&q=80" },
  { name: "Thai", image: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?auto=format&fit=crop&w=400&q=80" },
  { name: "Breakfast", image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?auto=format&fit=crop&w=400&q=80" },
  { name: "Coffee", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80" },
  { name: "Seafood", image: "https://images.unsplash.com/photo-1618055301293-494ab4c71f9f?q=80&w=2667&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?auto=format&fit=crop&w=400&q=80" },
];

// Order Again restaurants (static data for now)
const orderAgainRestaurants = [
  { 
    id: "healthy-bites",
    name: "Healthy Bites", 
    image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=600&q=80", 
    rating: 4.5, 
    cuisine: "Healthy", 
    delivery: "15-25 min",
    deliveryFee: "$1.99",
    distance: "0.7 mi",
    featured: false,
    reviewCount: 156,
    description: "Fresh, healthy meals with organic ingredients"
  },
  { 
    id: "thai-delight",
    name: "Thai Delight", 
    image: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?auto=format&fit=crop&w=600&q=80", 
    rating: 4.7, 
    cuisine: "Thai", 
    delivery: "25-35 min",
    deliveryFee: "$2.49",
    distance: "1.8 mi",
    featured: true,
    reviewCount: 203,
    description: "Authentic Thai cuisine with bold flavors"
  }
];

// Extended restaurant type to handle both Restaurant interface and API response structure
type ExtendedRestaurant = Restaurant | {
  userId?: number | string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  tags?: string[];
  [key: string]: any; // Allow for other properties
};

// Interface for the client component props
interface ClientHomePageProps {
  allRestaurants: ExtendedRestaurant[];
  popularRestaurants: ExtendedRestaurant[];
  restaurantsByCuisine: Record<string, ExtendedRestaurant[]>;
}

export default function ClientHomePage({ 
  allRestaurants,
  popularRestaurants, 
  restaurantsByCuisine 
}: ClientHomePageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [deliveryCoordinates, setDeliveryCoordinates] = useState<[number, number] | undefined>(undefined);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const router = useRouter();

  // Scroll state for categories
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Handle scroll buttons for categories
  const handleScroll = (direction: 'left' | 'right') => {
    if (!categoriesRef.current) return;
    
    const container = categoriesRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Update scroll buttons visibility
  useEffect(() => {
    const checkScroll = () => {
      if (!categoriesRef.current) return;
      
      const container = categoriesRef.current;
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
    };
    
    const container = categoriesRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      // Initial check
      checkScroll();
      
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/customer/search/results?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  // Handle address selection from the modal
  const handleAddressSelect = (address: string, coordinates?: [number, number]) => {
    setDeliveryAddress(address);
    setDeliveryCoordinates(coordinates);
    setIsAddressModalOpen(false);
  };

  // Format restaurant data for display
  const formatRestaurantForDisplay = (restaurant: Restaurant | any) => {
    // Ensure we have a valid ID - use userId, id, or generate a fallback ID
    const restaurantId = restaurant.id || restaurant.userId || `restaurant-${Math.floor(Math.random() * 10000)}`;
    
    return {
      id: restaurantId.toString(), // Ensure ID is always a string and defined
      name: restaurant.name || restaurant.firstName || 'Restaurant', // Use firstName if name is not available
      image: restaurant.profilePicture || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
      rating: restaurant.rating || 4.5,
      cuisine: restaurant.cuisineType?.[0] || restaurant.tags?.[0] || "Various",
      delivery: restaurant.averagePreparationTime || "20-30 min",
      deliveryFee: "€5.00", // Static delivery price of 5 euros
      distance: "1.2 mi",
      featured: restaurant.rating ? restaurant.rating > 4.7 : false,
      reviewCount: Math.floor(Math.random() * 300) + 50,
      description: restaurant.description || `Delicious food from ${restaurant.name || restaurant.firstName || 'this restaurant'}`
    };
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <CustomerNavbar />
      
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[400px] bg-gradient-to-r from-[#FF5F6D] to-[#FFC371]">
        {/* Hero Content */}
        <div className="container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Delicious food delivered to your door
          </h1>
          <p className="text-white text-lg md:text-xl mb-6 max-w-2xl">
            Order from your favorite restaurants and track your order in real-time
          </p>
          
          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-lg p-2 flex items-center max-w-2xl">
            <div className="flex items-center flex-grow border-r border-gray-200 pr-2">
              <MapPin className="text-red-500 mr-2" size={20} />
              <button 
                onClick={() => setIsAddressModalOpen(true)}
                className="text-gray-700 flex-grow text-left truncate"
              >
                {deliveryAddress || "Enter delivery address"}
              </button>
            </div>
            <form onSubmit={handleSearch} className="flex flex-grow ml-2">
              <div className="flex items-center flex-grow">
                <Search className="text-gray-400 mr-2" size={20} />
                <input
                  type="text"
                  placeholder="Search for food or restaurants"
                  className="outline-none flex-grow"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                className="bg-red-500 text-white px-4 py-2 rounded-lg ml-2 hidden md:block"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Categories Section */}
      <div className="container mx-auto px-4 py-8 relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Categories</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => handleScroll('left')}
              className={`p-2 rounded-full ${canScrollLeft ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-400'}`}
              disabled={!canScrollLeft}
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => handleScroll('right')}
              className={`p-2 rounded-full ${canScrollRight ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-400'}`}
              disabled={!canScrollRight}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        <div 
          ref={categoriesRef}
          className="flex overflow-x-auto scrollbar-hide space-x-4 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category, index) => (
            <div key={index} className="flex-shrink-0">
              <div 
                onClick={() => router.push(`/customer/search/results?category=${category.name}`)}
                className="w-32 h-32 md:w-40 md:h-40 cursor-pointer"
              >
                <OverlayCard
                  image={category.image}
                  title={category.name}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Popular Restaurants Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Popular Restaurants</h2>
          <Link href="/customer/popular-restaurants" className="text-red-500 flex items-center">
            View all <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularRestaurants.map((restaurant, index) => (
            <div key={index} onClick={() => router.push(`/customer/restaurant/${restaurant.id}`)} className="cursor-pointer">
              <RestaurantCard
                restaurant={formatRestaurantForDisplay(restaurant)}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Cuisine-based Sections */}
      {Object.entries(restaurantsByCuisine).map(([cuisine, restaurants]) => (
        restaurants.length > 0 && (
          <div key={cuisine} className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{cuisine} Restaurants</h2>
              <Link href={`/customer/search/results?cuisine=${cuisine}`} className="text-red-500 flex items-center">
                View all <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {restaurants.slice(0, 4).map((restaurant, index) => (
                <div key={index} onClick={() => router.push(`/customer/restaurant/${restaurant.id}`)} className="cursor-pointer">
                  <RestaurantCard
                    restaurant={formatRestaurantForDisplay(restaurant)}
                  />
                </div>
              ))}
            </div>
          </div>
        )
      ))}
      
      {/* Order Again section removed as requested */}
      
      {/* All Restaurants Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">All Restaurants</h2>
          <Link href="/customer/all-restaurants" className="text-red-500 flex items-center">
            View all <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {allRestaurants.slice(0, 4).map((restaurant, index) => {
            // Adapt restaurant data for RestaurantCardApi component
            const adaptedRestaurant = {
              userId: restaurant.id || (restaurant as any).userId || `restaurant-${index}`,
              name: 'name' in restaurant ? restaurant.name : undefined,
              firstName: 'firstName' in restaurant ? (restaurant as any).firstName : undefined,
              lastName: 'lastName' in restaurant ? (restaurant as any).lastName : undefined,
              profilePicture: 'profilePicture' in restaurant ? (restaurant as any).profilePicture : undefined,
              rating: restaurant.rating,
              cuisineType: restaurant.cuisineType,
              priceRange: 'priceRange' in restaurant ? restaurant.priceRange : undefined,
              averagePreparationTime: 'averagePreparationTime' in restaurant ? restaurant.averagePreparationTime : undefined
            };
            
            return (
              <div key={index} className="cursor-pointer">
                <RestaurantCardApi restaurant={adaptedRestaurant} />
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Address Selection Modal */}
      <AddressSelectionModal 
        isOpen={isAddressModalOpen} 
        onClose={() => setIsAddressModalOpen(false)} 
        onAddressSelected={handleAddressSelect} 
      />
    </div>
  );
}
