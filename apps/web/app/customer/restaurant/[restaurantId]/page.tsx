"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Star, Clock, Bike, Heart, ChevronLeft, ChevronRight, Search, Plus, Minus, ShoppingBag, History, ArrowRight, MapPin, Store } from "lucide-react";
import Link from "next/link";
import CustomerNavbar from "../../_components/CustomerNavbar";
import CartTotalDisplay from "../../_components/CartTotalDisplay";
import { useParams } from "next/navigation";

import restaurantsData from "../restaurantData";
import type { MenuItem, MenuCategory } from "../restaurantData";
import GeocodedMapComponent from "./GeocodedMapComponent";
import { useRestaurantDetails } from "@/hooks/useRestaurantDetails";
import { useRestaurantDishes, Dish } from "@/hooks/useRestaurantDishes";
import DishCard from "../../_components/DishCard";
import { useCart } from "@/contexts/CartContext";

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
  
  // Define all state hooks at the top level
  const [activeCategory, setActiveCategory] = useState<string>('Menu');
  const [dishCategories, setDishCategories] = useState<{[key: string]: Dish[]}>({});
  const [showMap, setShowMap] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showOrderAgain, setShowOrderAgain] = useState(true);
  const [lastAddedItem, setLastAddedItem] = useState<string | null>(null);
  
  // Use the cart context instead of local state
  const { cartItems, addToCart, removeFromCart, getItemQuantity, getTotalItems } = useCart();
  
  // Define all refs at the top level
  const menuCategoriesRef = useRef<HTMLDivElement>(null);
  const orderAgainSliderRef = useRef<HTMLDivElement>(null);
  
  // Fetch restaurant details from API
  const { restaurant, loading: restaurantLoading, error: restaurantError } = useRestaurantDetails(restaurantId);
  
  // Fetch dishes for the restaurant
  const { dishes, loading: dishesLoading, error: dishesError } = useRestaurantDishes(restaurantId);
  
  // Adapter function to convert Dish to MenuItem type
  const adaptDishToMenuItem = (dish: Dish): MenuItem => ({
    id: String(dish.dishId),
    name: dish.name,
    description: dish.description,
    price: `$${dish.cost.toFixed(2)}`,
    image: dish.picture ? `/images/dishes/${dish.picture}` : 'https://via.placeholder.com/300',
    popular: dish.promo !== null,
    vegetarian: dish.isVegetarian || false,
    spicy: dish.spicyLevel ? dish.spicyLevel > 0 : false,
    isSoldAlone: dish.isSoldAlone, // Add the isSoldAlone property
    customizationOptions: dish.additionalAllergens ? {
      ingredients: dish.additionalAllergens.map(allergen => ({
        name: allergen,
        price: "$0.00",
        default: true
      }))
    } : undefined,
    offer: undefined
  });
  
  // Get restaurant data with fallbacks
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
  
  const previousItems = getAllPreviousItems(restaurantData.previousOrders);
  
  // Group dishes by category
  useEffect(() => {
    console.log('Dishes data:', JSON.stringify(dishes, null, 2));
    console.log('Dishes length:', dishes?.length);
    
    if (dishes && dishes.length > 0) {
      // Log the first dish to see its structure
      console.log('First dish example:', JSON.stringify(dishes[0], null, 2));
      
      const categorized: {[key: string]: Dish[]} = {};
      
      dishes.forEach(dish => {
        // Check if dish has the expected properties
        console.log(`Processing dish: ${dish.dishId}, name: ${dish.name}, tags: ${dish.tags ? dish.tags.join(', ') : 'No tags'}`);
        
        // Use the first tag as the category, or 'Other' if no tags
        const category = dish.tags && dish.tags.length > 0 ? dish.tags[0] : 'Other';
        
        // Capitalize the first letter of the category
        const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
        
        if (!categorized[formattedCategory]) {
          categorized[formattedCategory] = [];
        }
        categorized[formattedCategory].push(dish);
      });
      
      console.log('Categorized dishes:', Object.keys(categorized));
      setDishCategories(categorized);
      
      // Set active category to first category when dishes load
      if (Object.keys(categorized).length > 0) {
        setActiveCategory(Object.keys(categorized)[0]);
      }
    } else {
      console.log('No dishes available or dishes array is empty');
    }
  }, [dishes]);
  
  // Helper functions
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
  
  // Set the last added item for visual feedback when an item is added to cart
  useEffect(() => {
    const handleLastAddedItem = (itemId: string) => {
      setLastAddedItem(itemId);
      
      // Clear the visual feedback after 2 seconds
      setTimeout(() => {
        setLastAddedItem(null);
      }, 2000);
    };
    
    // This is a custom event listener to update the lastAddedItem
    // We'll trigger this event from the addToCart function in CartContext
    window.addEventListener('itemAddedToCart', (e: any) => {
      if (e.detail && e.detail.itemId) {
        handleLastAddedItem(e.detail.itemId);
      }
    });
    
    return () => {
      window.removeEventListener('itemAddedToCart', (e: any) => {});
    };
  }, []);
  
  // We don't need to redefine these functions since we're using the ones from CartContext
  // Removed to avoid naming conflicts
  
  // Calculate cart total based on items in cart
  const getCartTotal = (): string => {
    let total = 0;
    
    // Create a flat array of all menu items from all categories
    const allMenuItems = Object.values(dishCategories).flat().map(dish => ({
      id: String(dish.dishId),
      price: `$${dish.cost.toFixed(2)}`
    }));
    
    Object.entries(cartItems).forEach(([itemId, quantity]) => {
      // Find the item in the menu items
      const item = allMenuItems.find(item => item.id === itemId);
      if (item) {
        const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
        total += price * quantity;
      }
    });
    
    return `$${total.toFixed(2)}`;
  };
  
  // Check if an item needs customization or can be added directly to cart
  const needsCustomization = (item: MenuItem): boolean => {
    // If the item has isSoldAlone property set, use that
    if (item.isSoldAlone !== undefined) {
      // isSoldAlone = true means the item can be added directly to cart without customization
      return !item.isSoldAlone;
    }
    
    // Legacy fallback for items without isSoldAlone property
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
  
  // Helper function to render menu items
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
  
  // Main UI rendering
  return (
    <div className="min-h-screen bg-linear-to-br from-white to-gray-50 flex flex-col">
      <CustomerNavbar />
      
      {/* Restaurant Hero Section */}
      <div className="relative h-64 md:h-80 w-full">
        <Image 
          src={restaurantData.image} 
          alt={restaurantData.name}
          fill
          className="object-cover brightness-90"
          priority
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{restaurantData.name}</h1>
              <div className="flex items-center space-x-4 text-white">
                <div className="flex items-center">
                  <Star size={16} className="text-yellow-400 mr-1" />
                  <span>{restaurantData.rating} ({restaurantData.reviewCount}+)</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  <span>{restaurantData.deliveryTime}</span>
                </div>
                <div className="flex items-center">
                  <Bike size={16} className="mr-1" />
                  <span>{restaurantData.deliveryFee}</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setLiked(!liked)}
              className={`p-2 rounded-full ${liked ? 'bg-red-500 text-white' : 'bg-white/20 text-white'}`}
            >
              <Heart size={20} fill={liked ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Restaurant Details and Menu */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        {/* Order Again Section (if there are previous orders) */}
        {previousItems.length > 0 && showOrderAgain && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <History size={20} className="mr-2 text-[#4CAF50]" />
                Order Again
              </h2>
              <div className="flex space-x-2">
                <button 
                  onClick={() => scrollOrderAgain('left')}
                  className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => scrollOrderAgain('right')}
                  className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  <ChevronRight size={20} />
                </button>
                <button 
                  onClick={() => setShowOrderAgain(false)}
                  className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div 
              ref={orderAgainSliderRef}
              className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide"
            >
              {previousItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex-shrink-0 w-48 bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="h-32 relative">
                    <Image 
                      src={item.image} 
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 mb-1 truncate">{item.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{item.price}</p>
                    <button 
                      onClick={() => addToCart(item.id)}
                      className="w-full bg-[#4CAF50] hover:bg-[#388E3C] text-white text-sm py-1.5 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Plus size={16} className="mr-1" />
                      Add Again
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Menu Categories Navigation */}
        <div className="sticky top-16 bg-white z-10 border-b border-gray-200">
          <div 
            ref={menuCategoriesRef}
            className="flex space-x-1 overflow-x-auto py-3 scrollbar-hide"
          >
            {Object.keys(dishCategories).map((category) => (
              <button
                key={category}
                onClick={() => scrollToCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${activeCategory === category ? 'bg-[#4CAF50] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {/* Restaurant Details Link */}
        <div className="my-6">
          <button 
            onClick={() => setShowMap(!showMap)}
            className="w-full bg-white rounded-xl shadow-sm p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <div className="bg-[#4CAF50]/10 p-2 rounded-full mr-3">
                <MapPin size={20} className="text-[#4CAF50]" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Restaurant Details</h3>
                <p className="text-sm text-gray-500">{restaurantData.address}</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
          
          {/* Map Component (conditionally rendered) */}
          {showMap && (
            <div className="mt-4 bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="h-64 relative">
                <GeocodedMapComponent address={restaurantData.address} />
              </div>
              <div className="p-4 border-t border-gray-100">
                <div className="flex items-start mb-3">
                  <Store size={18} className="text-[#4CAF50] mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">{restaurantData.name}</h4>
                    <p className="text-sm text-gray-500">{restaurantData.cuisine}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin size={18} className="text-[#4CAF50] mr-2 mt-0.5" />
                  <p className="text-sm text-gray-600">{restaurantData.address}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Dishes by Category */}
        {dishesLoading ? (
          <div className="py-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4CAF50]"></div>
          </div>
        ) : dishesError ? (
          <div className="py-8 text-center">
            <div className="bg-red-50 p-4 rounded-xl inline-block mx-auto">
              <p className="text-red-600">Failed to load menu items. Please try again later.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8 pb-24">
            {Object.entries(dishCategories).map(([category, categoryDishes]) => (
              <div key={category} id={category} className="scroll-mt-32">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{category}</h2>
                <div className="space-y-4">
                  {categoryDishes.map((dish) => (
                    <div key={dish.dishId} className="bg-white rounded-xl shadow-sm overflow-hidden">
                      {renderMenuItem(adaptDishToMenuItem(dish))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Cart Total Display */}
      <CartTotalDisplay 
        menuItems={Object.values(dishCategories).flat().map(dish => ({
          id: String(dish.dishId),
          price: `$${dish.cost.toFixed(2)}`
        }))}
        restaurantId={restaurantId}
      />
    </div>
  );
}