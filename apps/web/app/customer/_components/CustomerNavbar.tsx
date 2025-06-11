"use client";

import Link from "next/link";
import { User, ShoppingBag, Menu, Search, Bell, ChevronDown, X, MapPin, Home, Clock, Heart, Gift, LogOut } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AddressSelectionModal from "./AddressSelectionModal";

// Import the auth state
import { isLoggedIn } from "../_utils/authState";

export default function CustomerNavbar({ forceLight = false }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // Local state to trigger re-renders
  const [userAddress, setUserAddress] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [savedLocations, setSavedLocations] = useState([
    { id: 1, name: "Home", address: "123 Main St, New York" },
    { id: 2, name: "Work", address: "456 Office Ave, New York" },
  ]);
  const debounceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  
  // Update local state when global auth state changes
  useEffect(() => {
    // Initial state
    setIsUserLoggedIn(isLoggedIn.value);
    
    // Check auth state periodically
    const interval = setInterval(() => {
      if (isUserLoggedIn !== isLoggedIn.value) {
        setIsUserLoggedIn(isLoggedIn.value);
      }
    }, 500);
    
    return () => clearInterval(interval);
  }, [isUserLoggedIn]);

  // Load saved address from localStorage on component mount
  useEffect(() => {
    const savedAddress = localStorage.getItem("userAddress");
    if (savedAddress) {
      setUserAddress(savedAddress);
    }
  }, []);

  // Function to open the address modal
  const openAddressModal = () => {
    setIsAddressModalOpen(true);
  };

  // Function to close the address modal
  const closeAddressModal = () => {
    setIsAddressModalOpen(false);
  };

  // Handle address selection from the modal
  const handleAddressSelected = (address: string, coordinates?: [number, number]) => {
    setUserAddress(address);
    localStorage.setItem("userAddress", address);
    closeAddressModal();
  };
  
  // Mock user data
  const userData = {
    name: "John Doe",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    address: userAddress || "123 Main St, New York"
  };
  
  // Mock cart data
  const cartItemCount = 3;

  const handleLogout = () => {
    isLoggedIn.value = false;
    router.refresh();
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchInput = e.currentTarget.querySelector('input');
    if (searchInput && searchInput.value.trim()) {
      router.push(`/customer/search/results?q=${encodeURIComponent(searchInput.value)}`);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className={`${forceLight ? 'bg-white shadow-md' : 'bg-black/40 backdrop-blur-sm'} transition-all duration-300`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/customer" className="flex items-center">
                <span className={`font-display text-3xl font-bold ${forceLight ? 'text-[#4CAF50]' : 'text-white'} transition-colors duration-300`}>Foodyou</span>
              </Link>
              
              {/* Search Bar (Desktop) */}
              <div className="hidden md:flex flex-1 max-w-md mx-8">
                <form onSubmit={handleSearch} className="w-full">
                  <div className={`flex items-center w-full rounded-full px-3 py-2 ${forceLight ? 'bg-gray-100' : 'bg-white/20 backdrop-blur-sm'}`}>
                    <Search className={`h-5 w-5 ${forceLight ? 'text-gray-500' : 'text-white/80'}`} />
                    <input 
                      type="text" 
                      placeholder="Search for restaurants" 
                      className={`ml-2 w-full bg-transparent border-none focus:outline-none ${forceLight ? 'text-gray-800 placeholder-gray-500' : 'text-white placeholder-white/70'}`}
                    />
                  </div>
                </form>
              </div>
              
              {/* Right Side Actions (Desktop) */}
              <div className="hidden md:flex items-center space-x-4">
                {/* Location - Exact match to the hero section style */}
                <button 
                  onClick={openAddressModal}
                  className={`flex items-center px-4 py-2 rounded-full ${forceLight ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : 'bg-white/20 text-white hover:bg-white/30'} transition-colors relative`}
                >
                  <MapPin className="h-5 w-5 text-[#4CAF50] mr-2 flex-shrink-0" />
                  <span className="font-medium truncate max-w-[150px]">
                    {userAddress ? userAddress : "Set delivery address"}
                  </span>
                </button>
                {/* Cart */}
                <Link 
                  href="/customer/cart" 
                  className={`flex items-center px-4 py-2 rounded-full ${forceLight ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : 'bg-white/20 text-white hover:bg-white/30'} transition-colors relative`}
                >
                  <ShoppingBag className="w-5 h-5 mr-2" /> 
                  <span className="font-medium">Cart</span>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#4CAF50] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartItemCount}</span>
                  )}
                </Link>
                
                {/* Login/Profile */}
                {isUserLoggedIn ? (
                  <div className="relative group">
                    <button className="flex items-center space-x-2">
                      <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-[#4CAF50]">
                        <Image src={userData.avatar} alt="User profile" width={40} height={40} />
                      </div>
                    </button>
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg py-3 px-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right">
                      <div className="flex items-center space-x-3 mb-3 pb-3 border-b border-gray-100">
                        <div className="h-12 w-12 rounded-full overflow-hidden">
                          <Image src={userData.avatar} alt="User profile" width={48} height={48} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{userData.name}</h4>
                          <div className="flex items-center text-gray-500 text-xs">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span>{userData.address}</span>
                          </div>
                        </div>
                      </div>
                      <Link href="/customer/profile" className="block py-2 text-sm text-gray-700 hover:text-[#4CAF50] flex items-center">
                        <User className="w-4 h-4 mr-2" /> My Profile
                      </Link>
                      <Link href="/customer/orders" className="block py-2 text-sm text-gray-700 hover:text-[#4CAF50] flex items-center">
                        <Clock className="w-4 h-4 mr-2" /> Order History
                      </Link>
                      <Link href="/customer/favorites" className="block py-2 text-sm text-gray-700 hover:text-[#4CAF50] flex items-center">
                        <Heart className="w-4 h-4 mr-2" /> Saved Restaurants
                      </Link>
                      <div className="pt-2 mt-2 border-t border-gray-100">
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left py-2 text-sm text-red-600 hover:text-red-700 flex items-center"
                        >
                          <LogOut className="w-4 h-4 mr-2" /> Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link 
                    href="/customer/login"
                    className="flex items-center px-5 py-2.5 rounded-full bg-[#4CAF50] text-white font-medium hover:bg-[#388e3c] transition-colors shadow-md"
                  >
                    <User className="w-5 h-5 mr-2" /> Login
                  </Link>
                )}
              </div>
              
              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center">
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={`p-2 rounded-full ${forceLight ? 'text-gray-800' : 'text-white'}`}
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Address Selection Modal */}
      <AddressSelectionModal 
        isOpen={isAddressModalOpen} 
        onClose={closeAddressModal} 
        onAddressSelected={handleAddressSelected}
      />
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-16 pb-6 px-4 md:hidden overflow-y-auto">
          <div className="flex flex-col space-y-4 mt-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="flex items-center w-full rounded-full px-3 py-2 bg-gray-100">
                <Search className="h-5 w-5 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search for restaurants" 
                  className="ml-2 w-full bg-transparent border-none focus:outline-none text-gray-800 placeholder-gray-500"
                />
              </div>
            </form>
            
            {/* Location (Mobile) */}
            <button 
              onClick={openAddressModal}
              className={`flex items-center justify-between py-3 border-b border-gray-100 w-full ${!userAddress ? 'bg-[#4CAF50]/10' : ''}`}
            >
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-3 text-[#4CAF50]" />
                <span className={`font-medium ${!userAddress ? 'text-[#4CAF50]' : 'text-gray-800'}`}>
                  Your Location
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 truncate max-w-[180px]">
                  {userAddress || "Set Your Location"}
                </span>
                {userAddress && <ChevronDown className="w-4 h-4 ml-1 text-gray-400" />}
              </div>
            </button>
            
            {/* Mobile Navigation Links */}
            <Link href="/customer" className="flex items-center py-3 border-b border-gray-100">
              <Home className="w-5 h-5 mr-3 text-[#4CAF50]" /> 
              <span className="text-gray-800 font-medium">Home</span>
            </Link>
            
            <Link href="/customer/cart" className="flex items-center py-3 border-b border-gray-100">
              <ShoppingBag className="w-5 h-5 mr-3 text-[#4CAF50]" /> 
              <span className="text-gray-800 font-medium">Cart</span>
              {cartItemCount > 0 && (
                <span className="ml-auto bg-[#4CAF50] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartItemCount}</span>
              )}
            </Link>
            
            {/* User Profile Section */}
            {isUserLoggedIn ? (
              <>
                <div className="flex items-center space-x-3 py-3 border-b border-gray-100">
                  <div className="h-10 w-10 rounded-full overflow-hidden">
                    <Image src={userData.avatar} alt="User profile" width={40} height={40} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{userData.name}</h4>
                    <div className="flex items-center text-gray-500 text-xs">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span>{userData.address}</span>
                    </div>
                  </div>
                </div>
                
                <Link href="/customer/profile" className="flex items-center py-3 border-b border-gray-100">
                  <User className="w-5 h-5 mr-3 text-[#4CAF50]" /> 
                  <span className="text-gray-800 font-medium">My Profile</span>
                </Link>
                
                <Link href="/customer/orders" className="flex items-center py-3 border-b border-gray-100">
                  <Clock className="w-5 h-5 mr-3 text-[#4CAF50]" /> 
                  <span className="text-gray-800 font-medium">Order History</span>
                </Link>
                
                <Link href="/customer/favorites" className="flex items-center py-3 border-b border-gray-100">
                  <Heart className="w-5 h-5 mr-3 text-[#4CAF50]" /> 
                  <span className="text-gray-800 font-medium">Saved Restaurants</span>
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="flex items-center py-3 text-red-600"
                >
                  <LogOut className="w-5 h-5 mr-3" /> 
                  <span className="font-medium">Sign Out</span>
                </button>
              </>
            ) : (
              <Link 
                href="/customer/login"
                className="mt-4 w-full flex items-center justify-center px-5 py-3 rounded-full bg-[#4CAF50] text-white font-medium"
              >
                <User className="w-5 h-5 mr-2" /> Login
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
