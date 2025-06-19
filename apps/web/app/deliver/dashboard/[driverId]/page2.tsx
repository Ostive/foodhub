"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, MapPin, Clock, DollarSign, Star, LogOut, Bell, Home, Settings, BarChart, Package, User, Phone, Navigation, CheckCircle, XCircle } from "lucide-react";

// Mock delivery driver data
const mockDrivers = {
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

export default function DriverDashboard() {
  const params = useParams();
  const router = useRouter();
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
    <div className="min-h-svh bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-xs py-4 px-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/deliver" className="text-2xl font-bold text-[#1976d2]">FoodHUB</Link>
            <span className="ml-2 text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded-full">Driver</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="text-gray-600 hover:text-gray-900">
                <Bell className="h-6 w-6" />
              </button>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">2</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full overflow-hidden">
                <Image src={driver.image} alt={driver.name} width={40} height={40} />
              </div>
              <span className="font-medium text-gray-900">{driver.name}</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900"
              title="Logout"
            >
              <LogOut className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="grow flex">
        {/* Sidebar */}
        <div className="w-20 bg-white shadow-md fixed left-0 top-[73px] bottom-0 flex flex-col items-center py-6 space-y-8">
          {navItems.map((item) => (
            <button
              key={item.name}
              className="flex flex-col items-center justify-center w-full py-2 text-gray-500 hover:text-[#1976d2]"
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs mt-1">{item.name}</span>
            </button>
          ))}
        </div>
        
        {/* Dashboard Content */}
        <div className="grow pl-20 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Status and Stats */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {driver.name}</h1>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-500 mr-1" />
                      <span className="font-medium">{driver.rating}</span>
                    </div>
                    <span className="mx-2 text-gray-300">|</span>
                    <div className="flex items-center">
                      <Package className="h-5 w-5 text-gray-500 mr-1" />
                      <span>{driver.completedDeliveries} deliveries</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 flex items-center space-x-2">
                  <span className="text-sm text-gray-600 mr-2">Status:</span>
                  <button
                    onClick={() => handleStatusChange("offline")}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${driverStatus === "offline" ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                  >
                    Offline
                  </button>
                  <button
                    onClick={() => handleStatusChange("available")}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${driverStatus === "available" ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                  >
                    Available
                  </button>
                  <button
                    onClick={() => handleStatusChange("busy")}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${driverStatus === "busy" ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    disabled={driverId !== "driver-2"}
                  >
                    Busy
                  </button>
                </div>
              </div>
              
              {/* Earnings Summary */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-gray-600">Today's Earnings</h3>
                    <DollarSign className="h-5 w-5 text-[#1976d2]" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mt-2">${driver.earnings.today.toFixed(2)}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-gray-600">This Week</h3>
                    <BarChart className="h-5 w-5 text-[#1976d2]" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mt-2">${driver.earnings.week.toFixed(2)}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-gray-600">This Month</h3>
                    <BarChart className="h-5 w-5 text-[#1976d2]" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mt-2">${driver.earnings.month.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            {/* Active Order (for driver-2) */}
            {driverId === "driver-2" && driverStatus === "busy" && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Current Delivery</h2>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {activeOrder.status === "picked_up" ? "Picked Up" : 
                     activeOrder.status === "on_the_way" ? "On The Way" : 
                     activeOrder.status === "arrived" ? "Arrived" : "Delivered"}
                  </span>
                </div>
                
                <div className="flex items-start mb-6">
                  <div className="w-16 h-16 rounded-lg overflow-hidden mr-4 shrink-0">
                    <Image 
                      src={activeOrder.restaurantImage} 
                      alt={activeOrder.restaurantName} 
                      width={64} 
                      height={64} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  
                  <div className="grow">
                    <h3 className="font-medium text-gray-900">{activeOrder.restaurantName}</h3>
                    <div className="flex items-center text-gray-500 text-sm mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{activeOrder.restaurantAddress}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-500 text-sm mt-1">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>Est. delivery time: {activeOrder.estimatedTime}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{activeOrder.paymentAmount}</div>
                    <div className="text-sm text-gray-500">{activeOrder.estimatedDistance}</div>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-4">
                  <h3 className="font-medium text-gray-900 mb-2">Customer Information</h3>
                  <div className="flex items-start">
                    <div className="grow">
                      <p className="font-medium">{activeOrder.customerName}</p>
                      <div className="flex items-center text-gray-500 text-sm mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{activeOrder.customerAddress}</span>
                      </div>
                    </div>
                    
                    <a 
                      href={`tel:${activeOrder.customerPhone}`}
                      className="bg-[#1976d2]/10 text-[#1976d2] p-2 rounded-full hover:bg-[#1976d2]/20 transition-colors"
                    >
                      <Phone className="h-5 w-5" />
                    </a>
                  </div>
                </div>
                
                {activeOrder.specialInstructions && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                    <h4 className="text-sm font-medium text-yellow-800 mb-1">Special Instructions</h4>
                    <p className="text-sm text-yellow-700">{activeOrder.specialInstructions}</p>
                  </div>
                )}
                
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  {activeOrder.status === "picked_up" ? (
                    <button
                      onClick={() => handleUpdateOrderStatus("on_the_way")}
                      className="flex-1 bg-[#1976d2] hover:bg-[#1565c0] text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      <Navigation className="h-5 w-5 mr-2" />
                      Start Navigation
                    </button>
                  ) : activeOrder.status === "on_the_way" ? (
                    <button
                      onClick={() => handleUpdateOrderStatus("arrived")}
                      className="flex-1 bg-[#1976d2] hover:bg-[#1565c0] text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Mark as Arrived
                    </button>
                  ) : activeOrder.status === "arrived" ? (
                    <button
                      onClick={() => handleUpdateOrderStatus("delivered")}
                      className="flex-1 bg-[#1976d2] hover:bg-[#1565c0] text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Complete Delivery
                    </button>
                  ) : null}
                  
                  <button
                    className="py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    <XCircle className="h-5 w-5 mr-2" />
                    Issue with Order
                  </button>
                </div>
              </div>
            )}
            
            {/* Available Orders (when driver is available) */}
            {driverStatus === "available" && showAvailableOrders && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Available Orders</h2>
                
                {availableOrdersList.length > 0 ? (
                  <div className="space-y-4">
                    {availableOrdersList.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:border-[#1976d2] transition-colors">
                        <div className="flex items-start">
                          <div className="w-16 h-16 rounded-lg overflow-hidden mr-4 shrink-0">
                            <Image 
                              src={order.restaurantImage} 
                              alt={order.restaurantName} 
                              width={64} 
                              height={64} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          
                          <div className="grow">
                            <h3 className="font-medium text-gray-900">{order.restaurantName}</h3>
                            <div className="flex items-center text-gray-500 text-sm mt-1">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span>{order.restaurantAddress}</span>
                            </div>
                            
                            <div className="flex items-center text-gray-500 text-sm mt-1">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>Est. delivery time: {order.estimatedTime}</span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-medium text-gray-900">{order.paymentAmount}</div>
                            <div className="text-sm text-gray-500">{order.estimatedDistance}</div>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-between items-center">
                          <div>
                            <span className="text-sm text-gray-500">{order.items.length} items</span>
                          </div>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                // In a real app, this would send an API request to reject the order
                                alert(`Order ${order.id} rejected. You won't see this order again.`);
                                // Remove the order from the available orders list (in a real app, this would be handled by the backend)
                                setAvailableOrdersList(availableOrdersList.filter(o => o.id !== order.id));
                              }}
                              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleAcceptOrder(order.id)}
                              className="bg-[#1976d2] hover:bg-[#1565c0] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              Accept
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No orders available at the moment. Check back soon!</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Offline Message */}
            {driverStatus === "offline" && (
              <div className="bg-white rounded-xl shadow-md p-8 mb-6 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-10 w-10 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">You're Offline</h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">Switch to "Available" status to start receiving delivery requests and earning money.</p>
                <button
                  onClick={() => handleStatusChange("available")}
                  className="bg-[#1976d2] hover:bg-[#1565c0] text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Go Online
                </button>
              </div>
            )}
            
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 shrink-0">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Payment Received</h3>
                    <p className="text-gray-500 text-sm">You received a payment of $18.50 for order #789</p>
                    <p className="text-gray-400 text-xs mt-1">Today, 10:45 AM</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 shrink-0">
                    <Star className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">New Rating</h3>
                    <p className="text-gray-500 text-sm">You received a 5-star rating from Emma Wilson</p>
                    <p className="text-gray-400 text-xs mt-1">Yesterday, 8:30 PM</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3 shrink-0">
                    <Package className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Delivery Completed</h3>
                    <p className="text-gray-500 text-sm">You completed a delivery from Burger Palace</p>
                    <p className="text-gray-400 text-xs mt-1">Yesterday, 7:15 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
