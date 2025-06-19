"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useParams, useRouter } from "next/navigation";
import { Menu, Home, Calendar, BarChart2, Settings, LogOut, Bell, ChevronDown, Utensils, Users, MessageSquare, Loader2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function RestaurantDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const { restaurantId } = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  const isActive = (path: string) => {
    return pathname === path;
  };
  
  const handleNavigation = (path: string) => {
    if (pathname !== path) {
      setIsLoading(true);
      router.push(path);
    }
  };

  const navItems = [
    { name: "Dashboard", path: `/restaurant-dashboard/${restaurantId}`, icon: Home },
    { name: "Orders", path: `/restaurant-dashboard/${restaurantId}/orders`, icon: Calendar },
    { name: "Menu", path: `/restaurant-dashboard/${restaurantId}/menu`, icon: Utensils },
    { name: "Analytics", path: `/restaurant-dashboard/${restaurantId}/analytics`, icon: BarChart2 },
    { name: "Customers", path: `/restaurant-dashboard/${restaurantId}/customers`, icon: Users },
    { name: "Reviews", path: `/restaurant-dashboard/${restaurantId}/reviews`, icon: MessageSquare },
    /*{ name: "Settings", path: `/restaurant-dashboard/${restaurantId}/settings`, icon: Settings },*/
  ];

  const restaurants = {
    "bella-napoli": { name: "Bella Napoli Pizzeria", cuisine: "Italian" },
    "sushi-master": { name: "Sushi Master", cuisine: "Japanese" },
    "taco-fiesta": { name: "Taco Fiesta", cuisine: "Mexican" },
    "burger-joint": { name: "Burger Joint", cuisine: "American" }
  };
  
type RestaurantKey = keyof typeof restaurants;

const restaurant =
  typeof restaurantId === "string" && restaurantId in restaurants
    ? restaurants[restaurantId as RestaurantKey]
    : { name: "Restaurant", cuisine: "Unknown" };

  return (
    <div className="flex h-svh bg-gray-50 ">
      {/* Sidebar */}
      <aside className={`bg-white shadow-xl h-full fixed lg:relative z-10 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0 lg:w-20 overflow-hidden'}`}>
        <div className="p-4 flex items-center justify-between border-b">
          {sidebarOpen ? (
            <Link href="/" className="text-xl font-bold text-[#D55E00]">
              <span className="text-gray-800">Food</span>
              <span className="text-[#D55E00]">HUB</span>
            </Link>
          ) : (
            <Link href="/restaurant-dashboard" className="text-2xl font-bold text-[#D55E00]">FH</Link>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:block hidden">
            <Menu className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        
        {/* Restaurant Info */}
        <div className={`p-4 border-b ${!sidebarOpen && 'hidden'}`}>
          <h2 className="font-medium truncate">{restaurant.name}</h2>
          <p className="text-xs text-gray-500">{restaurant.cuisine} Cuisine</p>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <button 
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center space-x-3 rounded-lg p-3 transition-colors ${isActive(item.path) ? 'text-[#D55E00] bg-orange-50' : 'text-gray-700 hover:bg-orange-50 hover:text-[#D55E00]'}`}
                    disabled={isLoading}
                  >
                    {isLoading && pathname !== item.path ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                    {sidebarOpen && <span className="ml-3">{item.name}</span>}
                  </button>
                </li>
              );
            })}
            
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-xs p-4 flex justify-between items-center">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden block">
            <Menu className="h-6 w-6 text-gray-500" />
          </button>
          <div className="relative w-full max-w-xl mx-4 hidden md:block">
            <input 
              type="text" 
              placeholder="Search orders, menu items..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#D55E00] focus:border-transparent"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" className="relative h-10 w-10 rounded-full">
              <Bell className="h-5 w-5 text-gray-500" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>
            
            {/* Profile Dropdown using shadcn/ui */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-full p-0 overflow-hidden border-2 border-[#D55E00] hover:border-orange-600 transition-colors">
                  <Avatar>
                    <AvatarFallback className="bg-orange-100 text-[#D55E00]">
                      {restaurant.name.split(' ').map(word => word[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <p className="font-medium">{restaurant.name}</p>
                  <p className="text-xs text-gray-500">Restaurant Admin</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href={`/restaurant-dashboard/${restaurantId}/settings`}
                    className="flex items-center w-full cursor-pointer"
                  >
                    <Settings className="h-4 w-4 mr-3 text-gray-500" />
                    <span>Account</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <LogOut className="h-4 w-4 mr-3" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {isLoading && (
            <div className="fixed inset-0 bg-white/50 backdrop-blur-xs flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                <Loader2 className="h-10 w-10 animate-spin text-[#D55E00]" />
                <p className="mt-4 text-gray-600">Loading...</p>
              </div>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
