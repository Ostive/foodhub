"use client";

import Image from "next/image";
import { Heart, Star, Clock, Bike, Tag, Percent } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface OfferProps {
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

interface SpecialOfferCardProps {
  offer: OfferProps;
}

export default function SpecialOfferCard({ offer }: SpecialOfferCardProps) {
  const [liked, setLiked] = useState(false);
  
  // Get tag color based on offer type
  const getTagColor = (offerType: string) => {
    switch(offerType) {
      case 'discount':
        return 'bg-[#FF9800]';
      case 'promo':
        return 'bg-[#E91E63]';
      case 'deal':
        return 'bg-[#673AB7]';
      default:
        return 'bg-[#FF9800]';
    }
  };

  // Get tag text based on offer type
  const getTagText = (offerType: string) => {
    switch(offerType) {
      case 'discount':
        return offer.discountValue ? `${offer.discountValue}% OFF` : 'DISCOUNT';
      case 'promo':
        return 'FREE ITEM';
      case 'deal':
        return 'BUY 1 GET 1';
      default:
        return 'SPECIAL OFFER';
    }
  };
  
  return (
    <Link href={`/customer/restaurant/${offer.restaurantId}`} className="block">
      <div className="flex flex-col group cursor-pointer">
        {/* Image container with like button, rating and offer tag */}
        <div className="relative h-48 mb-2">
          <div className="rounded-xl overflow-hidden h-full w-full shadow-md">
            <Image 
              src={offer.image} 
              alt={offer.itemName} 
              width={400} 
              height={300} 
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
            />
          </div>
          
          {/* Like button */}
          <button 
            className={`absolute top-3 right-3 z-20 p-2 rounded-full shadow-md transition-colors ${liked ? 'bg-[#FF9800]/90 text-white' : 'bg-white/90 text-gray-700 hover:text-[#FF9800]'}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setLiked(!liked);
            }}
          >
            <Heart size={18} className={liked ? 'fill-current' : ''} />
          </button>
          
          {/* Rating badge */}
          <div className="absolute bottom-3 left-3 z-20 bg-white/90 backdrop-blur-xs rounded-full px-2 py-1 shadow-md flex items-center">
            <Star size={14} className="mr-1 text-[#FF9800] fill-[#FF9800]" />
            <span className="text-xs font-medium text-gray-800">{offer.rating}</span>
            <span className="text-xs text-gray-500 ml-1">({offer.reviewCount})</span>
          </div>
          
          {/* Special Offer Tag */}
          <div className={`absolute top-3 left-3 z-20 ${getTagColor(offer.offerType)} text-white rounded-lg px-3 py-1 shadow-md flex items-center`}>
            {offer.offerType === 'discount' ? (
              <Percent size={14} className="mr-1" />
            ) : (
              <Tag size={14} className="mr-1" />
            )}
            <span className="text-xs font-bold">{getTagText(offer.offerType)}</span>
          </div>
        </div>
        
        {/* Content below image */}
        <div className="px-1 py-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{offer.restaurantName}</h3>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-500">
              <Clock size={14} className="mr-1" />
              <span>{offer.delivery}</span>
            </div>
            <div className="flex items-center text-sm font-medium text-gray-900">
              <Bike size={14} className="mr-1 text-[#4CAF50]" />
              <span>{offer.deliveryFee}</span>
            </div>
          </div>
          
          {offer.minOrderValue && (
            <div className="mt-2 bg-gray-100 p-2 rounded text-center">
              <span className="text-xs text-gray-500">Min. order {offer.minOrderValue}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
