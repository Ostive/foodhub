"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, ChevronRight, Search, Filter, Package, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import CustomerNavbar from "../../_components/CustomerNavbar";

type OrderStatus = "delivered" | "processing" | "cancelled";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: string;
  image: string;
}

interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  date: string;
  total: string;
  status: OrderStatus;
  items: OrderItem[];
  deliveryAddress: string;
  deliveryFee: string;
}

interface OrdersClientProps {
  initialOrders: Order[];
  error: string | null;
}

export default function OrdersClient({ initialOrders, error }: OrdersClientProps) {
  const [activeTab, setActiveTab] = useState<"all" | "active" | "past">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  
  // Filter orders based on active tab and search query
  const filteredOrders = initialOrders.filter(order => {
    // Filter by tab
    if (activeTab === "active" && order.status !== "processing") return false;
    if (activeTab === "past" && order.status === "processing") return false;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.restaurantName.toLowerCase().includes(query) ||
        order.id.toLowerCase().includes(query) ||
        order.items.some(item => item.name.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  // Format date with consistent format for server/client hydration
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'Date unavailable';
      
      // Parse the date string
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.error('Invalid date in formatDate:', dateString);
        return 'Date unavailable';
      }
      
      // Use explicit date formatting to avoid hydration errors
      const day = date.getDate();
      const month = date.getMonth(); // 0-indexed
      const year = date.getFullYear();
      
      // Create consistent date format (MMM DD, YYYY)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[month]} ${day}, ${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date unavailable';
    }
  };
  
  // Get status icon and color
  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case "delivered":
        return { 
          icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
          text: "Delivered",
          color: "text-green-500"
        };
      case "processing":
        return { 
          icon: <Clock className="w-5 h-5 text-blue-500" />,
          text: "Processing",
          color: "text-blue-500"
        };
      case "cancelled":
        return { 
          icon: <XCircle className="w-5 h-5 text-red-500" />,
          text: "Cancelled",
          color: "text-red-500"
        };
      default:
        return { 
          icon: <AlertCircle className="w-5 h-5 text-gray-500" />,
          text: "Unknown",
          color: "text-gray-500"
        };
    }
  };
  
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <CustomerNavbar />
      
      <div className="max-w-4xl mx-auto px-4 pt-24">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Package className="h-7 w-7 text-primary mr-2" />
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        </div>
        
        {/* Search and filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
          
          {/* Tabs */}
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                activeTab === "all"
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              } border border-gray-300`}
            >
              All Orders
            </button>
            <button
              onClick={() => setActiveTab("active")}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "active"
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              } border-t border-b border-gray-300`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                activeTab === "past"
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              } border border-gray-300`}
            >
              Past Orders
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            Error loading orders: {error}
          </div>
        )}
        
        {/* Orders list */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const isExpanded = expandedOrder === order.id;
              
              return (
                <div 
                  key={order.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  {/* Order header */}
                  <div 
                    className="p-4 cursor-pointer"
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 mr-4">
                          {order.restaurantImage ? (
                            <Image 
                              src={order.restaurantImage} 
                              alt={order.restaurantName}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{order.restaurantName}</h3>
                          <p className="text-sm text-gray-500">
                            Order #{order.id.slice(-4)} • {formatDate(order.date)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex items-center mr-4">
                          {statusInfo.icon}
                          <span className={`ml-1 text-sm ${statusInfo.color}`}>
                            {statusInfo.text}
                          </span>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded order details */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 p-4">
                      {/* Order items */}
                      <div className="space-y-3 mb-4">
                        <h4 className="font-medium text-sm text-gray-500">ORDER ITEMS</h4>
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center">
                            <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 mr-3">
                              {item.image ? (
                                <Image 
                                  src={item.image} 
                                  alt={item.name}
                                  width={40}
                                  height={40}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                  <Package className="w-5 h-5 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{item.name}</p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-sm font-medium">{item.price}</div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Order summary */}
                      <div className="space-y-2 text-sm border-t border-gray-100 pt-4 mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Subtotal</span>
                          <span>${(parseFloat(order.total.replace('$', '')) - parseFloat(order.deliveryFee.replace('$', ''))).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Delivery Fee</span>
                          <span>{order.deliveryFee}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-100 font-semibold">
                          <span>Total</span>
                          <span>{order.total}</span>
                        </div>
                      </div>
                      
                      {/* Delivery address */}
                      <div className="mb-4">
                        <h4 className="font-medium text-sm text-gray-500 mb-1">DELIVERY ADDRESS</h4>
                        <p className="text-sm">{order.deliveryAddress}</p>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-3">
                        {order.status === "processing" && (
                          <Link 
                            href={`/customer/order-tracking/${order.id}`}
                            className="flex-1 bg-primary text-white text-center py-2 rounded-md hover:bg-primary-dark transition-colors"
                          >
                            Track Order
                          </Link>
                        )}
                        <Link 
                          href={`/customer/restaurant/${order.restaurantId}`}
                          className="flex-1 bg-white border border-gray-300 text-gray-700 text-center py-2 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          View Restaurant
                        </Link>
                        {order.status === "delivered" && (
                          <button className="flex-1 bg-white border border-gray-300 text-gray-700 text-center py-2 rounded-md hover:bg-gray-50 transition-colors">
                            Order Again
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery 
                  ? "No orders match your search criteria" 
                  : activeTab === "active" 
                    ? "You don't have any active orders" 
                    : activeTab === "past" 
                      ? "You don't have any past orders" 
                      : "You haven't placed any orders yet"}
              </p>
              <Link 
                href="/customer/all-restaurants"
                className="inline-block bg-primary text-white font-medium px-6 py-2 rounded-md hover:bg-primary-dark transition-colors"
              >
                Browse Restaurants
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
