"use client";

import { useState, useEffect, useRef } from "react";
import SpecialOfferCard from "./SpecialOfferCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import restaurantsData from "../restaurant/restaurantData";
import { MenuItem, OfferType } from "../restaurant/restaurantData";

// Define the type for offer items
interface OfferItem {
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
}

// Get menu items with offers from restaurant data
const getMenuItemsWithOffers = (): OfferItem[] => {
  const itemsWithOffers: OfferItem[] = [];
  
  for (const restaurantId in restaurantsData) {
    const restaurant = restaurantsData[restaurantId];
    
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
  
  return itemsWithOffers;
};

// Map our internal offer types to display types for the card
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

export default function SpecialOffers({ showTitle = true }: { showTitle?: boolean }) {
  const [offers, setOffers] = useState<OfferItem[]>(getMenuItemsWithOffers());
  const [refreshKey, setRefreshKey] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Force refresh on component mount
  useEffect(() => {
    // Increment the key to force re-render
    setRefreshKey(prev => prev + 1);
  }, []);
  
  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const { current } = sliderRef;
      const scrollAmount = direction === 'left' ? -current.offsetWidth / 2 : current.offsetWidth / 2;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {showTitle && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Special Offers</h2>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => scroll('left')} 
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
              <button 
                onClick={() => scroll('right')} 
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </div>
        )}
        
        <div 
          ref={sliderRef}
          className="flex overflow-x-auto pb-4 space-x-6 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {offers.map((offer) => (
            <div 
              key={`${offer.id}-${refreshKey}`} 
              className="flex-none w-80 snap-start"
            >
              <SpecialOfferCard offer={offer} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
