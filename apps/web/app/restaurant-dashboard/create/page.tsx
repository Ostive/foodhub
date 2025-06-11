"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Plus, Trash2, Clock, MapPin, Phone, Mail, Globe, DollarSign } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CreateRestaurantPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    cuisine: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    openingHours: {
      monday: { open: "08:00", close: "22:00", isOpen: true },
      tuesday: { open: "08:00", close: "22:00", isOpen: true },
      wednesday: { open: "08:00", close: "22:00", isOpen: true },
      thursday: { open: "08:00", close: "22:00", isOpen: true },
      friday: { open: "08:00", close: "22:00", isOpen: true },
      saturday: { open: "10:00", close: "23:00", isOpen: true },
      sunday: { open: "10:00", close: "22:00", isOpen: true },
    },
    deliveryFee: "2.99",
    minimumOrder: "10.00",
    averageDeliveryTime: "30-45",
    tags: [],
  });
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Handle opening hours changes
  const handleHoursChange = (day: string, field: string, value: string) => {
    setFormData({
      ...formData,
      openingHours: {
        ...formData.openingHours,
        [day]: {
          ...formData.openingHours[day as keyof typeof formData.openingHours],
          [field]: value,
        },
      },
    });
  };
  
  // Handle day open/closed toggle
  const handleDayToggle = (day: string) => {
    setFormData({
      ...formData,
      openingHours: {
        ...formData.openingHours,
        [day]: {
          ...formData.openingHours[day as keyof typeof formData.openingHours],
          isOpen: !formData.openingHours[day as keyof typeof formData.openingHours].isOpen,
        },
      },
    });
  };
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real app, you would send the data to your API
      console.log("Submitting restaurant data:", formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a mock ID for the new restaurant
      const newRestaurantId = `restaurant-${Date.now()}`;
      
      // Redirect to the new restaurant dashboard
      router.push(`/restaurant-dashboard/${newRestaurantId}`);
    } catch (error) {
      console.error("Error creating restaurant:", error);
      setIsSubmitting(false);
    }
  };
  
  // Handle adding a new tag
  const [newTag, setNewTag] = useState("");
  
  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag("");
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center mb-6">
        <Link href="/restaurant-dashboard" className="mr-4">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create New Restaurant</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Restaurant Image */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Restaurant Image</h2>
          <div className="flex items-center space-x-6">
            <div className="relative w-40 h-40 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              {previewImage ? (
                <Image 
                  src={previewImage} 
                  alt="Restaurant preview" 
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
              <p className="text-sm text-gray-600 mb-2">Upload a high-quality image of your restaurant (recommended size: 1200x800px)</p>
              <label className="inline-flex items-center px-4 py-2 bg-[#4CAF50] hover:bg-[#388E3C] text-white rounded-lg cursor-pointer transition-colors">
                <Upload className="h-4 w-4 mr-2" />
                <span>Upload Image</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>
        
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name*</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                placeholder="e.g. Bella Napoli Pizzeria"
              />
            </div>
            
            <div>
              <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 mb-1">Cuisine Type*</label>
              <select
                id="cuisine"
                name="cuisine"
                value={formData.cuisine}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              >
                <option value="">Select cuisine type</option>
                <option value="Italian">Italian</option>
                <option value="Japanese">Japanese</option>
                <option value="Mexican">Mexican</option>
                <option value="Chinese">Chinese</option>
                <option value="Indian">Indian</option>
                <option value="American">American</option>
                <option value="Thai">Thai</option>
                <option value="Mediterranean">Mediterranean</option>
                <option value="French">French</option>
                <option value="Greek">Greek</option>
                <option value="Spanish">Spanish</option>
                <option value="Korean">Korean</option>
                <option value="Vietnamese">Vietnamese</option>
                <option value="Middle Eastern">Middle Eastern</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Seafood">Seafood</option>
                <option value="Steakhouse">Steakhouse</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Dessert">Dessert</option>
                <option value="Cafe">Cafe</option>
                <option value="Other">Other</option>
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
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                placeholder="Describe your restaurant, specialties, and what makes it unique..."
              ></textarea>
            </div>
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="h-4 w-4 inline-block mr-1" />
                Address*
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                placeholder="e.g. 123 Main Street, City, Country"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                <Phone className="h-4 w-4 inline-block mr-1" />
                Phone Number*
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                placeholder="e.g. +1 234 567 8900"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                <Mail className="h-4 w-4 inline-block mr-1" />
                Email Address*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                placeholder="e.g. restaurant@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                <Globe className="h-4 w-4 inline-block mr-1" />
                Website (optional)
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                placeholder="e.g. https://www.restaurant.com"
              />
            </div>
          </div>
        </div>
        
        {/* Opening Hours */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Opening Hours</h2>
          <div className="space-y-4">
            {Object.entries(formData.openingHours).map(([day, hours]) => (
              <div key={day} className="flex items-center space-x-4">
                <div className="w-28">
                  <span className="font-medium capitalize">{day}</span>
                </div>
                
                <div className="flex-1 flex items-center space-x-4">
                  {hours.isOpen ? (
                    <>
                      <input
                        type="time"
                        value={hours.open}
                        onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                      />
                      <span>to</span>
                      <input
                        type="time"
                        value={hours.close}
                        onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                      />
                    </>
                  ) : (
                    <span className="text-gray-500">Closed</span>
                  )}
                </div>
                
                <button
                  type="button"
                  onClick={() => handleDayToggle(day)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${hours.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                >
                  {hours.isOpen ? 'Open' : 'Closed'}
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Delivery Information */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Delivery Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="deliveryFee" className="block text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="h-4 w-4 inline-block mr-1" />
                Delivery Fee ($)
              </label>
              <input
                type="number"
                id="deliveryFee"
                name="deliveryFee"
                value={formData.deliveryFee}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                placeholder="e.g. 2.99"
              />
            </div>
            
            <div>
              <label htmlFor="minimumOrder" className="block text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="h-4 w-4 inline-block mr-1" />
                Minimum Order ($)
              </label>
              <input
                type="number"
                id="minimumOrder"
                name="minimumOrder"
                value={formData.minimumOrder}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                placeholder="e.g. 10.00"
              />
            </div>
            
            <div>
              <label htmlFor="averageDeliveryTime" className="block text-sm font-medium text-gray-700 mb-1">
                <Clock className="h-4 w-4 inline-block mr-1" />
                Average Delivery Time (min)
              </label>
              <input
                type="text"
                id="averageDeliveryTime"
                name="averageDeliveryTime"
                value={formData.averageDeliveryTime}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                placeholder="e.g. 30-45"
              />
            </div>
          </div>
        </div>
        
        {/* Tags */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Tags</h2>
          <p className="text-sm text-gray-600 mb-4">Add tags to help customers find your restaurant (e.g. Vegan, Gluten-Free, Family-Friendly)</p>
          
          <div className="flex items-center mb-4">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              placeholder="Add a tag"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-[#4CAF50] hover:bg-[#388E3C] text-white rounded-r-lg transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <div key={index} className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-gray-700">{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-gray-500 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {formData.tags.length === 0 && (
              <span className="text-sm text-gray-500">No tags added yet</span>
            )}
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Link 
            href="/restaurant-dashboard"
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
                Creating...
              </>
            ) : (
              'Create Restaurant'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
