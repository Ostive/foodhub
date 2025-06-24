"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star, Clock, Bike, Heart, ChevronLeft, Plus, Minus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import CustomerNavbar from "../../../../../_components/CustomerNavbar";
import { Restaurant, Dish } from "@/lib/api/restaurants-api";
import { useCart } from "@/contexts/CartContext";

interface DishDetailsClientProps {
  restaurant: Restaurant | null;
  dish: Dish | null;
  error: string | null;
}

interface SelectedOptions {
  size?: string;
  ingredients: string[];
  sauce?: string;
  quantity: number;
  specialInstructions?: string;
}

export default function DishDetailsClient({ 
  restaurant, 
  dish,
  error 
}: DishDetailsClientProps) {
  const router = useRouter();
  
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({
    ingredients: [],
    quantity: 1,
    specialInstructions: ""
  });
  
  const { addToCart } = useCart();
  
  // Calculate the total price based on selected options
  const calculateTotalPrice = () => {
    if (!dish) return "$0.00";
    
    let basePrice = dish.cost || 0;
    
    // Multiply by quantity
    const total = basePrice * selectedOptions.quantity;
    
    return `$${total.toFixed(2)}`;
  };
  
  // Handle adding or removing ingredients
  const toggleIngredient = (ingredient: string) => {
    setSelectedOptions(prev => {
      if (prev.ingredients.includes(ingredient)) {
        return {
          ...prev,
          ingredients: prev.ingredients.filter(i => i !== ingredient)
        };
      } else {
        return {
          ...prev,
          ingredients: [...prev.ingredients, ingredient]
        };
      }
    });
  };
  
  // Handle selecting a size
  const selectSize = (size: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      size
    }));
  };
  
  // Handle selecting a sauce
  const selectSauce = (sauce: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      sauce
    }));
  };
  
  // Handle quantity changes
  const updateQuantity = (change: number) => {
    setSelectedOptions(prev => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + change)
    }));
  };
  
  // Handle special instructions
  const updateSpecialInstructions = (instructions: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      specialInstructions: instructions
    }));
  };
  
  // Add item to cart
  const addItemToCart = () => {
    if (!dish || !restaurant) return;
    
    addToCart({
      id: dish.id.toString(),
      name: dish.name,
      price: dish.cost,
      image: dish.imageUrl || '',
      quantity: selectedOptions.quantity,
      specialInstructions: selectedOptions.specialInstructions,
      options: {
        size: selectedOptions.size,
        ingredients: selectedOptions.ingredients,
        sauce: selectedOptions.sauce
      },
      restaurantId: restaurant.id.toString(),
      restaurantName: restaurant.name
    });
    
    // Navigate back to restaurant page
    router.push(`/customer/restaurant/${restaurant.id}`);
  };
  
  // Error state
  if (error || !dish || !restaurant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CustomerNavbar />
        <div className="pt-24 px-4 max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {error ? "Error Loading Item" : "Item Not Found"}
            </h2>
            <p className="text-gray-600 mb-6">
              {error || "We couldn't find the item you're looking for."}
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
    <div className="min-h-screen bg-gray-50">
      <CustomerNavbar />
      
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-16">
        {/* Back button */}
        <Link 
          href={`/customer/restaurant/${restaurant.id}`}
          className="inline-flex items-center text-gray-600 mb-6 hover:text-[#009E73] transition-colors"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to {restaurant.name}
        </Link>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Item Image */}
            <div className="md:w-1/2 relative">
              <div className="relative h-64 md:h-full w-full">
                <Image
                  src={dish.imageUrl || '/images/dish-placeholder.jpg'}
                  alt={`${dish.name} - menu item`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            {/* Item Details */}
            <div className="md:w-1/2 p-6 md:p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{dish.name}</h1>
              
              <p className="text-gray-500 mt-2 mb-4">{dish.description}</p>
              
              <div className="flex items-center mb-6">
                <span className="text-2xl font-bold text-[#009E73]">{calculateTotalPrice()}</span>
                <div className="ml-auto flex items-center border rounded-lg overflow-hidden">
                  <button 
                    onClick={() => updateQuantity(-1)}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                    disabled={selectedOptions.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 font-medium">{selectedOptions.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(1)}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Customization Options */}
              {dish.category && (
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {dish.category}
                  </span>
                </div>
              )}
              
              {/* Special Instructions */}
              <div className="mb-6">
                <label htmlFor="special-instructions" className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions
                </label>
                <textarea
                  id="special-instructions"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009E73] focus:border-transparent"
                  placeholder="E.g., No onions, extra spicy, etc."
                  rows={3}
                  value={selectedOptions.specialInstructions}
                  onChange={(e) => updateSpecialInstructions(e.target.value)}
                />
              </div>
              
              {/* Add to Cart Button */}
              <button
                onClick={addItemToCart}
                className="w-full bg-[#009E73] hover:bg-[#008c67] text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Add to Cart - {calculateTotalPrice()}
              </button>
            </div>
          </div>
        </div>
        
        {/* Nutritional Information */}
        {dish.nutritionalInfo && (
          <div className="mt-8 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Nutritional Information</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <span className="block text-sm text-gray-500">Calories</span>
                <span className="block text-lg font-bold">{dish.nutritionalInfo.calories || 'N/A'}</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <span className="block text-sm text-gray-500">Protein</span>
                <span className="block text-lg font-bold">{dish.nutritionalInfo.protein || 'N/A'}</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <span className="block text-sm text-gray-500">Carbs</span>
                <span className="block text-lg font-bold">{dish.nutritionalInfo.carbs || 'N/A'}</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <span className="block text-sm text-gray-500">Fat</span>
                <span className="block text-lg font-bold">{dish.nutritionalInfo.fat || 'N/A'}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Allergens */}
        {dish.allergens && dish.allergens.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Allergen Information</h2>
            <div className="flex flex-wrap gap-2">
              {dish.allergens.map((allergen, index) => (
                <span key={index} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                  {allergen}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
