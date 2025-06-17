"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useParams, useRouter } from "next/navigation";
import { Menu, Home, Calendar, BarChart2, Settings, LogOut, Bell, ChevronDown, Utensils, Users, MessageSquare, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";

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
  // Always declare all hooks at the top level, before any conditional logic
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Reset loading state when navigation completes
  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);
  
  // Check if we're on a specific restaurant page
  const isRestaurantSpecificPage = pathname.includes('/restaurant-dashboard/') && 
                                  pathname !== '/restaurant-dashboard' && 
                                  pathname !== '/restaurant-dashboard/';
  
  // Handle navigation with loading state
  const handleNavigation = (path: string) => {
    if (pathname !== path) {
      setIsLoading(true);
      router.push(path);
    }
  };
  
  // Navigation items for main dashboard
  const navItems = [
    { name: "Restaurants", path: "/restaurant-dashboard", icon: Home },
  ];

  const isActive = (path: string) => {
    return pathname === path;
  };

  // If we're on a specific restaurant page, just render the children
  // as the restaurant-specific layout will handle the sidebar
  if (isRestaurantSpecificPage) {
    return children;
  }

  return (
    <div className="flex h-svh bg-gray-50">
      {/* Sidebar */}
      <aside className={`bg-white shadow-xl h-full fixed lg:relative z-10 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0 lg:w-20 overflow-hidden'}`}>
        <div className="p-4 flex items-center justify-between border-b">
          {sidebarOpen ? (
            <Link href="/" className="text-xl font-bold">
              <span className="text-gray-800">Food</span>
              <span className="text-[#FF9800]">You</span>
            </Link>
          ) : (
            <Link href="/" className="text-2xl font-bold">
              <span className="text-[#FF9800]">FY</span>
            </Link>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:block hidden">
            <Menu className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <button 
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center space-x-3 rounded-lg p-3 transition-colors ${isActive(item.path) ? 'text-[#FF9800] bg-orange-50' : 'text-gray-700 hover:bg-orange-50 hover:text-[#FF9800]'}`}
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
            
            <li className="pt-6">
              <button
                onClick={() => handleNavigation("/")}
                className="w-full flex items-center space-x-3 text-red-500 hover:bg-red-50 rounded-lg p-3 transition-colors"
                disabled={isLoading}
              >
                {isLoading && pathname !== "/" ? (
                  <Loader2 className="h-5 w-5 animate-spin text-red-500" />
                ) : (
                  <LogOut className="h-5 w-5" />
                )}
                {sidebarOpen && <span className="ml-3">Sign Out</span>}
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto ">
        {/* Header */}
        <header className="bg-white shadow-xs p-4 flex justify-between items-center">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden block">
            <Menu className="h-6 w-6 text-gray-500" />
          </button>
          
          <div className="flex-1"></div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" className="relative h-10 w-10 rounded-full">
              <Bell className="h-5 w-5 text-gray-500" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>
            
            {/* Profile Dropdown using shadcn/ui */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-full p-0 overflow-hidden border-2 border-[#FF9800] hover:border-orange-600 transition-colors">
                  <Avatar>
                    <AvatarFallback className="bg-orange-100 text-[#FF9800]">AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <p className="font-medium">Admin User</p>
                  <p className="text-xs text-gray-500">Platform Admin</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Users className="h-4 w-4 mr-3 text-gray-500" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-3 text-gray-500" />
                  <span>Settings</span>
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
                <Loader2 className="h-10 w-10 animate-spin text-[#FF9800]" />
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
