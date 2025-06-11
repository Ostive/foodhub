"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star, Clock, Bike, Heart, ChevronLeft, Plus, Minus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import CustomerNavbar from "../../../../_components/CustomerNavbar";
import { useParams } from "next/navigation";

// Import the restaurant data
import restaurantsData, { MenuItem, CustomizationOption, MenuCategory, Restaurant } from "../../../../restaurant/restaurantData";

interface SelectedOptions {
  size?: string;
  ingredients: string[];
  sauce?: string;
  quantity: number;
}

export default function ItemDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const restaurantId = params.restaurantId as string;
  const itemId = params.itemId as string;
  
  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({
    ingredients: [],
    quantity: 1
  });
  
  // Calculate the total price based on selected options
  const calculateTotalPrice = () => {
    if (!item) return "$0.00";
    
    let basePrice = parseFloat(item.price.replace('$', ''));
    
    // Add size price if selected
    if (selectedOptions.size && item.customizationOptions?.sizes) {
      const selectedSize = item.customizationOptions.sizes.find(size => size.name === selectedOptions.size);
      if (selectedSize) {
        basePrice = parseFloat(selectedSize.price.replace('$', ''));
      }
    }
    
    // Add ingredient prices
    if (item.customizationOptions?.ingredients) {
      item.customizationOptions.ingredients.forEach(ingredient => {
        if (selectedOptions.ingredients.includes(ingredient.name)) {
          basePrice += parseFloat(ingredient.price.replace('$', ''));
        }
      });
    }
    
    // Add sauce price if selected
    if (selectedOptions.sauce && item.customizationOptions?.sauces) {
      const selectedSauce = item.customizationOptions.sauces.find(sauce => sauce.name === selectedOptions.sauce);
      if (selectedSauce) {
        basePrice += parseFloat(selectedSauce.price.replace('$', ''));
      }
    }
    
    // Multiply by quantity
    basePrice *= selectedOptions.quantity;
    
    return `$${basePrice.toFixed(2)}`;
  };
  
  // Get item data from the restaurant data
  useEffect(() => {
    // Find the restaurant
    const restaurant = restaurantsData[restaurantId];
    if (!restaurant) {
      router.push('/customer');
      return;
    }
    
    // Find the item in the restaurant's menu categories
    let foundItem: MenuItem | null = null;
    for (const category of restaurant.menuCategories) {
      const menuItem = category.items.find(item => item.id === itemId);
      if (menuItem) {
        foundItem = menuItem;
        break;
      }
    }
    
    if (foundItem) {
      setItem(foundItem);
      
      // Set default options
      const newSelectedOptions: SelectedOptions = {
        ingredients: [],
        quantity: 1
      };
      
      // Set default size if available
      if (foundItem.customizationOptions?.sizes && foundItem.customizationOptions.sizes.length > 0) {
        newSelectedOptions.size = foundItem.customizationOptions.sizes[0].name;
      }
      
      // Set default ingredients if available
      if (foundItem.customizationOptions?.ingredients) {
        newSelectedOptions.ingredients = foundItem.customizationOptions.ingredients
          .filter(ingredient => ingredient.default === true)
          .map(ingredient => ingredient.name);
      }
      
      // Set default sauce if available
      if (foundItem.customizationOptions?.sauces) {
        const defaultSauce = foundItem.customizationOptions.sauces.find(sauce => sauce.default);
        if (defaultSauce) {
          newSelectedOptions.sauce = defaultSauce.name;
        }
      }
      
      setSelectedOptions(newSelectedOptions);
    } else {
      // Item not found, redirect to restaurant page
      router.push(`/customer/restaurant/${restaurantId}`);
    }
    
    setLoading(false);
  }, [restaurantId, itemId, router]);
  
  const toggleIngredient = (ingredientName: string) => {
    setSelectedOptions(prev => {
      if (prev.ingredients.includes(ingredientName)) {
        return {
          ...prev,
          ingredients: prev.ingredients.filter(name => name !== ingredientName)
        };
      } else {
        return {
          ...prev,
          ingredients: [...prev.ingredients, ingredientName]
        };
      }
    });
  };
  
  const selectSize = (sizeName: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      size: sizeName
    }));
  };
  
  const selectSauce = (sauceName: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      sauce: sauceName
    }));
  };
  
  const incrementQuantity = () => {
    setSelectedOptions(prev => ({
      ...prev,
      quantity: prev.quantity + 1
    }));
  };
  
  const decrementQuantity = () => {
    setSelectedOptions(prev => ({
      ...prev,
      quantity: Math.max(1, prev.quantity - 1)
    }));
  };
  
  const addToCart = () => {
    // In a real app, this would dispatch to a cart context or make an API call
    console.log('Adding to cart:', {
      item,
      selectedOptions,
      totalPrice: calculateTotalPrice()
    });
    
    // Navigate back to the restaurant page
    router.push(`/customer/restaurant/${restaurantId}`);
  };
  
  if (loading) {
    return (
      <div className="bg-[#f8f9fa] min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl font-medium text-gray-600">Loading...</div>
      </div>
    );
  }
  
  if (!item) {
    return (
      <div className="bg-[#f8f9fa] min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-xl font-medium text-gray-600 mb-4">Item not found</div>
        <Link 
          href={`/customer/restaurant/${restaurantId}`}
          className="bg-[#4CAF50] hover:bg-[#388E3C] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Back to Restaurant
        </Link>
      </div>
    );
  }
  
  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20">
      <CustomerNavbar />
      
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-20">
        {/* Back button */}
        <Link 
          href={`/customer/restaurant/${restaurantId}`}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft size={20} />
          <span>Back to Restaurant</span>
        </Link>
        
        {/* Item details */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          {/* Item image */}
          <div className="relative h-64 w-full">
            <Image 
              src={item.image} 
              alt={item.name} 
              fill
              className="object-cover object-center" 
            />
            <div className="absolute top-4 right-4 flex gap-1">
              {item.popular && (
                <span className="bg-[#FF9800] text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  Popular
                </span>
              )}
              {item.vegetarian && (
                <span className="bg-[#4CAF50] text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  Vegetarian
                </span>
              )}
              {item.spicy && (
                <span className="bg-[#F44336] text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  Spicy
                </span>
              )}
            </div>
          </div>
          
          {/* Item info */}
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{item.name}</h1>
            <p className="text-gray-600 mb-4">{item.description}</p>
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-bold text-[#4CAF50]">{calculateTotalPrice()}</span>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={decrementQuantity}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-full"
                >
                  <Minus size={18} />
                </button>
                <span className="text-gray-800 font-medium">{selectedOptions.quantity}</span>
                <button 
                  onClick={incrementQuantity}
                  className="bg-[#4CAF50] hover:bg-[#388E3C] text-white p-2 rounded-full"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
            
            {/* Customization options */}
            <div className="space-y-6">
              {/* Size selection */}
              {item.customizationOptions?.sizes && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Choose Size</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {item.customizationOptions.sizes.map((size, index) => (
                      <button
                        key={index}
                        onClick={() => selectSize(size.name)}
                        className={`p-3 rounded-lg border ${selectedOptions.size === size.name 
                          ? 'border-[#4CAF50] bg-[#E8F5E9] text-[#4CAF50]' 
                          : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <div className="font-medium">{size.name}</div>
                        <div className="text-sm">{size.price}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Ingredients selection */}
              {item.customizationOptions?.ingredients && item.customizationOptions.ingredients.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Customize Ingredients</h3>
                  <div className="space-y-2">
                    {item.customizationOptions.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <span className="font-medium">{ingredient.name}</span>
                          <span className="ml-2 text-sm text-gray-500">{ingredient.price}</span>
                        </div>
                        <button
                          onClick={() => toggleIngredient(ingredient.name)}
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${selectedOptions.ingredients.includes(ingredient.name) 
                            ? 'bg-[#4CAF50] text-white' 
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                        >
                          {selectedOptions.ingredients.includes(ingredient.name) ? '✓' : '+'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Sauce selection */}
              {item.customizationOptions?.sauces && item.customizationOptions.sauces.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Choose Sauce</h3>
                  <div className="space-y-2">
                    {item.customizationOptions.sauces.map((sauce, index) => (
                      <div 
                        key={index} 
                        onClick={() => selectSauce(sauce.name)}
                        className={`p-3 border rounded-lg cursor-pointer ${selectedOptions.sauce === sauce.name 
                          ? 'border-[#4CAF50] bg-[#E8F5E9]' 
                          : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium">{sauce.name}</span>
                            <span className="ml-2 text-sm text-gray-500">{sauce.price}</span>
                          </div>
                          {selectedOptions.sauce === sauce.name && (
                            <div className="w-6 h-6 rounded-full bg-[#4CAF50] text-white flex items-center justify-center">✓</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Add to cart button */}
        <button
          onClick={addToCart}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#4CAF50] hover:bg-[#388E3C] text-white px-6 py-3 rounded-full text-lg font-medium transition-colors flex items-center shadow-lg w-11/12 max-w-md justify-center"
        >
          <ShoppingBag size={20} className="mr-2" />
          Add to Cart - {calculateTotalPrice()}
        </button>
      </div>
    </div>
  );
}
