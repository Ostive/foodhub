"use client";

import CustomerNavbar from "./_components/CustomerNavbar";
import OverlayCard from "./_components/OverlayCard";
import RestaurantCard from "./_components/RestaurantCard";
import SpecialOfferCard from "./_components/SpecialOfferCard"; // Import SpecialOfferCard
import AddressSelectionModal from "./_components/AddressSelectionModal";
import Image from "next/image";
import { Search, MapPin, Filter, ChevronDown, Star, Clock, Percent, Heart, ShoppingBag, ArrowRight, TrendingUp, Award, Bookmark, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import restaurantsData from "./restaurant/restaurantData";
import { MenuItem, OfferType, Restaurant } from "./restaurant/restaurantData";
import NavbarDemo from "../_components/topbar";


const categories = [
  { name: "Pizza", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?auto=format&fit=crop&w=400&q=80" },
  { name: "Sushi", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?auto=format&fit=crop&w=400&q=80" },
  { name: "Burgers", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80" },
  { name: "Vegan", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80" },
  { name: "Desserts", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80" },
  { name: "Salads", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?auto=format&fit=crop&w=400&q=80" },
  { name: "Healthy", image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=400&q=80" },
  { name: "Indian", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80" },
  { name: "Chinese", image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=400&q=80" },
  { name: "Italian", image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=400&q=80" },
  { name: "Mexican", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=400&q=80" },
  { name: "Thai", image: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?auto=format&fit=crop&w=400&q=80" },
  { name: "Breakfast", image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?auto=format&fit=crop&w=400&q=80" },
  { name: "Coffee", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80" },
  { name: "Seafood", image: "https://images.unsplash.com/photo-1618055301293-494ab4c71f9f?q=80&w=2667&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?auto=format&fit=crop&w=400&q=80" },
];

const popularRestaurants = [
  { 
    id: "pizza-palace",
    name: "Pizza Palace", 
    image: "https://images.unsplash.com/photo-1548365328-8b849e6c7b85?auto=format&fit=crop&w=600&q=80", 
    rating: 4.7, 
    cuisine: "Pizza", 
    delivery: "30-40 min",
    deliveryFee: "$1.99",
    distance: "1.2 mi",
    featured: true,
    reviewCount: 324,
    description: "Authentic Italian pizza with homemade dough and fresh ingredients"
  },
  { 
    id: "taco-fiesta",
    name: "Taco Fiesta", 
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80", 
    rating: 4.8, 
    cuisine: "Mexican", 
    delivery: "15-25 min",
    deliveryFee: "$1.99",
    distance: "1.5 mi",
    featured: true,
    reviewCount: 278,
    description: "Authentic Mexican tacos and more, made with fresh ingredients and traditional recipes"
  },
  { 
    id: "sushi-world",
    name: "Sushi World", 
    image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=600&q=80", 
    rating: 4.8, 
    cuisine: "Sushi", 
    delivery: "25-35 min",
    deliveryFee: "$2.99",
    distance: "0.8 mi",
    featured: false,
    reviewCount: 189,
    description: "Fresh sushi and sashimi prepared by expert chefs daily"
  },
  { 
    id: "burger-house",
    name: "Burger House", 
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80", 
    rating: 4.6, 
    cuisine: "Burgers", 
    delivery: "20-30 min",
    deliveryFee: "$1.49",
    distance: "1.5 mi",
    featured: false,
    reviewCount: 256,
    description: "Juicy gourmet burgers with a variety of toppings and sides"
  },
];

// Order Again restaurants
const orderAgainRestaurants = [
  { 
    id: "healthy-bites",
    name: "Healthy Bites", 
    image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=600&q=80", 
    rating: 4.5, 
    cuisine: "Healthy", 
    delivery: "20-30 min",
    deliveryFee: "$2.49",
    distance: "1.3 mi",
    featured: false,
    reviewCount: 156,
    description: "Fresh salads and healthy meals made with organic ingredients"
  },
  { 
    id: "sushi-world",
    name: "Sushi World", 
    image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=600&q=80", 
    rating: 4.8, 
    cuisine: "Sushi", 
    delivery: "25-35 min",
    deliveryFee: "$2.99",
    distance: "0.8 mi",
    featured: false,
    reviewCount: 189,
    description: "Fresh sushi and sashimi prepared by expert chefs daily"
  },
  { 
    id: "pizza-palace",
    name: "Pizza Palace", 
    image: "https://images.unsplash.com/photo-1548365328-8b849e6c7b85?auto=format&fit=crop&w=600&q=80", 
    rating: 4.7, 
    cuisine: "Pizza", 
    delivery: "30-40 min",
    deliveryFee: "$1.99",
    distance: "1.2 mi",
    featured: true,
    reviewCount: 324,
    description: "Authentic Italian pizza with homemade dough and fresh ingredients"
  },
];

// Near You restaurants
const nearYouRestaurants = [
  { 
    id: "local-pizza",
    name: "Local Pizza", 
    image: "https://images.unsplash.com/photo-1548365328-8b849e6c7b85?auto=format&fit=crop&w=600&q=80", 
    rating: 4.5, 
    cuisine: "Pizza", 
    delivery: "15-25 min",
    deliveryFee: "$0.99",
    distance: "0.5 km",
    featured: false,
    reviewCount: 112,
    description: "Neighborhood pizzeria serving classic and creative pies"
  },
  { 
    id: "taco-fiesta",
    name: "Taco Fiesta", 
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80", 
    rating: 4.3, 
    cuisine: "Mexican", 
    delivery: "20-30 min",
    deliveryFee: "$1.49",
    distance: "0.7 km",
    featured: false,
    reviewCount: 98,
    description: "Authentic Mexican street food and fresh homemade salsas"
  },
  { 
    id: "noodle-house",
    name: "Noodle House", 
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80", 
    rating: 4.6, 
    cuisine: "Asian", 
    delivery: "25-35 min",
    deliveryFee: "$1.99",
    distance: "1.2 km",
    featured: false,
    reviewCount: 145,
    description: "Handmade noodles and authentic Asian flavors"
  },
];

// Get menu items with offers for the homepage
const getSpecialOffersForHomepage = () => {
  const itemsWithOffers: {
    id: string;
    restaurantId: string;
    restaurantName: string;
    image: string;
    rating: number;
    title: string;
    description: string;
    discountValue?: number;
    expiryDate?: string;
    cuisine: string;
    delivery: string;
    deliveryFee: string;
    distance: string;
    reviewCount: number;
    offerType: "deal" | "discount" | "promo";
    minOrderValue?: string;
    itemName: string;
    itemPrice: string;
  }[] = [];
  
  for (const restaurantId in restaurantsData) {
    const restaurant = restaurantsData[restaurantId];
    if (!restaurant) continue;
    
    restaurant.menuCategories.forEach(category => {
      category.items.forEach(item => {
        if (item.offer) {
          itemsWithOffers.push({
            id: `${restaurant.id}-${item.id}`,
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
            image: item.image,
            rating: restaurant.rating,
            title: getOfferTitle(item),
            description: getOfferDescription(item),
            discountValue: getDiscountValue(item.offer),
            expiryDate: item.offer.expiryDate,
            cuisine: restaurant.cuisine,
            delivery: restaurant.deliveryTime,
            deliveryFee: restaurant.deliveryFee,
            distance: restaurant.distance,
            reviewCount: restaurant.reviewCount,
            offerType: mapOfferTypeToDisplay(item.offer.offerType),
            minOrderValue: item.offer.minOrderValue,
            itemName: item.name,
            itemPrice: item.price
          });
        }
      });
    });
  }
  
  return itemsWithOffers.slice(0, 6); // Limit to 6 offers for the homepage
};

// Map offer types to display types for the card
const mapOfferTypeToDisplay = (offerType: OfferType): "deal" | "discount" | "promo" => {
  switch (offerType) {
    case "buy_one_get_one":
      return "deal";
    case "percent_off":
      return "discount";
    case "fixed_price":
      return "discount";
    case "free_item":
      return "promo";
    default:
      return "deal";
  }
};

// Generate offer title based on offer type
const getOfferTitle = (item: MenuItem): string => {
  if (!item.offer) return item.name;
  
  switch (item.offer.offerType) {
    case "buy_one_get_one":
      return `Buy One Get One ${item.offer.value ? `${item.offer.value}% Off` : 'Free'}`;
    case "percent_off":
      return `${item.offer.value}% Off ${item.name}`;
    case "fixed_price":
      return `${item.name} for only ${item.offer.value}`;
    case "free_item":
      return `Free Item with ${item.name}`;
    default:
      return item.name;
  }
};

// Generate offer description
const getOfferDescription = (item: MenuItem): string => {
  if (!item.offer) return item.description;
  
  switch (item.offer.offerType) {
    case "buy_one_get_one":
      return `Order ${item.name} and get a second one ${item.offer.value ? `${item.offer.value}% off` : 'completely free'}!`;
    case "percent_off":
      return `Get ${item.offer.value}% off on ${item.name}. Regular price: ${item.price}.`;
    case "fixed_price":
      return `Special offer: Get ${item.name} for only ${item.offer.value} instead of ${item.price}.`;
    case "free_item":
      if (item.offer.minOrderQuantity) {
        return `Order ${item.offer.minOrderQuantity} ${item.name} and get one free!`;
      } else if (item.offer.minOrderValue) {
        return `Spend ${item.offer.minOrderValue} or more and get a free ${item.name}!`;
      } else {
        return `Order ${item.name} and receive a free item!`;
      }
    default:
      return item.description;
  }
};

// Get discount value for display
const getDiscountValue = (offer: MenuItem["offer"]): number | undefined => {
  if (!offer) return undefined;
  
  switch (offer.offerType) {
    case "percent_off":
      return typeof offer.value === 'number' ? offer.value : undefined;
    case "buy_one_get_one":
      return typeof offer.value === 'number' ? offer.value : 100;
    default:
      return undefined;
  }
};

export default function CustomerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [deliveryCoordinates, setDeliveryCoordinates] = useState<[number, number] | undefined>(undefined);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const router = useRouter();
  
  // All restaurants section state
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [visibleRestaurants, setVisibleRestaurants] = useState<Restaurant[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const restaurantsPerPage = 10;
  const allRestaurantsRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  
  // Convert restaurantsData object to array for pagination
  useEffect(() => {
    const restaurantsArray = Object.values(restaurantsData);
    setAllRestaurants(restaurantsArray);
    // Initialize with first batch
    setVisibleRestaurants(restaurantsArray.slice(0, restaurantsPerPage));
  }, []);
  
  // Intersection Observer for infinite scrolling
  useEffect(() => {
    if (!loadingRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting && hasMore && !isLoading) {
          loadMoreRestaurants();
        }
      },
      { threshold: 0.1 }
    );
    
    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }
    
    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [hasMore, isLoading]);
  
  // Function to load more restaurants
  const loadMoreRestaurants = useCallback(() => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const startIndex = (nextPage - 1) * restaurantsPerPage;
      const endIndex = startIndex + restaurantsPerPage;
      
      if (startIndex >= allRestaurants.length) {
        setHasMore(false);
        setIsLoading(false);
        return;
      }
      
      const nextBatch = allRestaurants.slice(startIndex, endIndex);
      setVisibleRestaurants(prev => [...prev, ...nextBatch]);
      setCurrentPage(nextPage);
      setIsLoading(false);
      
      // Check if we've loaded all restaurants
      if (endIndex >= allRestaurants.length) {
        setHasMore(false);
      }
    }, 800); // Simulate network delay
  }, [currentPage, allRestaurants, isLoading, hasMore]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/customer/search/results?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  // Handle address selection from the modal
  const handleAddressSelected = (address: string, coordinates?: [number, number]) => {
    setDeliveryAddress(address);
    setDeliveryCoordinates(coordinates);
    
    // Save to localStorage for persistence
    localStorage.setItem('deliveryAddress', address);
    if (coordinates) {
      localStorage.setItem('deliveryCoordinates', JSON.stringify(coordinates));
    }
  };
  
  // Load saved address on initial render
  useEffect(() => {
    const savedAddress = localStorage.getItem('deliveryAddress');
    const savedCoordinates = localStorage.getItem('deliveryCoordinates');
    
    if (savedAddress) {
      setDeliveryAddress(savedAddress);
    }
    
    if (savedCoordinates) {
      try {
        const coordinates = JSON.parse(savedCoordinates);
        if (Array.isArray(coordinates) && coordinates.length === 2) {
          setDeliveryCoordinates(coordinates as [number, number]);
        }
      } catch (error) {
        console.error('Error parsing saved coordinates:', error);
      }
    }
  }, []);
  
  const categoriesSliderRef = useRef<HTMLDivElement>(null);
  const popularRestaurantsSliderRef = useRef<HTMLDivElement>(null);
  const orderAgainSliderRef = useRef<HTMLDivElement>(null);
  const nearYouSliderRef = useRef<HTMLDivElement>(null);
  const specialOffersSliderRef = useRef<HTMLDivElement>(null);
  
  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoriesSliderRef.current) {
      const { current } = categoriesSliderRef;
      const scrollAmount = direction === 'left' ? -current.offsetWidth / 2 : current.offsetWidth / 2;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
  const scrollPopularRestaurants = (direction: 'left' | 'right') => {
    if (popularRestaurantsSliderRef.current) {
      const { current } = popularRestaurantsSliderRef;
      const scrollAmount = direction === 'left' ? -current.offsetWidth / 2 : current.offsetWidth / 2;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
  const scrollOrderAgain = (direction: 'left' | 'right') => {
    if (orderAgainSliderRef.current) {
      const { current } = orderAgainSliderRef;
      const scrollAmount = direction === 'left' ? -current.offsetWidth / 2 : current.offsetWidth / 2;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
  const scrollNearYou = (direction: 'left' | 'right') => {
    if (nearYouSliderRef.current) {
      const { current } = nearYouSliderRef;
      const scrollAmount = direction === 'left' ? -current.offsetWidth / 2 : current.offsetWidth / 2;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
  const scrollSpecialOffers = (direction: 'left' | 'right') => {
    if (specialOffersSliderRef.current) {
      const { current } = specialOffersSliderRef;
      const scrollAmount = direction === 'left' ? -current.offsetWidth / 2 : current.offsetWidth / 2;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
  const specialOffers = getSpecialOffersForHomepage();
  
  return (
    <div className="bg-[#f8f9fa] min-h-svh">
      {/* Modern semi-transparent overlay for navbar visibility */}
      <div className="fixed top-0 left-0 right-0 h-16 z-40  bg-linear-to-b from-black/60 via-black/40 to-transparent pointer-events-none"></div>
      <CustomerNavbar />
      <main className="pb-20">
        {/* Clean, modern hero section */}
        <section className="relative h-[600px] mb-12 -mt-px overflow-hidden">
          {/* High-quality background image with overlay */}
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80')",
              backgroundPosition: "center 40%"
            }}
          ></div>
          
          {/* Content */}
          <div className="relative z-20 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                Delicious food, <br/>
                <span className="text-[#009E73]">delivered fast.</span>
              </h1>
              <p className="text-xl text-white/90 mb-8 drop-shadow-md max-w-lg">Order from your favorite local restaurants with free delivery on your first order.</p>
              
              {/* Search bar */}
              <div className="bg-white p-1.5 rounded-xl shadow-xl flex items-center w-full max-w-xl">
                <form onSubmit={handleSearch} className="flex-1 flex items-center" id="search-form">
                  <MapPin className="ml-4 h-5 w-5 text-[#009E73]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for restaurants, dishes, or cuisines"
                    className="w-full px-3 py-3 bg-transparent border-none focus:outline-hidden text-gray-800 placeholder-gray-500"
                  />
                </form>
                <button 
                  type="submit"
                  form="search-form"
                  className="bg-[#009E73] hover:bg-[#388E3C] text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 flex items-center"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Find Food
                </button>
              </div>
              
              {/* Popular cuisines */}
              <div className="mt-8 flex flex-wrap gap-2">
                <span className="text-sm text-white mr-2 my-auto font-medium">Popular:</span>
                {['Pizza', 'Burgers', 'Sushi', 'Thai', 'Mexican'].map(cuisine => (
                  <span 
                    key={cuisine} 
                    className="px-4 py-1.5 bg-white/20 rounded-full text-white hover:bg-white/30 cursor-pointer transition-all duration-300 text-sm"
                    onClick={() => router.push(`/customer/search/results?q=${encodeURIComponent(cuisine)}&category=true`)}
                  >
                    {cuisine}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4">
          {/* Categories */}
          <section id="categories" className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Explore Categories</h2>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => scrollCategories('left')} 
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </button>
                <button 
                  onClick={() => scrollCategories('right')} 
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            </div>
            <div 
              ref={categoriesSliderRef}
              className="flex overflow-x-auto pb-4 space-x-6 scrollbar-hide snap-x"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {categories.map((cat) => (
                <div 
                  key={cat.name} 
                  className="flex-none w-20 flex flex-col items-center cursor-pointer group snap-start"
                  onClick={() => {
                    router.push(`/customer/search/results?q=${encodeURIComponent(cat.name)}&category=true`);
                  }}
                >
                  <div className="rounded-2xl shadow-md mb-2 overflow-hidden bg-white p-1 transform group-hover:scale-105 transition-all duration-300 group-hover:shadow-lg">
                    <Image src={cat.image} alt={cat.name} width={80} height={80} className="rounded-xl h-16 w-16 object-cover" />
                  </div>
                  <span className="text-xs font-medium text-gray-700 group-hover:text-[#009E73] transition-colors text-center">{cat.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Special Offers */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <Percent className="h-6 w-6 text-[#FF9800] mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">Special Offers</h2>
              </div>
              <div className="flex items-center">
                <Link href="/customer/special-offers" className="flex items-center text-[#009E73] hover:text-[#388E3C] mr-4 font-medium transition-colors">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => scrollSpecialOffers('left')} 
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-700" />
                  </button>
                  <button 
                    onClick={() => scrollSpecialOffers('right')} 
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    aria-label="Scroll right"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>
            <div 
              ref={specialOffersSliderRef}
              className="flex overflow-x-auto pb-4 space-x-6 scrollbar-hide snap-x"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {specialOffers.map((offer) => (
                <div key={offer.id} className="flex-none w-80 snap-start">
                  <SpecialOfferCard offer={offer} />
                </div>
              ))}
            </div>
          </section>

          {/* Popular Restaurants */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 text-[#FF9800] mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">Popular Restaurants</h2>
              </div>
              <div className="flex items-center">
                <Link href="/customer/popular-restaurants" className="flex items-center text-[#009E73] hover:text-[#388E3C] mr-4 font-medium transition-colors">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => scrollPopularRestaurants('left')} 
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-700" />
                  </button>
                  <button 
                    onClick={() => scrollPopularRestaurants('right')} 
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    aria-label="Scroll right"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>
            <div 
              ref={popularRestaurantsSliderRef}
              className="flex overflow-x-auto pb-4 space-x-6 scrollbar-hide snap-x"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {popularRestaurants.map((restaurant) => (
                <div key={restaurant.id} className="flex-none w-80 snap-start">
                  <RestaurantCard restaurant={restaurant} />
                </div>
              ))}
            </div>
          </section>

          {/* Order Again */}
          <section id="orders" className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <Bookmark className="h-6 w-6 text-[#FF9800] mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">Order Again</h2>
              </div>
              <div className="flex items-center">
                <Link href="/customer/order-again" className="flex items-center text-[#009E73] hover:text-[#388E3C] mr-4 font-medium transition-colors">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => scrollOrderAgain('left')} 
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-700" />
                  </button>
                  <button 
                    onClick={() => scrollOrderAgain('right')} 
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    aria-label="Scroll right"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>
            <div 
              ref={orderAgainSliderRef}
              className="flex overflow-x-auto pb-4 space-x-6 scrollbar-hide snap-x"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {orderAgainRestaurants.map((restaurant) => (
                <div key={restaurant.id} className="flex-none w-80 snap-start">
                  <RestaurantCard restaurant={restaurant} />
                </div>
              ))}
            </div>
          </section>

          {/* Near You */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <MapPin className="h-6 w-6 text-[#FF9800] mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">Near You</h2>
              </div>
              <div className="flex items-center">
                <Link href="/customer/near-you" className="flex items-center text-[#009E73] hover:text-[#388E3C] mr-4 font-medium transition-colors">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => scrollNearYou('left')} 
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-700" />
                  </button>
                  <button 
                    onClick={() => scrollNearYou('right')} 
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    aria-label="Scroll right"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>
            <div 
              ref={nearYouSliderRef}
              className="flex overflow-x-auto pb-4 space-x-6 scrollbar-hide snap-x"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {nearYouRestaurants.map((restaurant) => (
                <div key={restaurant.id} className="flex-none w-80 snap-start">
                  <RestaurantCard restaurant={restaurant} />
                </div>
              ))}
            </div>
          </section>

          {/* All Restaurants Section with Infinite Scrolling */}
          <section className="mb-12" ref={allRestaurantsRef}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <Bookmark className="h-6 w-6 text-[#009E73] mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">All Restaurants</h2>
              </div>
              <div className="flex items-center">
                <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                  <span className="text-sm text-gray-700 mr-2">Showing {visibleRestaurants.length} of {allRestaurants.length}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {visibleRestaurants.map((restaurant) => {
                // Create an adapter object that matches the RestaurantCard props interface
                const restaurantAdapter = {
                  id: restaurant.id,
                  name: restaurant.name,
                  image: restaurant.image,
                  rating: restaurant.rating,
                  cuisine: restaurant.cuisine || "Various",
                  delivery: restaurant.deliveryTime || "30-45 min",
                  deliveryFee: restaurant.deliveryFee || "$1.99",
                  distance: restaurant.distance || "1.5 mi",
                  featured: false, // Default value since it's not in the Restaurant type
                  reviewCount: restaurant.reviewCount,
                  description: restaurant.description
                };
                
                return (
                  <RestaurantCard key={restaurant.id} restaurant={restaurantAdapter} />
                );
              })}
            </div>
            
            {/* Loading indicator and intersection observer target */}
            <div ref={loadingRef} className="mt-8 flex justify-center">
              {isLoading ? (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-4 border-[#009E73]/20 border-t-[#009E73] animate-spin"></div>
                  <p className="mt-4 text-gray-600">Loading more restaurants...</p>
                </div>
              ) : hasMore ? (
                <button 
                  onClick={loadMoreRestaurants}
                  className="bg-white hover:bg-gray-50 text-[#009E73] font-medium px-6 py-3 rounded-lg shadow-xs border border-gray-200 transition-all duration-300 flex items-center"
                >
                  Load More Restaurants
                  <ChevronDown className="h-4 w-4 ml-2" />
                </button>
              ) : (
                <p className="text-gray-600 py-4">You've reached the end of the list</p>
              )}
            </div>
          </section>
        </div>
      </main>
      
      {/* Address Selection Modal */}
      <AddressSelectionModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onAddressSelected={handleAddressSelected}
      />
    </div>
  );
}
