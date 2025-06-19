"use client";

import { useState, useEffect } from "react";
import { Clock, DollarSign, Award, TrendingUp, ChevronRight, Bell, Calendar, Users, CheckCircle, AlertCircle, Package, Star, ArrowUpRight, MoreHorizontal, Search, MapPin, Phone, Mail, Settings, HelpCircle, LogOut, Plus, Utensils } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RestaurantDashboard() {
  const { restaurantId } = useParams();
  const [currentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("overview");
  const [restaurant, setRestaurant] = useState({
    id: restaurantId as string,
    name: "Loading...",
    logo: "/restaurant-logo.png",
    address: "Loading...",
    phone: "Loading...",
    email: "Loading...",
    rating: 0,
    openingHours: "Loading...",
    owner: "Loading...",
    avatar: "",
    tags: [] as string[],
    minimumPurchase: 0,
    deliveryRadius: 0,
    averagePreparationTime: "Loading..."
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        // Safely get user info from localStorage with error handling
        let userInfo;
        let userId = restaurantId;
        let token = '';
        let user = null;
        
        try {
          userInfo = localStorage.getItem('user');
          if (userInfo) {
            user = JSON.parse(userInfo);
          }
        } catch (parseError) {
          console.warn('Error parsing user info from localStorage:', parseError);
          // Continue with default values
        }
        
        // If we have valid user info and this is the current logged-in restaurant
        if (user) {
          if (user.role === 'restaurant' && user.userId) {
            userId = user.userId.toString();
          }
          // Get the authentication token
          token = user.token || '';
        }
        
        // Handle missing data gracefully
        if (!userId) {
          console.warn('No restaurant ID available, using URL parameter as fallback');
          userId = restaurantId as string;
        }
        
        // Try to fetch data even without token (public data might be available)
        const headers: HeadersInit = {
          'Content-Type': 'application/json'
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`http://localhost:3002/api/restaurants/${userId}`, {
          headers,
          // Add timeout to prevent hanging requests
          signal: AbortSignal.timeout(10000) // 10 second timeout
        });
        
        if (!response.ok) {
          throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Transform the API data to match our component's expected format
        setRestaurant({
          id: userId.toString(),
          name: data.firstName || "Restaurant Name",
          logo: "/restaurant-logo.png",
          address: data.address || "No address provided",
          phone: data.phone || "No phone provided",
          email: data.email || "No email provided",
          rating: 4.5, // Default rating if not provided
          openingHours: "9:00 AM - 10:00 PM", // Default hours if not provided
          owner: `${data.firstName || ''} ${data.lastName || ''}`.trim() || "Restaurant Owner",
          avatar: data.profilePicture || "https://cwdaust.com.au/wpress/wp-content/uploads/2015/04/placeholder-restaurant.png",
          tags: data.tags || [],
          minimumPurchase: data.minimumPurchase || 0,
          deliveryRadius: data.deliveryRadius || 0,
          averagePreparationTime: data.averagePreparationTime || "20-30 min"
        });
      } catch (err) {
        console.error('Error fetching restaurant data:', err);
        setError('Failed to load restaurant data');
        
        // Set fallback data
        setRestaurant({
          id: restaurantId as string,
          name: "Restaurant",
          logo: "/restaurant-logo.png",
          address: "123 Restaurant Street",
          phone: "+1 (555) 123-4567",
          email: "info@restaurant.com",
          rating: 4.5,
          openingHours: "9:00 AM - 10:00 PM",
          owner: "Restaurant Owner",
          avatar: "https://cwdaust.com.au/wpress/wp-content/uploads/2015/04/placeholder-restaurant.png",
          tags: ["restaurant"] as string[],
          minimumPurchase: 10,
          deliveryRadius: 5,
          averagePreparationTime: "20-30 min"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchRestaurantData();
  }, [restaurantId]);
  
  
  // Format date as "Monday, April 24, 2025"
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Current time in 12-hour format
  const currentTime = currentDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  // Mock data
  const pendingOrders = [
    { id: "#ORD-7829", customer: "Emma Wilson", items: "2× Margherita, 1× Garlic Bread", total: "$32.50", time: "10:15 AM", status: "Preparing", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
    { id: "#ORD-7830", customer: "James Brown", items: "1× Pepperoni, 1× Coke", total: "$18.99", time: "10:20 AM", status: "New", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    { id: "#ORD-7831", customer: "Sophia Garcia", items: "1× Vegetarian, 2× Water", total: "$22.50", time: "10:25 AM", status: "New", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
  ];

  const todayStats = {
    orders: 24,
    revenue: 648.75,
    avgOrderValue: 27.03,
    topItem: "Margherita Pizza"
  };

  const recentActivity = [
    { type: "order", message: "New order #ORD-7832 received", time: "2 minutes ago", icon: Package, color: "green" },
    { type: "status", message: "Order #ORD-7829 status updated to Preparing", time: "15 minutes ago", icon: Clock, color: "blue" },
    { type: "review", message: "New 5-star review received", time: "1 hour ago", icon: Star, color: "purple" },
    { type: "customer", message: "New customer registered", time: "3 hours ago", icon: Users, color: "orange" },
    { type: "order", message: "Order #ORD-7825 completed", time: "4 hours ago", icon: CheckCircle, color: "green" },
  ];

  const notifications = [
    { id: 1, message: "New order received", time: "Just now", read: false },
    { id: 2, message: "Customer left a 5-star review", time: "10 minutes ago", read: false },
    { id: 3, message: "Inventory alert: Low on mozzarella cheese", time: "1 hour ago", read: true },
  ];

  // Chart data for revenue
  const weeklyRevenue = [
    { day: "Mon", amount: 520 },
    { day: "Tue", amount: 450 },
    { day: "Wed", amount: 580 },
    { day: "Thu", amount: 620 },
    { day: "Fri", amount: 750 },
    { day: "Sat", amount: 920 },
    { day: "Sun", amount: 820 },
  ];

  // Calculate max value for chart scaling
  const maxRevenue = Math.max(...weeklyRevenue.map(day => day.amount));

  return (
    <div className="pb-12">
      {/* Enhanced Header with restaurant branding and shadcn components */}
      <Card className="mb-8 border-none shadow-md">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center">
              <Avatar className="h-16 w-16 border-2 border-[#D55E00] mr-4">
                <AvatarImage src={restaurant.avatar} alt={restaurant.name} />
                <AvatarFallback className="bg-orange-100 text-[#D55E00] text-lg font-bold">
                  {restaurant.name.split(' ').map(word => word[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl md:text-3xl">{restaurant.name}</CardTitle>
                <div className="flex items-center mt-1">
                  <div className="flex items-center mr-4">
                    <MapPin className="h-3 w-3 text-[#D55E00] mr-1" />
                    <span className="text-xs text-gray-600">{restaurant.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-[#D55E00] mr-1" />
                    <span className="text-xs text-gray-600">{restaurant.rating}/5</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 self-end md:self-auto">
              <div className="flex flex-col items-end">
                <p className="text-gray-600 flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-[#D55E00]" />
                  {formattedDate}
                </p>
                <p className="text-gray-600 flex items-center text-sm mt-1">
                  <Clock className="h-4 w-4 mr-2 text-[#D55E00]" />
                  {currentTime}
                </p>
              </div>
              
              {/* Notifications Dropdown using shadcn/ui */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="relative h-10 w-10 rounded-full">
                    <Bell className="h-5 w-5 text-gray-600" />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full"></span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
                    <span className="text-xs text-[#D55E00] cursor-pointer">Mark all as read</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto py-0">
                    {notifications.map(notification => (
                      <div key={notification.id} className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${notification.read ? '' : 'bg-orange-50'}`}>
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-medium">{notification.message}</p>
                          {!notification.read && <div className="h-2 w-2 bg-[#D55E00] rounded-full"></div>}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t border-gray-100">
                    <Link href={`/restaurant-dashboard/${restaurantId}/notifications`} className="text-sm text-[#D55E00] hover:underline">
                      View all notifications
                    </Link>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        
        {/* Quick action buttons using shadcn Button */}
        <CardFooter className="flex flex-wrap gap-2 pt-0">
          <Button variant="default" className="bg-[#D55E00] hover:bg-orange-700">
            <Package className="h-4 w-4 mr-2" />
            New Order
          </Button>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Menu Item
          </Button>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Reservations
          </Button>
          <Button variant="outline">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </CardFooter>
      </Card>

      {/* Dashboard Tabs */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab Content */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Today's Orders</p>
                    <h3 className="text-2xl font-bold mt-1">{todayStats.orders}</h3>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-xs text-green-600">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>12% more than yesterday</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Today's Revenue</p>
                    <h3 className="text-2xl font-bold mt-1">${todayStats.revenue.toFixed(2)}</h3>
                  </div>
                  <div className="p-2 bg-green-100 rounded-full">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-xs text-green-600">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>8% more than yesterday</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Avg. Order Value</p>
                    <h3 className="text-2xl font-bold mt-1">${todayStats.avgOrderValue.toFixed(2)}</h3>
                  </div>
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Award className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-xs text-red-600">
                  <ArrowUpRight className="h-3 w-3 mr-1" style={{ transform: 'rotate(90deg)' }} />
                  <span>3% less than yesterday</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Top Item</p>
                    <h3 className="text-2xl font-bold mt-1">{todayStats.topItem}</h3>
                  </div>
                  <div className="p-2 bg-orange-100 rounded-full">
                    <Utensils className="h-5 w-5 text-[#D55E00]" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-xs text-gray-600">
                  <span>Sold 18 times today</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Pending Orders & Activity Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Pending Orders</CardTitle>
                <CardDescription>Orders that need your attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left font-medium text-sm text-gray-500 pb-3">Order ID</th>
                        <th className="text-left font-medium text-sm text-gray-500 pb-3">Customer</th>
                        <th className="text-left font-medium text-sm text-gray-500 pb-3 hidden md:table-cell">Items</th>
                        <th className="text-left font-medium text-sm text-gray-500 pb-3">Total</th>
                        <th className="text-left font-medium text-sm text-gray-500 pb-3">Status</th>
                        <th className="text-left font-medium text-sm text-gray-500 pb-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingOrders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3">
                            <span className="font-medium">{order.id}</span>
                            <div className="text-xs text-gray-500">{order.time}</div>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage src={order.avatar} alt={order.customer} />
                                <AvatarFallback className="bg-orange-100 text-[#D55E00] text-xs">
                                  {order.customer.split(' ').map(word => word[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{order.customer}</span>
                            </div>
                          </td>
                          <td className="py-3 hidden md:table-cell">
                            <span className="text-sm">{order.items}</span>
                          </td>
                          <td className="py-3">
                            <span className="font-medium">{order.total}</span>
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-1 text-xs rounded-full ${order.status === 'New' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-[#D55E00]'}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3">
                            <Button variant="outline" size="sm" className="h-8">
                              <span className="text-xs">View</span>
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center border-t border-gray-100 pt-4">
                <Link href={`/restaurant-dashboard/${restaurantId}/orders`} className="text-sm text-[#D55E00] hover:underline flex items-center">
                  View all orders
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates and actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div key={index} className="flex items-start">
                        <div className={`p-2 rounded-full mr-3 bg-${activity.color}-100`}>
                          <Icon className={`h-4 w-4 text-${activity.color}-600`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
              <CardFooter className="flex justify-center border-t border-gray-100 pt-4">
                <Link href={`/restaurant-dashboard/${restaurantId}/activity`} className="text-sm text-[#D55E00] hover:underline flex items-center">
                  View all activity
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* Orders Tab Content */}
        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Orders</CardTitle>
              <CardDescription>Manage and track all your restaurant orders</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">This tab would contain a comprehensive order management system with filtering, sorting, and detailed order information.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Analytics Tab Content */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales Analytics</CardTitle>
              <CardDescription>Track your restaurant performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                {/* Weekly Revenue Chart */}
                <div className="h-full flex items-end justify-between">
                  {weeklyRevenue.map((day, index) => {
                    const height = (day.amount / maxRevenue) * 100;
                    return (
                      <div key={index} className="flex flex-col items-center">
                        <div 
                          className="w-12 bg-[#D55E00] rounded-t-md" 
                          style={{ height: `${height}%` }}
                        ></div>
                        <div className="mt-2 text-xs font-medium">{day.day}</div>
                        <div className="text-xs text-gray-500">${day.amount}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
