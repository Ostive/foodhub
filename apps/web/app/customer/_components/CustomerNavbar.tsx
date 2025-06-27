"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Search,
  ShoppingBag,
  User,
  Menu as IconMenu2,
  X as IconX,
} from "lucide-react";
import {
  Navbar,
  NavBody,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useAuth } from "@/lib/auth/auth-context";
import { LogoutButton } from "@/components/auth/logout-button";
import { useCart } from "@/contexts/CartContext";

export default function CustomerNavbar() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { getCartItemCount } = useCart();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const cartItemCount = getCartItemCount();

  // Use user data from auth context or fallback to default
  const userData = {
    name: user?.firstName ? `${user.firstName} ${user.lastName || ''}` : "User",
    avatar: user?.profilePicture || "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png",
    address: user?.address || "123 Main St, New York",
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/customer/search/results?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <>
      <Navbar className="sticky top-5 z-50 border-green-100">
        <NavBody>
          <Link href="/" className="flex items-center space-x-2">
        <Image
          src="/FOOD-LOGO.png"
          alt="FoodHUB Logo"
          width={30}
          height={30}
        />
        <span className="font-display text-3xl font-bold text-green-600">
          FoodHUB
        </span>
      </Link>

          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-1 mx-8 max-w-md rounded-full bg-green-50 px-4 py-2 items-center border border-green-100 hover:border-green-200 transition-colors"
          >
            <Search className="text-green-600 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for restaurants"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ml-2 bg-transparent flex-grow border-none focus:outline-none text-gray-700 placeholder-gray-500 focus:ring-0"
            />
          </form>

          <Link
            href="/customer/cart"
            className="relative flex items-center bg-green-600 px-4 py-2 rounded-full text-white hover:bg-green-700 transition ml-4 shadow-sm"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Cart
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-green-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border border-green-600">
                {cartItemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="relative group ml-4">
              <button className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-[#009E73]">
                  <Image src={userData.avatar} alt="User" width={40} height={40} />
                </div>
              </button>
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg py-3 px-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 origin-top-right border border-green-100">
                <div className="flex items-center space-x-3 mb-3 pb-3 border-b border-green-100">
                  <div className="h-12 w-12 rounded-full overflow-hidden">
                    <Image src={userData.avatar} alt="User" width={48} height={48} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{userData.name}</h4>
                    <div className="flex items-center text-gray-500 text-xs">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span>{userData.address}</span>
                    </div>
                  </div>
                </div>
                <Link href="/customer/profile" className="block py-2 text-sm text-gray-700 hover:text-green-600 flex items-center">
                  <User className="w-4 h-4 mr-2" /> My Profile
                </Link>
                <div className="w-full text-left py-2">
                  <LogoutButton 
                    variant="text" 
                    className="text-red-600 hover:text-red-700 flex items-center text-sm w-full" 
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2 ml-4">
              <Link
                href="/customer/login"
                className="px-5 py-2.5 rounded-full bg-[#009E73] text-white font-medium hover:bg-[#388e3c] transition flex items-center"
              >
                <User className="w-5 h-5 mr-2" /> Login
              </Link>
            </div>
          )}
        </NavBody>

        <MobileNav>
          <MobileNavHeader>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-full bg-gray-200">
              {mobileMenuOpen ? <IconX /> : <IconMenu2 />}
            </button>
            <Link href="/customer" className="font-display text-2xl font-bold text-[#009E73]">
              FoodHub
            </Link>
          </MobileNavHeader>

          <MobileNavMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
            <form onSubmit={handleSearchSubmit} className="mb-4">
              <div className="flex items-center w-full rounded-full px-3 py-2 bg-gray-100">
                <Search className="h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search for restaurants"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ml-2 w-full bg-transparent border-none focus:outline-none text-gray-800 placeholder-gray-500"
                />
              </div>
            </form>

            <Link href="/customer/cart" className="flex items-center justify-between py-3 border-b border-gray-100 w-full">
              <div className="flex items-center">
                <ShoppingBag className="w-5 h-5 mr-3 text-[#009E73]" />
                Cart
              </div>
              <div className="flex items-center">
                {cartItemCount > 0 && (
                  <span className="bg-[#009E73] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </div>
            </Link>

            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-3 py-3 border-b border-gray-100">
                  <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-[#009E73]">
                    <Image src={userData.avatar} alt="User" width={40} height={40} />
                  </div>
                  <div>
                    <p className="font-medium">{userData.name}</p>
                    <p className="text-xs text-gray-600 truncate max-w-xs">{userData.address}</p>
                  </div>
                </div>
                <Link href="/customer/profile" className="block py-3 text-[#009E73] font-semibold border-b border-gray-100">
                  My Profile
                </Link>
                <div className="w-full py-3 border-b border-gray-100">
                  <LogoutButton 
                    variant="text" 
                    className="text-red-600 font-semibold w-full text-left" 
                  />
                </div>
              </>
            ) : (
              <Link href="/customer/login" className="block py-3 text-[#009E73] font-semibold border-b border-gray-100">
                Login
              </Link>
            )}
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </>
  );
}
