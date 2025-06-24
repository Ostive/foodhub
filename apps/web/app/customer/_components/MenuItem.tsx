"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Vegan, Flame, Star, ChevronDown, ChevronUp, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { MenuItem as MenuItemType } from "../restaurant/restaurantData";

interface MenuItemProps {
  item: MenuItemType;
  restaurantId: string;
  onAddToCart: (item: MenuItemType, quantity: number) => void;
}

export default function MenuItem({ item, restaurantId, onAddToCart }: MenuItemProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);

  // Function to check if an item is customizable
  const isCustomizable = () => {
    return !!(
      (item.customizationOptions?.sizes && item.customizationOptions.sizes.length > 0) ||
      (item.customizationOptions?.ingredients && item.customizationOptions.ingredients.length > 0) ||
      (item.customizationOptions?.sauces && item.customizationOptions.sauces.length > 0)
    );
  };

  const handleAddToCart = () => {
    // Check if the item has customization options
    if (isCustomizable()) {
      // Navigate to the item detail page for customization
      router.push(`/customer/restaurant/${restaurantId}/item/${item.id}`);
    } else {
      // Add directly to cart if no customization options
      onAddToCart(item, 1);

      // Show highlight animation
      setIsHighlighted(true);
      setTimeout(() => setIsHighlighted(false), 1500);
    }
  };

  // Toggle expanded state for description
  const toggleExpanded = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`p-4 border rounded-xl transition-all duration-300 ${isHighlighted ? 'shadow-lg border-[#009E73] bg-green-50' : 'border-gray-200 hover:shadow-md hover:border-gray-300'}`}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Item image with overlay */}
        <div className="relative h-32 sm:h-28 sm:w-28 rounded-xl overflow-hidden shrink-0 group">
          <Image
            src={item.image}
            alt={item.name}
            width={112}
            height={112}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {item.vegetarian && (
              <span className="inline-flex items-center bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded-md">
                <Vegan className="h-3 w-3 mr-1" />
              </span>
            )}
            {item.spicy && (
              <span className="inline-flex items-center bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded-md">
                <Flame className="h-3 w-3 mr-1" />
              </span>
            )}
          </div>
        </div>

        {/* Item details */}
        <div className="sm:ml-4 flex-1 mt-3 sm:mt-0">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                {item.popular && (
                  <span className="ml-2 inline-flex items-center bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
                    <Star className="h-3 w-3 mr-0.5 fill-yellow-500 stroke-yellow-500" /> Popular
                  </span>
                )}
              </div>

              <div className="flex items-center text-sm text-gray-500 mt-1">
                <span className="font-medium text-[#009E73]">{item.price}</span>
                {isCustomizable() && (
                  <span className="ml-2 inline-flex items-center text-xs text-gray-500">
                    <Info className="h-3 w-3 mr-1" /> Customizable
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description with expand/collapse */}
          <div className="mt-2">
            <p className={`text-sm text-gray-600 ${isExpanded ? '' : 'line-clamp-2'}`}>
              {item.description}
            </p>
            {item.description && item.description.length > 100 && (
              <button
                onClick={toggleExpanded}
                className="text-xs text-gray-500 flex items-center mt-1 hover:text-gray-700"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-3 w-3 mr-1" /> Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" /> Show more
                  </>
                )}
              </button>
            )}
          </div>

          {/* Add to cart button */}
          <div className="mt-3 flex justify-end">
            <button
              onClick={handleAddToCart}
              className="px-3 py-1.5 bg-[#009E73] text-white rounded-lg text-sm font-medium flex items-center hover:bg-[#008c65] transition-colors shadow-sm hover:shadow"
              aria-label={`Add ${item.name} to cart`}
            >
              <Plus className="h-4 w-4 mr-1" />
              {isCustomizable() ? 'Customize' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}