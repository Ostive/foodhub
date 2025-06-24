"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Star, Clock, Bike, Heart, ChevronLeft, ChevronRight, Search, Plus, Minus, ShoppingBag, History, ArrowRight, MapPin, Store } from "lucide-react";
import Link from "next/link";
import CustomerNavbar from "../../../_components/CustomerNavbar";
import CartTotalDisplay from "../../../_components/CartTotalDisplay";
import ExtendedDishCard from "../../../_components/ExtendedDishCard";
import MenuCard from "../../../_components/MenuCard";
import { useCart } from "@/contexts/CartContext";
import type { CartItemType } from "@/lib/hooks/useCart";
import GeocodedMapComponent from "../GeocodedMapComponent";

// Custom types to match API response structure
export interface ExtendedDish {
  dishId: number;
  id?: number; // For compatibility with existing code
  name: string;
  description?: string;
  cost: number;
  userId: number;
  imageUrl?: string;
  picture?: string;
  tags?: string[];
  isVegetarian?: boolean;
  spicyLevel?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExtendedMenu {
  menuId: number;
  id?: number; // For compatibility with existing code
  name: string;
  description?: string;
  cost: number;
  picture?: string;
  tags?: string[];
  isVegetarian?: boolean;
  spicyLevel?: number;
  createdAt: string;
  updatedAt: string;
  dishes?: ExtendedDish[];
}

export interface ExtendedRestaurant {
  id?: number;
  userId?: number;
  name: string;
  address?: string;
  rating?: number;
  bannerUrl?: string;
  deliveryTime?: string;
  deliveryFee?: number;
}

interface RestaurantDetailsClientProps {
  restaurant: ExtendedRestaurant | null;
  dishes: ExtendedDish[];
  menus: ExtendedMenu[];
  dishCategories: {[key: string]: ExtendedDish[]};
  error: string | null;
}

export default function RestaurantDetailsClient({ 
  restaurant, 
  dishes, 
  menus,
  dishCategories,
  error 
}: RestaurantDetailsClientProps) {
  // Define all state hooks at the top level
  const [activeCategory, setActiveCategory] = useState<string>('Menu');
  const [activeTab, setActiveTab] = useState<'dishes' | 'menus'>('dishes');
  const [showMap, setShowMap] = useState(false);
  const [liked, setLiked] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Use the cart hook instead of context
  const { cart, addToCart, removeFromCart, updateQuantity, getCartTotal, getCartItemCount, isLoaded } = useCart();
  
  // Define all refs at the top level
  const menuCategoriesRef = useRef<HTMLDivElement>(null);

  // Handle scrolling categories
  const scrollCategories = (direction: 'left' | 'right') => {
    if (!menuCategoriesRef.current) return;
    
    const scrollAmount = 200;
    const currentScroll = menuCategoriesRef.current.scrollLeft;
    
    menuCategoriesRef.current.scrollTo({
      left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
      behavior: 'smooth'
    });
  };

  // Filter dishes based on search query
  const filteredDishes = searchQuery.trim() === "" 
    ? dishes 
    : dishes.filter(dish => 
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (dish.description && dish.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  // Filter menus based on search query
  const filteredMenus = searchQuery.trim() === "" 
    ? menus 
    : menus.filter(menu => 
        menu.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (menu.description && menu.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  // Get categories for the filtered dishes
  const filteredCategories = Object.keys(dishCategories).filter(category => 
    dishCategories[category].some(dish => 
      filteredDishes.some(filteredDish => filteredDish.dishId === dish.dishId)
    )
  );

  // Handle adding item to cart with animation
  const handleAddToCart = (dish: ExtendedDish) => {
    // Check if we're already processing this item to prevent double-adds
    if (lastAddedItem === dish.dishId.toString()) return;
    
    const cartItem = {
      id: dish.dishId,
      name: dish.name,
      price: dish.cost,
      quantity: 1,
      image: dish.picture || dish.imageUrl || '',
      type: 'dish' as CartItemType,
      restaurantId: restaurant?.userId || 0,
      restaurantName: restaurant?.name || ''
    };
    
    // Add to cart
    addToCart(cartItem);
    
    // Show animation for added item
    setLastAddedItem(dish.dishId.toString());
    setTimeout(() => setLastAddedItem(null), 1000);
  };

  // If there's an error or no restaurant data
  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CustomerNavbar />
        <div className="pt-24 px-4 max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Store className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {error ? "Error Loading Restaurant" : "Restaurant Not Found"}
            </h2>
            <p className="text-gray-600 mb-6">
              {error || "We couldn't find the restaurant you're looking for."}
            </p>
            <Link href="/customer" className="inline-flex items-center px-4 py-2 bg-[#009E73] text-white rounded-md">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <CustomerNavbar />
      
      {/* Item added notification popup */}
      {lastAddedItem && (
        <div className="fixed top-24 left-0 right-0 mx-auto w-fit z-50" style={{ animation: 'fadeIn 0.3s, fadeOut 0.3s 0.7s', opacity: 1 }}>
          <div className="bg-green-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center">
            <ShoppingBag className="w-4 h-4 mr-2" />
            <span>Item added to cart!</span>
          </div>
          <style jsx>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeOut {
              from { opacity: 1; transform: translateY(0); }
              to { opacity: 0; transform: translateY(-20px); }
            }
          `}</style>
        </div>
      )}
      
      {/* Restaurant Header */}
      <div className="relative h-64 md:h-80 w-full">
        <Image
          src={restaurant.bannerUrl || '/images/restaurant-banner-default.jpg'}
          alt={`${restaurant.name} restaurant banner`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h1 className="text-3xl md:text-4xl font-bold">{restaurant.name}</h1>
            <div className="flex items-center mt-2">
              <Star className="h-5 w-5 text-yellow-400 mr-1" />
              <span className="font-medium mr-3">{restaurant.rating || 'New'}</span>
              <span className="text-gray-200 mr-3">•</span>
              <Clock className="h-4 w-4 mr-1" />
              <span className="mr-3">{restaurant.deliveryTime || '30-45'} min</span>
              <span className="text-gray-200 mr-3">•</span>
              <Bike className="h-4 w-4 mr-1" />
              <span>{restaurant.deliveryFee ? `$${restaurant.deliveryFee.toFixed(2)}` : 'Free'} delivery</span>
            </div>
            <div className="flex items-center mt-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{restaurant.address || 'Address not available'}</span>
            </div>
          </div>
          <button 
            onClick={() => setLiked(!liked)} 
            className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm p-2 rounded-full"
          >
            <Heart className={`h-6 w-6 ${liked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 relative">
        {/* Map Toggle Button */}
        <button 
          onClick={() => setShowMap(!showMap)}
          className="absolute right-6 top-6 z-10 bg-white shadow-md rounded-full px-4 py-2 flex items-center text-sm font-medium"
        >
          {showMap ? 'Hide Map' : 'Show Map'}
          <MapPin className="h-4 w-4 ml-1 text-[#009E73]" />
        </button>
        
        {/* Map View (conditionally rendered) */}
        {showMap && (
          <div className="mb-6 bg-white rounded-lg shadow-md overflow-hidden h-64">
            <GeocodedMapComponent address={restaurant.address || ''} />
          </div>
        )}
        
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder={activeTab === 'dishes' ? "Search dishes..." : "Search menus..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009E73]"
            />
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="relative mb-6">
          <div className="flex space-x-4 justify-center">
            <button 
              onClick={() => setActiveTab('dishes')} 
              className={`whitespace-nowrap px-6 py-2 rounded-full ${activeTab === 'dishes' ? 'bg-[#009E73] text-white' : 'bg-gray-100'}`}
            >
              Dishes
            </button>
            <button 
              onClick={() => setActiveTab('menus')} 
              className={`whitespace-nowrap px-6 py-2 rounded-full ${activeTab === 'menus' ? 'bg-[#009E73] text-white' : 'bg-gray-100'}`}
            >
              Menus
            </button>
          </div>
        </div>
        
        {/* Content based on active tab */}
        {activeTab === 'dishes' ? (
          /* Dishes Content */
          <div className="space-y-8">
            {activeCategory === 'Menu' ? (
              // Show all categories
              filteredCategories.map((category) => (
                <div key={category} className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-800">{category}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dishCategories[category]
                      .filter(dish => filteredDishes.some(d => d.dishId === dish.dishId))
                      .map((dish) => (
                        <ExtendedDishCard
                          key={dish.dishId}
                          dish={dish}
                          quantity={Array.isArray(cart) ? cart.find(item => item.id === dish.dishId && item.type === 'dish')?.quantity || 0 : 0}
                          onAdd={() => handleAddToCart(dish)}
                          onRemove={() => removeFromCart(dish.dishId, 'dish')}
                          isHighlighted={lastAddedItem === dish.dishId.toString()}
                        />
                      ))}
                  </div>
                </div>
              ))
            ) : (
              // Show specific category
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800">{activeCategory}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dishCategories[activeCategory]
                    .filter(dish => filteredDishes.some(d => d.dishId === dish.dishId))
                    .map((dish) => (
                      <ExtendedDishCard
                        key={dish.dishId}
                        dish={dish}
                        quantity={Array.isArray(cart) ? cart.find(item => item.id === dish.dishId && item.type === 'dish')?.quantity || 0 : 0}
                        onAdd={() => handleAddToCart(dish)}
                        onRemove={() => removeFromCart(dish.dishId, 'dish')}
                        isHighlighted={lastAddedItem === dish.dishId.toString()}
                      />
                    ))}
                </div>
              </div>
            )}
            
            {/* No results message */}
            {filteredDishes.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">No menu items found</h3>
                <p className="text-gray-500">Try adjusting your search or browse categories</p>
              </div>
            )}
          </div>
        ) : (
          /* Menus Content */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenus.length > 0 ? (
            filteredMenus.map(menu => (
              <MenuCard
                key={menu.menuId}
                menu={menu}
                onViewDishes={() => setActiveTab('dishes')}
                onAddToCart={() => {
                  // If the menu has dishes, add them all to cart
                  if (menu.dishes && menu.dishes.length > 0) {
                    menu.dishes.forEach(dish => {
                      handleAddToCart(dish);
                    });
                  }
                }}
              />
            ))
          ) : (
            <div className="text-center py-12 col-span-3">
              <Store className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">No menus available</h3>
              <p className="text-gray-500">This restaurant hasn't created any menus yet</p>
            </div>
          )}
        </div>
      )}
    </div>
    
    {/* Cart Total Display */}
    {restaurant.userId && (
      <CartTotalDisplay 
        restaurantId={restaurant.userId.toString()} 
        menuItems={dishes} 
      />
    )}
  </div>
  );
}
