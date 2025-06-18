"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useParams, useRouter } from "next/navigation";
import {
  Menu,
  Calendar,
  BarChart2,
  Users,
  MessageSquare,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { ChevronRight, MapPin, Clock, DollarSign, Star, LogOut, Bell, Home, Settings, BarChart, Package, User, Phone, Navigation, CheckCircle, XCircle } from "lucide-react";


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
// Mock delivery driver data
export const mockDrivers = {
  "driver-1": {
    id: "driver-1",
    name: "Michael Rodriguez",
    phone: "+1 (555) 987-6543",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4.8,
    completedDeliveries: 342,
    vehicle: "Honda Civic",
    licensePlate: "ABC-1234",
    status: "available", // available, busy, offline
    earnings: {
      today: 85.50,
      week: 645.75,
      month: 2450.25
    }
  },
  "driver-2": {
    id: "driver-2",
    name: "Sarah Chen",
    phone: "+1 (555) 123-4567",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4.9,
    completedDeliveries: 512,
    vehicle: "Toyota Prius",
    licensePlate: "XYZ-5678",
    status: "busy", // available, busy, offline
    earnings: {
      today: 92.25,
      week: 712.50,
      month: 2875.00
    }
  }
};

// Mock available orders
const availableOrders = [
  {
    id: "order-789",
    restaurantName: "Taco Fiesta",
    restaurantAddress: "789 Taco St, New York, NY 10003",
    restaurantImage: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80",
    customerName: "Emma Wilson",
    customerAddress: "456 Park Ave, New York, NY 10022",
    estimatedDistance: "2.3 miles",
    estimatedTime: "15-20 min",
    paymentAmount: "$12.50",
    items: [
      { name: "Beef Tacos", quantity: 2 },
      { name: "Chicken Quesadilla", quantity: 1 },
      { name: "Chips & Guacamole", quantity: 1 }
    ]
  },
  {
    id: "order-790",
    restaurantName: "Sushi Express",
    restaurantAddress: "123 Sushi Blvd, New York, NY 10001",
    restaurantImage: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80",
    customerName: "David Johnson",
    customerAddress: "789 Broadway, New York, NY 10003",
    estimatedDistance: "1.8 miles",
    estimatedTime: "10-15 min",
    paymentAmount: "$15.75",
    items: [
      { name: "California Roll", quantity: 2 },
      { name: "Spicy Tuna Roll", quantity: 1 },
      { name: "Miso Soup", quantity: 2 }
    ]
  }
];

// Mock active order for driver-2
const activeOrder = {
  id: "order-456",
  status: "on_the_way", // picked_up, on_the_way, arrived, delivered
  restaurantName: "Pizza Palace",
  restaurantAddress: "456 Pizza St, New York, NY 10002",
  restaurantImage: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80",
  customerName: "John Doe",
  customerAddress: "123 Main St, Apt 4B, New York, NY 10001",
  customerPhone: "+1 (555) 234-5678",
  estimatedDistance: "1.5 miles",
  estimatedTime: "10-15 min",
  paymentAmount: "$18.50",
  items: [
    { name: "Margherita Pizza (Large)", quantity: 1 },
    { name: "Pepperoni Pizza (Medium)", quantity: 1 },
    { name: "Garlic Bread", quantity: 1 },
    { name: "Soda (2L)", quantity: 1 }
  ],
  specialInstructions: "Please leave at door. Code for building: 1234"
};

// Navigation items
const navItems = [
  { name: "Home", icon: Home, href: "/" },
  { name: "Orders", icon: Package, href: "/orders" },
  { name: "Earnings", icon: DollarSign, href: "/earnings" },
  { name: "Account", icon: User, href: "/account" },
  { name: "Stats", icon: BarChart, href: "/stats" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

export default function DeliverDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const driverId = params.driverId as string;
    
    const [driver, setDriver] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [driverStatus, setDriverStatus] = useState<"available" | "busy" | "offline">("offline");
    const [showAvailableOrders, setShowAvailableOrders] = useState(false);
    const [availableOrdersList, setAvailableOrdersList] = useState(availableOrders);
    
    // Check if user is logged in
    useEffect(() => {
      const checkAuth = () => {
        const driverData = localStorage.getItem("deliveryDriver");
        if (!driverData) {
          router.push("/deliver/login");
          return;
        }
        
        const parsedData = JSON.parse(driverData);
        if (!parsedData.isLoggedIn || parsedData.id !== driverId) {
          router.push("/deliver/login");
        }
      };
      
      checkAuth();
    }, [driverId, router]);
    
    // Fetch driver data
    useEffect(() => {
      const fetchDriverData = () => {
        setLoading(true);
        
        // Simulate API call
        setTimeout(() => {
          const driverData = mockDrivers[driverId as keyof typeof mockDrivers];
          
          if (driverData) {
            setDriver(driverData);
            // Ensure the status is one of the allowed types
            if (driverData.status === "available" || driverData.status === "busy" || driverData.status === "offline") {
              setDriverStatus(driverData.status);
            } else {
              setDriverStatus("offline"); // Default to offline if invalid status
            }
          } else {
            setError("Driver not found");
          }
          
          setLoading(false);
        }, 1000);
      };
      
      fetchDriverData();
    }, [driverId]);
    useEffect(() => {
      setIsLoading(false);
    }, [pathname]);
    const handleStatusChange = (status: "available" | "busy" | "offline") => {
      setDriverStatus(status);
      
      // In a real app, this would update the status in the backend
      if (status === "available") {
        setShowAvailableOrders(true);
      } else {
        setShowAvailableOrders(false);
      }
    };
    
    const handleLogout = () => {
      localStorage.removeItem("deliveryDriver");
      router.push("/deliver/login");
    };
    
    const handleAcceptOrder = (orderId: string) => {
      // In a real app, this would send an API request to accept the order
      alert(`Order ${orderId} accepted! You are now on your way to pick up the order.`);
      setDriverStatus("busy");
      setShowAvailableOrders(false);
    };
    
    const handleUpdateOrderStatus = (status: "picked_up" | "on_the_way" | "arrived" | "delivered") => {
      // In a real app, this would update the order status in the backend
      alert(`Order status updated to: ${status}`);
    };

  const isActive = (path: string) => pathname === path;

  const handleNavigation = (path: string) => {
    if (pathname !== path) {
      setIsLoading(true);
      router.push(path);
    }
  };

  const navItems = [
    { name: "Dashboard", path: `/deliver/dashboard/${driverId}`, icon: Home },
    { name: "Orders", path: `/deliver/dashboard/${driverId}/orders`, icon: Calendar },
    { name: "Analytics", path: `/deliver/dashboard/${driverId}/analytics`, icon: BarChart2 },
    { name: "Customers", path: `/deliver/dashboard/${driverId}/customers`, icon: Users },
    { name: "Reviews", path: `/deliver/dashboard/${driverId}/reviews`, icon: MessageSquare },
  ];

  if (loading) {
    return (
      <div className="min-h-svh bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1976d2] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (error || !driver) {
    return (
      <div className="min-h-svh bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error || "Driver not found"}</p>
          <button
            onClick={() => router.push("/deliver/login")}
            className="bg-[#1976d2] hover:bg-[#1565c0] text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-svh bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-xl h-full fixed lg:relative z-10 transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-0 lg:w-20 overflow-hidden"
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b">
          <Link href="/" className="text-xl font-bold text-[#FF9800]">
            {sidebarOpen ? (
              <>
                <span className="text-gray-800">Food</span>
                <span className="text-[#FF9800]">HUB</span>
              </>
            ) : (
              <>FH</>
            )}
          </Link>
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
                    className={`w-full flex items-center space-x-3 rounded-lg p-3 transition-colors ${
                      isActive(item.path)
                        ? "text-[#FF9800] bg-orange-50"
                        : "text-gray-700 hover:bg-orange-50 hover:text-[#FF9800]"
                    }`}
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
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#FF9800] focus:border-transparent"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" className="relative h-10 w-10 rounded-full">
              <Bell className="h-5 w-5 text-gray-500" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full p-0 overflow-hidden border-2 border-[#FF9800] hover:border-orange-600 transition-colors"
                >
                  <Image src={driver.image} alt={driver.name} width={40} height={40} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <span className="font-medium text-gray-900">{driver.name}</span>
                  <p className="text-xs text-gray-500">Account</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href={`/deliver/dashboard/${driverId}/settings`}
                    className="flex items-center w-full cursor-pointer"
                  >
                    <Settings className="h-4 w-4 mr-3 text-gray-500" />
                    <span>Account Settings</span>
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
