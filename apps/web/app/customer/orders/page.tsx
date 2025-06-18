"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CustomerNavbar from "../_components/CustomerNavbar";
import Image from "next/image";
import Link from "next/link";
import { Clock, ChevronRight, Search, Filter, Package, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { isLoggedIn } from "../_utils/authState";

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

export default function OrdersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"all" | "active" | "past">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  
  // Check authentication
  // useEffect(() => {
  //   if (!isLoggedIn.value) {
  //     router.push("/customer/login");
  //   }
  // }, [router]);
  
  // Mock orders data
  const orders: Order[] = [
    {
      id: "order-123", // Match the ID in the order tracking page
      restaurantId: "restaurant-1",
      restaurantName: "Burger Palace",
      restaurantImage: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
      date: "May 13, 2025",
      total: "$48.94",
      status: "processing",
      items: [
        {
          id: "item-1",
          name: "Double Cheeseburger",
          quantity: 2,
          price: "$12.99",
          image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "item-2",
          name: "French Fries (Large)",
          quantity: 1,
          price: "$4.99",
          image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "item-3",
          name: "Chocolate Milkshake",
          quantity: 2,
          price: "$5.99",
          image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80"
        }
      ],
      deliveryAddress: "123 Main St, Apt 4B, New York, NY 10001",
      deliveryFee: "$2.99"
    },
    {
      id: "order-456", // Match the ID in the order tracking page
      restaurantId: "restaurant-2",
      restaurantName: "Pizza Palace",
      restaurantImage: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80",
      date: "May 13, 2025",
      total: "$42.95",
      status: "processing",
      items: [
        {
          id: "item-1",
          name: "Margherita Pizza (Large)",
          quantity: 1,
          price: "$14.99",
          image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "item-2",
          name: "Pepperoni Pizza (Medium)",
          quantity: 1,
          price: "$12.99",
          image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80"
        },
      ],
      deliveryAddress: "123 Main St, Apt 4B, New York, NY 10001",
      deliveryFee: "$2.99"
    },
    {
      id: "ORD-1234",
      restaurantId: "restaurant-3",
      restaurantName: "Sushi Express",
      restaurantImage: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80",
      date: "April 28, 2025",
      total: "$32.50",
      status: "delivered",
      items: [
        {
          id: "item-4",
          name: "California Roll",
          quantity: 2,
          price: "$12.99",
          image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "item-5",
          name: "Miso Soup",
          quantity: 1,
          price: "$3.99",
          image: "https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?auto=format&fit=crop&w=600&q=80"
        }
      ],
      deliveryAddress: "123 Main St, New York, NY 10001",
      deliveryFee: "$2.99"
    },
    {
      id: "ORD-1236",
      restaurantId: "taco-fiesta",
      restaurantName: "Taco Fiesta",
      restaurantImage: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80",
      date: "April 30, 2025",
      total: "$18.99",
      status: "processing",
      items: [
        {
          id: "item-6",
          name: "Taco Combo",
          quantity: 1,
          price: "$12.99",
          image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "item-7",
          name: "Guacamole",
          quantity: 1,
          price: "$3.99",
          image: "https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?auto=format&fit=crop&w=600&q=80"
        }
      ],
      deliveryAddress: "123 Main St, New York, NY 10001",
      deliveryFee: "$1.99"
    },
    {
      id: "ORD-1237",
      restaurantId: "pizza-paradise",
      restaurantName: "Pizza Paradise",
      restaurantImage: "https://images.unsplash.com/photo-1594007654729-407eedc4fe24?auto=format&fit=crop&w=600&q=80",
      date: "April 20, 2025",
      total: "$22.99",
      status: "cancelled",
      items: [
        {
          id: "item-8",
          name: "Pepperoni Pizza",
          quantity: 1,
          price: "$14.99",
          image: "https://images.unsplash.com/photo-1594007654729-407eedc4fe24?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "item-9",
          name: "Garlic Bread",
          quantity: 1,
          price: "$4.99",
          image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=600&q=80"
        }
      ],
      deliveryAddress: "123 Main St, New York, NY 10001",
      deliveryFee: "$2.99"
    }
  ];
  
  // Filter orders based on active tab and search query
  const filteredOrders = orders.filter(order => {
    // Filter by tab
    if (activeTab === "active" && order.status !== "processing") return false;
    if (activeTab === "past" && order.status === "processing") return false;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(query) ||
        order.restaurantName.toLowerCase().includes(query) ||
        order.items.some(item => item.name.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };
  
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "delivered":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "processing":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case "delivered":
        return "Delivered";
      case "processing":
        return "Processing";
      case "cancelled":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };
  
  return (
    <div className="bg-[#f8f9fa] min-h-svh">
      <CustomerNavbar forceLight={true} />
      <main className="pt-20 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>
          
          {/* Search and Filter */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders by restaurant or item"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 font-medium text-sm ${activeTab === "all" ? 'text-[#4CAF50] border-b-2 border-[#4CAF50]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              All Orders
            </button>
            <button
              onClick={() => setActiveTab("active")}
              className={`px-4 py-2 font-medium text-sm ${activeTab === "active" ? 'text-[#4CAF50] border-b-2 border-[#4CAF50]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Active Orders
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`px-4 py-2 font-medium text-sm ${activeTab === "past" ? 'text-[#4CAF50] border-b-2 border-[#4CAF50]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Past Orders
            </button>
          </div>
          
          {/* Orders List */}
          {filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl shadow-xs overflow-hidden">
                  {/* Order Header */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-lg overflow-hidden">
                          <Image 
                            src={order.restaurantImage} 
                            alt={order.restaurantName} 
                            width={48} 
                            height={48} 
                            className="object-cover h-full w-full" 
                          />
                        </div>
                        <div>
                          <Link href={`/customer/restaurant/${order.restaurantId}`} className="font-medium text-gray-900 hover:text-[#4CAF50]">
                            {order.restaurantName}
                          </Link>
                          <div className="flex items-center text-sm text-gray-500">
                            <Package className="h-4 w-4 mr-1" />
                            <span>Order #{order.id}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          {getStatusIcon(order.status)}
                          <span className="ml-1 text-sm font-medium">{getStatusText(order.status)}</span>
                        </div>
                        <button
                          onClick={() => toggleOrderDetails(order.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <ChevronRight className={`h-5 w-5 transform transition-transform ${expandedOrder === order.id ? 'rotate-90' : ''}`} />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between items-center text-sm">
                      <div className="text-gray-500">{order.date}</div>
                      <div className="font-medium text-gray-900">{order.total}</div>
                    </div>
                  </div>
                  
                  {/* Order Details (expanded) */}
                  {expandedOrder === order.id && (
                    <div className="p-4 bg-gray-50">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Order Items</h3>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 rounded-md overflow-hidden">
                                <Image 
                                  src={item.image} 
                                  alt={item.name} 
                                  width={40} 
                                  height={40} 
                                  className="object-cover h-full w-full" 
                                />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                              </div>
                            </div>
                            <div className="text-sm font-medium text-gray-900">{item.price}</div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Subtotal</span>
                          <span className="text-gray-900">{order.total}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-gray-500">Delivery Fee</span>
                          <span className="text-gray-900">{order.deliveryFee}</span>
                        </div>
                        <div className="flex justify-between font-medium mt-2 pt-2 border-t border-gray-200">
                          <span className="text-gray-900">Total</span>
                          <span className="text-gray-900">{order.total}</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <h3 className="text-sm font-medium text-gray-700 mb-1">Delivery Address</h3>
                        <p className="text-sm text-gray-500">{order.deliveryAddress}</p>
                      </div>
                      {order.status === "delivered" && (
                        <div className="mt-4">
                          <button className="w-full py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#388E3C] transition-colors text-sm font-medium">
                            Reorder
                          </button>
                        </div>
                      )}
                      {order.status === "processing" && (
                        <div className="mt-4">
                          <Link href={`/customer/order-tracking/${order.id}`} className="block w-full">
                            <button className="w-full py-2 bg-[#1976d2] text-white rounded-lg hover:bg-[#1565c0] transition-colors text-sm font-medium flex items-center justify-center">
                              <Clock className="w-4 h-4 mr-2" />
                              Track Order
                            </button>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 text-gray-400">
                <Package className="h-full w-full" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No orders found</h3>
              <p className="mt-1 text-gray-500">
                {searchQuery ? 
                  "Try a different search term or filter" : 
                  "You haven't placed any orders yet"}
              </p>
              <Link href="/customer" className="mt-6 inline-block px-6 py-3 bg-[#4CAF50] text-white rounded-full font-medium">
                Browse Restaurants
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
