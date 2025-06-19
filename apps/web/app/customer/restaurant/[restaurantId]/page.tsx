"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Star, Clock, Bike, Heart, ChevronLeft, ChevronRight, Search, Plus, Minus, ShoppingBag, History, ArrowRight, MapPin, Store } from "lucide-react";
import Link from "next/link";
import CustomerNavbar from "../../_components/CustomerNavbar";
import { useParams } from "next/navigation";

import restaurantsData from "../restaurantData";
import type { MenuItem, MenuCategory } from "../restaurantData";
import MapComponent from "./MapComponent";
import { useRestaurantDetails } from "@/hooks/useRestaurantDetails";
import { useRestaurantDishes, Dish } from "@/hooks/useRestaurantDishes";
import DishCard from "../../_components/DishCard";


interface CartItem {
  id: string;
  quantity: number;
}

// Flatten all previous orders into a single array of items with dates
const getAllPreviousItems = (previousOrders: any[]) => {
  return previousOrders.flatMap(order => {
    return order.items.map((item: any) => ({
      ...item,
      orderDate: order.date
    }));
  });
};

export default function RestaurantPage() {
  const params = useParams();
  const restaurantId = params.restaurantId as string;
  
  // Fetch restaurant details from API
  const { restaurant, loading: restaurantLoading, error: restaurantError } = useRestaurantDetails(restaurantId);
  
  // Fetch restaurant dishes from API
  const { dishes, loading: dishesLoading, error: dishesError } = useRestaurantDishes(restaurantId);
  
  // Group dishes by category
  const [dishCategories, setDishCategories] = useState<{[key: string]: Dish[]}>({});
  
  useEffect(() => {
    if (dishes && dishes.length > 0) {
      const categorized: {[key: string]: Dish[]} = {};
      
      dishes.forEach(dish => {
        const category = dish.category || 'Other';
        if (!categorized[category]) {
          categorized[category] = [];
        }
        categorized[category].push(dish);
      });
      
      setDishCategories(categorized);
    }
  }, [dishes]);

  // Check if restaurant exists in our data or is loading from API
  if (restaurantLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-white to-gray-50 flex flex-col">
        <CustomerNavbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4CAF50]"></div>
        </div>
      </div>
    );
  }
  
  if (restaurantError || !restaurant) {
    return (
      <div className="min-h-screen bg-linear-to-br from-white to-gray-50 flex flex-col">
        <CustomerNavbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Left side - Illustration */}
              <div className="md:w-2/5 bg-[#4CAF50]/10 p-8 flex items-center justify-center">
                <div className="relative w-full h-64">
                  <svg viewBox="0 0 24 24" className="w-full h-full text-[#4CAF50]/80">
                    <path fill="currentColor" d="M11,9H9V2H7V9H5V2H3V9C3,11.12 4.66,12.84 6.75,12.97V22H9.25V12.97C11.34,12.84 13,11.12 13,9V2H11V9M16,6V14H18.5V22H21V2C18.24,2 16,4.24 16,6Z" />
                  </svg>
                </div>
              </div>
              
              {/* Right side - Content */}
              <div className="md:w-3/5 p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">Restaurant Not Found</h1>
                <p className="text-gray-600 mb-6">We couldn't find the restaurant you're looking for. It may have been removed or the URL might be incorrect.</p>
                
                <div className="space-y-6 mb-8">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                      <span className="w-8 h-8 rounded-full bg-[#4CAF50]/10 flex items-center justify-center mr-2">
                        <svg className="w-4 h-4 text-[#4CAF50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </span>
                      Popular Restaurants
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      <Link href="/customer/restaurant/restaurant-1" className="p-3 rounded-xl bg-[#4CAF50]/5 hover:bg-[#4CAF50]/10 transition-colors text-center text-sm font-medium text-gray-800">
                        Burger Palace
                      </Link>
                      <Link href="/customer/restaurant/taco-fiesta" className="p-3 rounded-xl bg-[#4CAF50]/5 hover:bg-[#4CAF50]/10 transition-colors text-center text-sm font-medium text-gray-800">
                        Taco Fiesta
                      </Link>
                      <Link href="/customer/restaurant/restaurant-3" className="p-3 rounded-xl bg-[#4CAF50]/5 hover:bg-[#4CAF50]/10 transition-colors text-center text-sm font-medium text-gray-800">
                        Sushi Express
                      </Link>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                      <span className="w-8 h-8 rounded-full bg-[#4CAF50]/10 flex items-center justify-center mr-2">
                        <svg className="w-4 h-4 text-[#4CAF50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </span>
                      Find Restaurants
                    </h3>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Search by cuisine or restaurant name..." 
                        className="w-full px-4 py-3 pr-10 border-0 bg-[#4CAF50]/5 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#4CAF50] focus:bg-white transition-all"
                      />
                      <button className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-[#4CAF50] text-white">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link 
                    href="/customer"
                    className="flex-1 bg-[#4CAF50] hover:bg-[#388E3C] text-white py-3 px-4 rounded-xl text-center font-medium transition-colors flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7m-7-7v14" />
                    </svg>
                    Go to Homepage
                  </Link>
                  
                  <Link 
                    href="/customer/special-offers"
                    className="flex-1 bg-white hover:bg-gray-50 text-[#4CAF50] border border-[#4CAF50] py-3 px-4 rounded-xl text-center font-medium transition-colors flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                    Special Offers
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  // Get restaurant data - we can use non-null assertion here because we've already checked it exists
  const restaurantData = restaurantsData[restaurantId] || {
    name: restaurant?.firstName || 'Restaurant',
    rating: restaurant?.rating || 4.0,
    ratingCount: 100,
    deliveryTime: restaurant?.averagePreparationTime || '25-35 min',
    deliveryFee: '5€',
    image: restaurant?.profilePicture || '/images/restaurant-placeholder.jpg',
    address: restaurant?.address || 'Address unavailable',
    cuisineType: restaurant?.cuisineType || 'Various',
    menuCategories: [],
    previousOrders: [],
  };
  
  // State for menu categories
  const [activeCategory, setActiveCategory] = useState<string>(
    Object.keys(dishCategories)[0] || 
    (restaurantData.menuCategories[0]?.name || 'Menu')
  );
  
  // Update active category when dish categories are loaded
  useEffect(() => {
    if (Object.keys(dishCategories).length > 0) {
      setActiveCategory(Object.keys(dishCategories)[0]);
    }
  }, [dishCategories]);
  
  const menuCategoriesRef = useRef<HTMLDivElement>(null);
  
  // State for cart
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  
  // State for order again slider
  const orderAgainSliderRef = useRef<HTMLDivElement>(null);
  
  // State for showing map
  const [showMap, setShowMap] = useState(false);
  
  const [liked, setLiked] = useState(false);
  const [showOrderAgain, setShowOrderAgain] = useState(restaurantData.previousOrders.length > 0);
  
  const previousItems = getAllPreviousItems(restaurantData.previousOrders);
  
  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const scrollOrderAgain = (direction: 'left' | 'right') => {
    if (orderAgainSliderRef.current) {
      const { current } = orderAgainSliderRef;
      const scrollAmount = 300;
      const left = direction === 'left' ? current.scrollLeft - scrollAmount : current.scrollLeft + scrollAmount;
      current.scrollTo({ left, behavior: 'smooth' });
    }
  };
  
  const [lastAddedItem, setLastAddedItem] = useState<string | null>(null);

  const addToCart = (itemId: string) => {
    setCartItems(prev => {
      const newItems = { ...prev };
      if (newItems[itemId]) {
        newItems[itemId] += 1;
      } else {
        newItems[itemId] = 1;
      }
      return newItems;
    });
    
    // Set the last added item for visual feedback
    setLastAddedItem(itemId);
    
    // Clear the visual feedback after 2 seconds
    setTimeout(() => {
      setLastAddedItem(null);
    }, 2000);
  };
  
  const removeFromCart = (itemId: string) => {
    setCartItems(prev => {
      const newItems = { ...prev };
      if (newItems[itemId] && newItems[itemId] > 1) {
        newItems[itemId] -= 1;
      } else {
        delete newItems[itemId];
      }
      return newItems;
    });
  };
  
  const getItemQuantity = (itemId: string): number => {
    return cartItems[itemId] || 0;
  };
  
  const getTotalItems = (): number => {
    return Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);
  };
  
  const getCartTotal = (): string => {
    let total = 0;
    
    Object.entries(cartItems).forEach(([itemId, quantity]) => {
      // Find the item in the menu categories
      for (const category of restaurantData.menuCategories) {
        const item = category.items.find(item => item.id === itemId);
        if (item) {
          const price = parseFloat(item.price.replace('$', ''));
          total += price * quantity;
          break;
        }
      }
    });
    
    return `$${total.toFixed(2)}`;
  };
  
  // Check if an item needs customization or can be added directly to cart
  const needsCustomization = (item: MenuItem): boolean => {
    // Items that don't need customization (can be added directly to cart)
    const directAddItems = ['onion-rings', 'french-fries', 'mozzarella-sticks', 'side-salad', 'coleslaw'];
    
    // If the item is in our direct add list, it doesn't need customization
    if (directAddItems.includes(item.id)) {
      return false;
    }
    
    // If the item has customization options, it needs the customization page
    if (item.customizationOptions) {
      return true;
    }
    
    // Default to needing customization for other items
    return true;
  };

  const renderMenuItem = (item: MenuItem) => {
    // Helper function to get offer display text
    const getOfferDisplayText = () => {
      if (!item.offer) return null;
      
      switch (item.offer.offerType) {
        case "buy_one_get_one":
          return `Buy 1 Get 1 ${item.offer.value ? `${item.offer.value}% Off` : 'Free'}`;
        case "percent_off":
          return `${item.offer.value}% Off`;
        case "fixed_price":
          return `Special: ${item.offer.value}`;
        case "free_item":
          return "Free Item";
        default:
          return "Special Offer";
      }
    };
    
    // Get offer badge color
    const getOfferBadgeColor = () => {
      if (!item.offer) return "";
      
      switch (item.offer.offerType) {
        case "buy_one_get_one":
          return "bg-[#673AB7]";
        case "percent_off":
          return "bg-[#FF9800]";
        case "fixed_price":
          return "bg-[#2196F3]";
        case "free_item":
          return "bg-[#E91E63]";
        default:
          return "bg-[#FF9800]";
      }
    };
    
    // Check if this item needs customization
    const requiresCustomization = needsCustomization(item);
    const itemQuantity = getItemQuantity(item.id);
    
    return (
      <div key={item.id} className={`bg-white rounded-xl shadow-xs overflow-hidden mb-4 transition-all duration-300 ${lastAddedItem === item.id ? 'ring-2 ring-[#4CAF50] scale-[1.01]' : ''}`}>
        <div className="flex flex-col md:flex-row">
          {/* Image section */}
          <div className="md:w-1/4 h-40 md:h-auto relative">
            {requiresCustomization ? (
              <Link href={`/customer/restaurant/${params.restaurantId}/item/${item.id}`}>
                <Image 
                  src={item.image} 
                  alt={item.name} 
                  fill
                  className="object-cover object-center" 
                />
              </Link>
            ) : (
              <div className="w-full h-full">
                <Image 
                  src={item.image} 
                  alt={item.name} 
                  fill
                  className="object-cover object-center" 
                />
              </div>
            )}
            
            {/* Badges */}
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              {item.offer && (
                <span className={`${getOfferBadgeColor()} text-white text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap`}>
                  {getOfferDisplayText()}
                </span>
              )}
              {item.popular && (
                <span className="bg-[#FF9800] text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  Popular
                </span>
              )}
              {item.vegetarian && (
                <span className="bg-[#4CAF50] text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  Veg
                </span>
              )}
              {item.spicy && (
                <span className="bg-[#F44336] text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  Spicy
                </span>
              )}
            </div>
          </div>
          
          {/* Content section */}
          <div className="p-4 md:w-3/4 flex flex-col justify-between">
            <div>
              {/* Item name - link if customization required */}
              {requiresCustomization ? (
                <Link href={`/customer/restaurant/${params.restaurantId}/item/${item.id}`} className="hover:text-[#4CAF50] transition-colors">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                </Link>
              ) : (
                <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
              )}
              
              {/* Description */}
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              
              {/* Price */}
              <div className="flex items-center">
                <p className="text-[#4CAF50] font-bold">{item.price}</p>
                {item.offer && item.offer.offerType === "fixed_price" && (
                  <p className="ml-2 text-gray-500 text-sm line-through">{item.price}</p>
                )}
              </div>
              
              {item.offer && (
                <div className="mt-1 text-xs text-gray-600">
                  {item.offer.offerType === "buy_one_get_one" && (
                    <p>Buy one and get a second one {item.offer.value ? `${item.offer.value}% off` : 'free'}!</p>
                  )}
                  {item.offer.offerType === "percent_off" && (
                    <p>{item.offer.value}% off{item.offer.minOrderValue ? ` on orders over ${item.offer.minOrderValue}` : ''}!</p>
                  )}
                  {item.offer.offerType === "fixed_price" && (
                    <p>Special price: {item.offer.value} instead of {item.price}</p>
                  )}
                  {item.offer.offerType === "free_item" && (
                    <p>{item.offer.minOrderValue ? `Free with orders over ${item.offer.minOrderValue}` : 'Free with qualifying purchase'}!</p>
                  )}
                  {item.offer.expiryDate && (
                    <p className="mt-0.5 text-gray-500">Expires: {item.offer.expiryDate}</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Bottom buttons */}
            <div className="mt-3 flex justify-end">
              {requiresCustomization ? (
                // For items that need customization
                itemQuantity > 0 ? (
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-1 rounded-full"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-gray-800 font-medium">{itemQuantity}</span>
                    <button 
                      onClick={() => addToCart(item.id)}
                      className="bg-[#4CAF50] hover:bg-[#388E3C] text-white p-1 rounded-full"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                ) : (
                  <Link 
                    href={`/customer/restaurant/${params.restaurantId}/item/${item.id}`}
                    className="bg-[#4CAF50] hover:bg-[#388E3C] text-white px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center justify-center"
                  >
                    <Plus size={16} className="mr-1" />
                    Add
                  </Link>
                )
              ) : (
                // For direct-add items
                itemQuantity > 0 ? (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-1 rounded-full"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-gray-800 font-medium">{itemQuantity}</span>
                    <button
                      onClick={() => addToCart(item.id)}
                      className="bg-[#4CAF50] hover:bg-[#388E3C] text-white p-1 rounded-full"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(item.id)}
                    className="bg-[#4CAF50] hover:bg-[#388E3C] text-white px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center justify-center"
                  >
                    <Plus size={16} className="mr-1" />
                    Add
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    );

  };

  return (
    <div className="bg-[#f8f9fa] min-h-svh pb-20">
      {/* Dark overlay for navbar */}
      <div className="fixed top-0 left-0 right-0 h-16 z-40 backdrop-blur-xs bg-linear-to-b from-black/60 via-black/40 to-transparent pointer-events-none"></div>
      <CustomerNavbar />
      
      {/* Hero Section with Cover Image */}
      <div className="relative h-[400px] md:h-[500px]">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <Image 
          src={restaurant?.profilePicture || restaurantData.coverImage || '/images/restaurant-placeholder.jpg'} 
          alt={restaurant?.firstName || restaurantData.name} 
          fill
          className="object-cover object-center" 
        />
        
        <div className="absolute top-4 left-4 z-20">
          <Link 
            href="/customer" 
            className="bg-white/90 px-3 py-2 rounded-full shadow-md text-gray-700 hover:bg-white transition-colors flex items-center"
          >
            <ChevronLeft size={20} className="mr-1" />
            <span className="font-medium">Back</span>
          </Link>
        </div>
        
        <button 
          className={`absolute top-4 right-4 z-20 p-2 rounded-full shadow-md transition-colors ${liked ? 'bg-[#FF9800]/90 text-white' : 'bg-white/90 text-gray-700 hover:text-[#FF9800]'}`}
          onClick={() => setLiked(!liked)}
        >
          <Heart size={24} className={liked ? 'fill-current' : ''} />
        </button>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{restaurant?.firstName || restaurantData.name}</h1>
            <div className="flex flex-wrap items-center text-white/90 gap-x-4 gap-y-2 mb-2">
              <div className="flex items-center">
                <Star size={16} className="text-[#FFC107] mr-1" />
                <span>{restaurant?.rating || restaurantData.rating} ({restaurantData.reviewCount || 0} reviews)</span>
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-1" />
                <span>{restaurant?.averagePreparationTime || restaurantData.deliveryTime}</span>
              </div>
              <div className="flex items-center">
                <Bike size={16} className="mr-1" />
                <span>{restaurantData.deliveryFee} • {restaurant?.address || restaurantData.distance}</span>
              </div>
            </div>
            <p className="text-white/90 text-sm md:text-base">{restaurant?.description || restaurantData.description || `${restaurant?.firstName || restaurantData.name} offers delicious ${restaurant?.cuisineType || 'cuisine'} for delivery.`}</p>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-6">

        
        {/* Order Again Section */}
        {showOrderAgain && previousItems && previousItems.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <History size={20} className="text-[#4CAF50] mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Order Again</h2>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => scrollOrderAgain('left')}
                  className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => scrollOrderAgain('right')}
                  className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            
            <div 
              ref={orderAgainSliderRef}
              className="flex overflow-x-auto pb-4 hide-scrollbar gap-4"
            >
              {previousItems.map((item: any, index: number) => (
                <div key={`${item.id}-${index}`} className="shrink-0 w-48 bg-white rounded-xl shadow-xs overflow-hidden">
                  <div className="relative h-32">
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill
                      className="object-cover object-center" 
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-500">{item.orderDate}</span>
                      <button 
                        onClick={() => addToCart(item.id)}
                        className="bg-[#4CAF50] hover:bg-[#388E3C] text-white p-1 rounded-full"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Menu Categories Navigation */}
        <div className="sticky top-16 bg-white z-30 rounded-xl shadow-xs mb-6 overflow-hidden">
          <div className="overflow-x-auto hide-scrollbar">
            <div className="flex p-2 min-w-max">
              {restaurantData.menuCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => scrollToCategory(category.id)}
                  className={`px-4 py-2 mx-1 rounded-lg whitespace-nowrap ${activeCategory === category.id ? 'bg-[#4CAF50] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Restaurant Details Link */}
        <div className="mb-6">
          <Link
            href={`/customer/restaurant/${restaurantId}/details`}
            className="bg-white rounded-xl shadow-xs p-4 flex items-center justify-between w-full hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="bg-[#4CAF50]/10 p-3 rounded-full mr-3">
                <MapPin className="h-6 w-6 text-[#4CAF50]" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Restaurant Details</h3>
                <p className="text-sm text-gray-500">View location, hours, contact info and more</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </Link>
        </div>
        
        {/* API Dishes Section */}
        {!dishesLoading && !dishesError && Object.keys(dishCategories).length > 0 ? (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Menu</h2>
            
            {/* Category tabs */}
            <div className="flex overflow-x-auto hide-scrollbar space-x-2 pb-4 mb-6">
              {Object.keys(dishCategories).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${activeCategory === category ? 'bg-[#4CAF50] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            {/* Display dishes for active category */}
            {Object.keys(dishCategories).map((category) => (
              <div key={category} className={`${activeCategory === category ? 'block' : 'hidden'}`}>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dishCategories[category].map((dish) => (
                    <DishCard key={dish.id} dish={dish} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : dishesLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4CAF50]"></div>
          </div>
        ) : dishesError ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-8">
            <p className="text-red-600 mb-2">Unable to load menu items</p>
            <p className="text-gray-600 text-sm">Please try again later</p>
          </div>
        ) : (
          /* Fallback to static data if no API dishes */
          <div>
            {restaurantData.menuCategories.map((category) => (
              <div key={category.id} id={category.id} className="mb-8 scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{category.name}</h2>
                {category.items.map((item) => renderMenuItem(item))}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Cart Button */}
      {getTotalItems() > 0 && (
        <Link 
          href="/customer/cart"
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#4CAF50] hover:bg-[#388E3C] text-white px-6 py-3 rounded-full text-lg font-medium transition-colors flex items-center shadow-lg w-11/12 max-w-md justify-between"
        >
          <div className="flex items-center">
            <ShoppingBag size={20} className="mr-2" />
            <span>{getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}</span>
          </div>
          
          <div className="flex items-center">
            <span>{getCartTotal()}</span>
            <ArrowRight size={20} className="ml-2" />
          </div>
        </Link>
      )}
    </div>
  );
}
