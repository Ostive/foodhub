"use client";

import { useState } from "react";
import Image from "next/image";
import { Save, Upload, Clock, MapPin, Phone, Mail, Globe, ChevronRight, CreditCard, Bell, Shield, User } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  
  // Mock data for restaurant profile
  const restaurantProfile = {
    name: "Pizza Restaurant",
    logo: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=200&q=80",
    coverImage: "https://images.unsplash.com/photo-1548365328-8b849e6c7b85?auto=format&fit=crop&w=800&q=80",
    description: "We serve authentic Italian pizzas made with fresh ingredients and traditional recipes. Our wood-fired oven gives our pizzas a unique flavor that you won't find anywhere else.",
    address: "123 Main Street, New York, NY 10001",
    phone: "+1 (555) 123-4567",
    email: "contact@pizzarestaurant.com",
    website: "www.pizzarestaurant.com",
    openingHours: [
      { day: "Monday", hours: "11:00 AM - 10:00 PM" },
      { day: "Tuesday", hours: "11:00 AM - 10:00 PM" },
      { day: "Wednesday", hours: "11:00 AM - 10:00 PM" },
      { day: "Thursday", hours: "11:00 AM - 10:00 PM" },
      { day: "Friday", hours: "11:00 AM - 11:00 PM" },
      { day: "Saturday", hours: "11:00 AM - 11:00 PM" },
      { day: "Sunday", hours: "12:00 PM - 9:00 PM" },
    ],
    deliveryRadius: 5,
    minimumOrder: 15,
    averagePreparationTime: 20,
  };

  // Tabs for settings
  const tabs = [
    { id: "profile", name: "Restaurant Profile", icon: User },
    { id: "payment", name: "Payment Methods", icon: CreditCard },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "security", name: "Security", icon: Shield },
  ];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Settings</h1>
        <p className="text-gray-600">Manage your restaurant settings and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
          <nav>
            <ul>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-left ${activeTab === tab.id ? 'bg-orange-50 text-[#FF9800] border-l-4 border-[#FF9800]' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      <span>{tab.name}</span>
                      <ChevronRight className={`h-4 w-4 ml-auto ${activeTab === tab.id ? 'text-[#FF9800]' : 'text-gray-400'}`} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl shadow-xs border border-gray-100 p-6">
          {activeTab === "profile" && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Restaurant Profile</h2>
              
              {/* Cover Image */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                <div className="relative h-48 rounded-xl overflow-hidden bg-gray-100">
                  <Image 
                    src={restaurantProfile.coverImage} 
                    alt="Restaurant cover"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <button className="bg-white text-gray-800 px-4 py-2 rounded-lg flex items-center">
                      <Upload className="h-4 w-4 mr-2" />
                      Change Cover
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Logo and Basic Info */}
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="md:w-1/3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Logo</label>
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-gray-100 mx-auto">
                    <Image 
                      src={restaurantProfile.logo} 
                      alt="Restaurant logo"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <button className="bg-white text-gray-800 px-3 py-1 rounded-lg text-sm flex items-center">
                        <Upload className="h-3 w-3 mr-1" />
                        Change
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
                      <input
                        type="text"
                        id="restaurantName"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#FF9800] focus:border-[#FF9800]"
                        defaultValue={restaurantProfile.name}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        id="description"
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#FF9800] focus:border-[#FF9800]"
                        defaultValue={restaurantProfile.description}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      Address
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#FF9800] focus:border-[#FF9800]"
                      defaultValue={restaurantProfile.address}
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#FF9800] focus:border-[#FF9800]"
                      defaultValue={restaurantProfile.phone}
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#FF9800] focus:border-[#FF9800]"
                      defaultValue={restaurantProfile.email}
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <Globe className="h-4 w-4 mr-2 text-gray-400" />
                      Website
                    </label>
                    <input
                      type="url"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#FF9800] focus:border-[#FF9800]"
                      defaultValue={restaurantProfile.website}
                    />
                  </div>
                </div>
              </div>
              
              {/* Business Hours */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Hours</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {restaurantProfile.openingHours.map((schedule) => (
                    <div key={schedule.day} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                      <span className="font-medium">{schedule.day}</span>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        <input
                          type="text"
                          className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-[#FF9800] focus:border-[#FF9800] text-sm"
                          defaultValue={schedule.hours}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Delivery Settings */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Radius (miles)</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#FF9800] focus:border-[#FF9800]"
                      defaultValue={restaurantProfile.deliveryRadius}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order ($)</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#FF9800] focus:border-[#FF9800]"
                      defaultValue={restaurantProfile.minimumOrder}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Avg. Preparation Time (min)</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#FF9800] focus:border-[#FF9800]"
                      defaultValue={restaurantProfile.averagePreparationTime}
                    />
                  </div>
                </div>
              </div>
              
              {/* Save Button */}
              <div className="flex justify-end">
                <button className="bg-[#FF9800] hover:bg-[#e65100] text-white px-6 py-2 rounded-lg flex items-center">
                  <Save className="h-5 w-5 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === "payment" && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Methods</h2>
              <p className="text-gray-500 py-12 text-center">Payment methods configuration would go here</p>
            </div>
          )}

          {activeTab === "notifications" && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Settings</h2>
              <p className="text-gray-500 py-12 text-center">Notification settings would go here</p>
            </div>
          )}

          {activeTab === "security" && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h2>
              <p className="text-gray-500 py-12 text-center">Security settings would go here</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
