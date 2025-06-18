"use client";

import { useState } from "react";
import CustomerNavbar from "../_components/CustomerNavbar";
import SpecialOfferCard from "../_components/SpecialOfferCard";
import restaurantsData from "../restaurant/restaurantData";
import { MenuItem, OfferType } from "../restaurant/restaurantData";
import Link from "next/link";
import { ArrowLeft, Filter } from "lucide-react";

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
    
    // Skip if restaurant is undefined
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

export default function SpecialOffersPage() {
  const [offers] = useState<OfferItem[]>(getMenuItemsWithOffers());
  const [filterType, setFilterType] = useState<string>("all");
  
  const filteredOffers = filterType === "all" 
    ? offers 
    : offers.filter(offer => offer.offerType === filterType);
  
  return (
    <div className="bg-[#f8f9fa] min-h-svh">
      <CustomerNavbar />
      <main className="pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center mb-6">
            <Link href="/customer" className="mr-4">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Special Offers</h1>
              <p className="text-gray-600 text-sm">Discover the best deals from your favorite restaurants</p>
            </div>
          </div>
          
          {/* Filter buttons */}
          <div className="mb-6 flex items-center overflow-x-auto hide-scrollbar pb-2">
            <div className="flex items-center bg-white rounded-full shadow-xs p-1 mr-4">
              <Filter size={16} className="text-gray-500 ml-2" />
              <span className="text-sm font-medium text-gray-700 mr-2 ml-1">Filter:</span>
            </div>
            <button 
              onClick={() => setFilterType("all")} 
              className={`px-4 py-2 rounded-full text-sm font-medium mr-2 whitespace-nowrap ${filterType === "all" ? 'bg-[#009E73] text-white' : 'bg-white text-gray-700'}`}
            >
              All Offers
            </button>
            <button 
              onClick={() => setFilterType("deal")} 
              className={`px-4 py-2 rounded-full text-sm font-medium mr-2 whitespace-nowrap ${filterType === "deal" ? 'bg-[#673AB7] text-white' : 'bg-white text-gray-700'}`}
            >
              Buy One Get One
            </button>
            <button 
              onClick={() => setFilterType("discount")} 
              className={`px-4 py-2 rounded-full text-sm font-medium mr-2 whitespace-nowrap ${filterType === "discount" ? 'bg-[#FF9800] text-white' : 'bg-white text-gray-700'}`}
            >
              Discounts
            </button>
            <button 
              onClick={() => setFilterType("promo")} 
              className={`px-4 py-2 rounded-full text-sm font-medium mr-2 whitespace-nowrap ${filterType === "promo" ? 'bg-[#E91E63] text-white' : 'bg-white text-gray-700'}`}
            >
              Free Items
            </button>
          </div>
          
          {/* Grid of offers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredOffers.map((offer) => (
              <div key={offer.id}>
                <SpecialOfferCard offer={offer} />
              </div>
            ))}
          </div>
          
          {filteredOffers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No offers found for this category.</p>
              <button 
                onClick={() => setFilterType("all")} 
                className="mt-4 px-6 py-2 bg-[#009E73] text-white rounded-full font-medium"
              >
                View All Offers
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
