"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Upload, Plus, Trash2, Clock, DollarSign, Tag, Check, X, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type Category = {
  id: string;
  name: string;
};

type PersonalizationOption = {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  options: {
    id: string;
    name: string;
    price: number;
  }[];
};

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  prepTime: string;
  isAvailable: boolean;
  isPopular: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  allergens: string[];
  personalizationOptions: PersonalizationOption[];
};

export default function ManageMenuItemPage() {
  const router = useRouter();
  const params = useParams();
  const restaurantId = params.restaurantId as string;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [itemId, setItemId] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Mock categories - in a real app, these would come from an API
  const [categories, setCategories] = useState<Category[]>([
    { id: "pizza", name: "Pizza" },
    { id: "sides", name: "Sides" },
    { id: "drinks", name: "Drinks" },
    { id: "desserts", name: "Desserts" },
    { id: "specials", name: "Specials" },
  ]);
  
  // Form state
  const [formData, setFormData] = useState<MenuItem>({
    id: "",
    name: "",
    description: "",
    price: 0,
    image: "",
    categoryId: "",
    prepTime: "15-20",
    isAvailable: true,
    isPopular: false,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    allergens: [],
    personalizationOptions: [],
  });
  
  // Check if we're editing an existing item
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const editItemId = searchParams.get("edit");
    
    if (editItemId) {
      setIsEditing(true);
      setItemId(editItemId);
      
      // In a real app, you would fetch the item data from your API
      // For now, we'll use mock data
      const mockItem: MenuItem = {
        id: editItemId,
        name: "Margherita Pizza",
        description: "Classic pizza with tomato sauce, mozzarella, and basil",
        price: 12.99,
        image: "https://images.unsplash.com/photo-1548365328-8b849e6c7b85?auto=format&fit=crop&w=400&q=80",
        categoryId: "pizza",
        prepTime: "15-20",
        isAvailable: true,
        isPopular: true,
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: false,
        allergens: ["Dairy", "Gluten"],
        personalizationOptions: [
          {
            id: "size",
            name: "Size",
            type: "single",
            required: true,
            options: [
              { id: "small", name: "Small (10 inch)", price: 0 },
              { id: "medium", name: "Medium (12 inch)", price: 2 },
              { id: "large", name: "Large (14 inch)", price: 4 }
            ]
          },
          {
            id: "toppings",
            name: "Extra Toppings",
            type: "multiple",
            required: false,
            options: [
              { id: "pepperoni", name: "Pepperoni", price: 1.5 },
              { id: "mushrooms", name: "Mushrooms", price: 1 },
              { id: "olives", name: "Olives", price: 1 },
              { id: "onions", name: "Onions", price: 0.5 }
            ]
          }
        ]
      };
      
      setFormData(mockItem);
      setPreviewImage(mockItem.image);
    }
  }, []);
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "number" ? parseFloat(value) : value,
      });
    }
  };
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setFormData({
          ...formData,
          image: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle allergen changes
  const [newAllergen, setNewAllergen] = useState("");
  
  const handleAddAllergen = () => {
    if (newAllergen.trim() && !formData.allergens.includes(newAllergen.trim())) {
      setFormData({
        ...formData,
        allergens: [...formData.allergens, newAllergen.trim()],
      });
      setNewAllergen("");
    }
  };
  
  const handleRemoveAllergen = (allergenToRemove: string) => {
    setFormData({
      ...formData,
      allergens: formData.allergens.filter(allergen => allergen !== allergenToRemove),
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real app, you would send the data to your API
      console.log("Submitting menu item data:", formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      setShowSuccessMessage(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
        
        // Redirect back to menu page
        router.push(`/restaurant-dashboard/${restaurantId}/menu`);
      }, 2000);
    } catch (error) {
      console.error("Error saving menu item:", error);
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center mb-6">
        <Link href={`/restaurant-dashboard/${restaurantId}/menu`} className="mr-4">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{isEditing ? "Edit Menu Item" : "Add Menu Item"}</h1>
      </div>
      
      {showSuccessMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6 flex items-center">
          <Check className="h-5 w-5 mr-2 text-green-600" />
          <span>{isEditing ? "Menu item updated successfully!" : "Menu item added successfully!"}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Item Image */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Item Image</h2>
          <div className="flex items-center space-x-6">
            <div className="relative w-40 h-40 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              {previewImage ? (
                <Image 
                  src={previewImage} 
                  alt="Item preview" 
                  fill 
                  style={{ objectFit: 'cover' }} 
                />
              ) : (
                <div className="text-gray-400 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2" />
                  <span className="text-sm">No image</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">Upload a high-quality image of your menu item (recommended size: 800x600px)</p>
              <label className="inline-flex items-center px-4 py-2 bg-[#4CAF50] hover:bg-[#388E3C] text-white rounded-lg cursor-pointer transition-colors">
                <Upload className="h-4 w-4 mr-2" />
                <span>Upload Image</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>
        
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Item Name*</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-gray-50 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:outline-none transition-all duration-200"
                placeholder="e.g. Margherita Pizza"
              />
            </div>
            
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-gray-50 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:outline-none transition-all duration-200"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-4 py-2 bg-gray-50 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:outline-none transition-all duration-200"
                placeholder="Describe your menu item..."
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="h-4 w-4 inline-block mr-1" />
                Price*
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                step="0.01"
                min="0"
                className="w-full px-4 py-2 bg-gray-50 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:outline-none transition-all duration-200"
                placeholder="e.g. 12.99"
              />
            </div>
            
            <div>
              <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700 mb-1">
                <Clock className="h-4 w-4 inline-block mr-1" />
                Preparation Time (min)
              </label>
              <input
                type="text"
                id="prepTime"
                name="prepTime"
                value={formData.prepTime}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-50 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:outline-none transition-all duration-200"
                placeholder="e.g. 15-20"
              />
            </div>
          </div>
        </div>
        
        {/* Item Properties */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-lg font-semibold mb-4">Item Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isAvailable"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-[#4CAF50] focus:ring-[#4CAF50] border-gray-300 rounded"
                />
                <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-700">
                  Available (can be ordered)
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPopular"
                  name="isPopular"
                  checked={formData.isPopular}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-[#4CAF50] focus:ring-[#4CAF50] border-gray-300 rounded"
                />
                <label htmlFor="isPopular" className="ml-2 block text-sm text-gray-700">
                  Mark as Popular
                </label>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isVegetarian"
                  name="isVegetarian"
                  checked={formData.isVegetarian}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-[#4CAF50] focus:ring-[#4CAF50] border-gray-300 rounded"
                />
                <label htmlFor="isVegetarian" className="ml-2 block text-sm text-gray-700">
                  Vegetarian
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isVegan"
                  name="isVegan"
                  checked={formData.isVegan}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-[#4CAF50] focus:ring-[#4CAF50] border-gray-300 rounded"
                />
                <label htmlFor="isVegan" className="ml-2 block text-sm text-gray-700">
                  Vegan
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isGlutenFree"
                  name="isGlutenFree"
                  checked={formData.isGlutenFree}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-[#4CAF50] focus:ring-[#4CAF50] border-gray-300 rounded"
                />
                <label htmlFor="isGlutenFree" className="ml-2 block text-sm text-gray-700">
                  Gluten Free
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Personalization Options */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-lg font-semibold mb-4">Personalization Options</h2>
          <p className="text-sm text-gray-600 mb-4">Add customization options for customers (e.g., sizes, toppings, add-ons)</p>
          
          {formData.personalizationOptions.map((option, optionIndex) => (
            <div key={option.id} className="mb-6 pb-6 border-b border-gray-100 last:border-0 last:pb-0 last:mb-0">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-800">{option.name}</h3>
                <button
                  type="button"
                  onClick={() => {
                    const updatedOptions = [...formData.personalizationOptions];
                    updatedOptions.splice(optionIndex, 1);
                    setFormData({...formData, personalizationOptions: updatedOptions});
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Option Type</label>
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        checked={option.type === 'single'}
                        onChange={() => {
                          const updatedOptions = [...formData.personalizationOptions];
                          updatedOptions[optionIndex].type = 'single';
                          setFormData({...formData, personalizationOptions: updatedOptions});
                        }}
                        className="h-4 w-4 text-[#4CAF50] focus:ring-[#4CAF50]"
                      />
                      <span className="ml-2 text-sm text-gray-700">Single choice</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        checked={option.type === 'multiple'}
                        onChange={() => {
                          const updatedOptions = [...formData.personalizationOptions];
                          updatedOptions[optionIndex].type = 'multiple';
                          setFormData({...formData, personalizationOptions: updatedOptions});
                        }}
                        className="h-4 w-4 text-[#4CAF50] focus:ring-[#4CAF50]"
                      />
                      <span className="ml-2 text-sm text-gray-700">Multiple choices</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Required?</label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={option.required}
                      onChange={() => {
                        const updatedOptions = [...formData.personalizationOptions];
                        updatedOptions[optionIndex].required = !option.required;
                        setFormData({...formData, personalizationOptions: updatedOptions});
                      }}
                      className="h-4 w-4 text-[#4CAF50] focus:ring-[#4CAF50] rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Customer must select an option</span>
                  </label>
                </div>
              </div>
              
              <div className="mt-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Choices</h4>
                {option.options.map((choice, choiceIndex) => (
                  <div key={choice.id} className="flex items-center space-x-3 mb-2">
                    <input
                      type="text"
                      value={choice.name}
                      onChange={(e) => {
                        const updatedOptions = [...formData.personalizationOptions];
                        updatedOptions[optionIndex].options[choiceIndex].name = e.target.value;
                        setFormData({...formData, personalizationOptions: updatedOptions});
                      }}
                      placeholder="Choice name"
                      className="flex-1 px-3 py-1.5 bg-gray-50 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:outline-none transition-all duration-200"
                    />
                    <div className="flex items-center w-32">
                      <span className="text-gray-500 mr-1">+$</span>
                      <input
                        type="number"
                        value={choice.price}
                        onChange={(e) => {
                          const updatedOptions = [...formData.personalizationOptions];
                          updatedOptions[optionIndex].options[choiceIndex].price = parseFloat(e.target.value);
                          setFormData({...formData, personalizationOptions: updatedOptions});
                        }}
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="w-full px-2 py-1.5 bg-gray-50 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:outline-none transition-all duration-200"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updatedOptions = [...formData.personalizationOptions];
                        updatedOptions[optionIndex].options.splice(choiceIndex, 1);
                        setFormData({...formData, personalizationOptions: updatedOptions});
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => {
                    const updatedOptions = [...formData.personalizationOptions];
                    updatedOptions[optionIndex].options.push({
                      id: `option-${Date.now()}`,
                      name: '',
                      price: 0
                    });
                    setFormData({...formData, personalizationOptions: updatedOptions});
                  }}
                  className="mt-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg flex items-center"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Choice
                </button>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => {
              setFormData({
                ...formData,
                personalizationOptions: [
                  ...formData.personalizationOptions,
                  {
                    id: `personalization-${Date.now()}`,
                    name: '',
                    type: 'single',
                    required: false,
                    options: [{ id: `option-${Date.now()}`, name: '', price: 0 }]
                  }
                ]
              });
            }}
            className="mt-4 px-4 py-2 bg-[#4CAF50] hover:bg-[#388E3C] text-white rounded-lg flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Personalization Option
          </button>
        </div>
        
        {/* Allergens */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-lg font-semibold mb-4">Allergens</h2>
          <p className="text-sm text-gray-600 mb-4">Add any allergens that customers should be aware of</p>
          
          <div className="flex items-center mb-4">
            <input
              type="text"
              value={newAllergen}
              onChange={(e) => setNewAllergen(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              placeholder="Add an allergen (e.g. Dairy, Nuts)"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAllergen())}
            />
            <button
              type="button"
              onClick={handleAddAllergen}
              className="px-4 py-2 bg-[#4CAF50] hover:bg-[#388E3C] text-white rounded-r-lg transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {formData.allergens.map((allergen, index) => (
              <div key={index} className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                <Tag className="h-3 w-3 mr-1 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{allergen}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveAllergen(allergen)}
                  className="ml-2 text-gray-500 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {formData.allergens.length === 0 && (
              <span className="text-sm text-gray-500">No allergens added yet</span>
            )}
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Link 
            href={`/restaurant-dashboard/${restaurantId}/menu`}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-[#4CAF50] hover:bg-[#388E3C] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {isEditing ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              isEditing ? 'Update Item' : 'Add Item'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
