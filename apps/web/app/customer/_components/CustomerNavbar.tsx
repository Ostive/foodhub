"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Search,
  ShoppingBag,
  User,
  LogOut,
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
import { isLoggedIn } from "../_utils/authState";

export default function CustomerNavbarNew() {
  const router = useRouter();

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const cartItemCount = 3;

  const userData = {
    name: "John Doe",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    address: "123 Main St, New York",
  };

  useEffect(() => {
    setIsUserLoggedIn(isLoggedIn.value);
    const interval = setInterval(() => {
      if (isLoggedIn.value !== isUserLoggedIn) {
        setIsUserLoggedIn(isLoggedIn.value);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [isUserLoggedIn]);

  const handleLogout = () => {
    isLoggedIn.value = false;
    router.refresh();
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
      <Navbar className="bg-transparent">
        <NavBody>
          <Link href="/customer" className="font-display text-3xl font-bold text-[#4CAF50]">
            FoodHUB
          </Link>

          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-1 mx-8 max-w-md rounded-full bg-gray-100 px-4 py-2 items-center"
          >
            <Search className="text-gray-600 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for restaurants"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ml-2 bg-transparent flex-grow border-none focus:outline-none text-gray-700 placeholder-gray-400"
            />
          </form>

          <Link
            href="/customer/cart"
            className="relative flex items-center bg-white/20 px-4 py-2 rounded-full text-white hover:bg-white/30 transition ml-4"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Cart
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#4CAF50] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          {isUserLoggedIn ? (
            <div className="relative group ml-4">
              <button className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-[#4CAF50]">
                  <Image src={userData.avatar} alt="User" width={40} height={40} />
                </div>
              </button>
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg py-3 px-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 origin-top-right">
                <div className="flex items-center space-x-3 mb-3 pb-3 border-b border-gray-100">
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
                <Link href="/customer/profile" className="block py-2 text-sm text-gray-700 hover:text-[#4CAF50] flex items-center">
                  <User className="w-4 h-4 mr-2" /> My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-2 text-sm text-red-600 hover:text-red-700 flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/customer/login"
              className="ml-4 px-5 py-2.5 rounded-full bg-[#4CAF50] text-white font-medium hover:bg-[#388e3c] transition flex items-center"
            >
              <User className="w-5 h-5 mr-2" /> Login
            </Link>
          )}
        </NavBody>

        <MobileNav>
          <MobileNavHeader>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-full bg-gray-200">
              {mobileMenuOpen ? <IconX /> : <IconMenu2 />}
            </button>
            <Link href="/customer" className="font-display text-2xl font-bold text-[#4CAF50]">
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

            <Link href="/customer/cart" className="flex items-center py-3 border-b border-gray-100">
              <ShoppingBag className="w-5 h-5 mr-3 text-[#4CAF50]" />
              Cart
              {cartItemCount > 0 && (
                <span className="ml-auto bg-[#4CAF50] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {isUserLoggedIn ? (
              <>
                <div className="flex items-center space-x-3 py-3 border-b border-gray-100">
                  <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-[#4CAF50]">
                    <Image src={userData.avatar} alt="User" width={40} height={40} />
                  </div>
                  <div>
                    <p className="font-medium">{userData.name}</p>
                    <p className="text-xs text-gray-600 truncate max-w-xs">{userData.address}</p>
                  </div>
                </div>
                <Link href="/customer/profile" className="block py-3 text-[#4CAF50] font-semibold border-b border-gray-100">
                  My Profile
                </Link>
                <button onClick={handleLogout} className="w-full text-left py-3 text-red-600 font-semibold border-b border-gray-100">
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/customer/login" className="block py-3 text-[#4CAF50] font-semibold border-b border-gray-100">
                Login
              </Link>
            )}
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </>
  );
}
