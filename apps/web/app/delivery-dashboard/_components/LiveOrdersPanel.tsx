"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle, XCircle, ChevronDown, ChevronUp, Bell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Order status types
type OrderStatus = "new" | "confirmed" | "preparing" | "ready" | "picked_up" | "completed" | "cancelled";

// Order interface
interface Order {
  id: string;
  status: OrderStatus;
  customerName: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    options?: string[];
  }[];
  total: string;
  placedAt: string;
  estimatedReadyTime?: string;
  isDelivery: boolean;
  deliveryAddress?: string;
  driverName?: string;
}

interface LiveOrdersPanelProps {
  restaurantId: string;
}

const LiveOrdersPanel = ({ restaurantId }: LiveOrdersPanelProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newOrderAlert, setNewOrderAlert] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call to fetch orders
    const fetchOrders = () => {
      setLoading(true);
      
      // In a real app, this would be an API call
      setTimeout(() => {
        const mockOrders: Order[] = [
          {
            id: "order-123",
            status: "new",
            customerName: "John Doe",
            items: [
              { id: "item-1", name: "Margherita Pizza (Large)", quantity: 1 },
              { id: "item-2", name: "Garlic Bread", quantity: 1 },
              { id: "item-3", name: "Coca Cola (2L)", quantity: 1 }
            ],
            total: "$24.97",
            placedAt: new Date().toISOString(),
            isDelivery: true,
            deliveryAddress: "123 Main St, Apt 4B, New York, NY 10001"
          },
          {
            id: "order-124",
            status: "confirmed",
            customerName: "Sarah Johnson",
            items: [
              { id: "item-1", name: "Pepperoni Pizza (Medium)", quantity: 1 },
              { id: "item-2", name: "Buffalo Wings", quantity: 1 }
            ],
            total: "$19.98",
            placedAt: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
            estimatedReadyTime: "15 minutes",
            isDelivery: false
          },
          {
            id: "order-125",
            status: "preparing",
            customerName: "Michael Smith",
            items: [
              { id: "item-1", name: "Vegetarian Pizza (Large)", quantity: 1 },
              { id: "item-2", name: "Greek Salad", quantity: 1 },
              { id: "item-3", name: "Sprite (500ml)", quantity: 2 }
            ],
            total: "$28.96",
            placedAt: new Date(Date.now() - 25 * 60000).toISOString(), // 25 minutes ago
            estimatedReadyTime: "10 minutes",
            isDelivery: true,
            deliveryAddress: "456 Park Ave, Suite 201, New York, NY 10022",
            driverName: "David Wilson"
          },
          {
            id: "order-126",
            status: "ready",
            customerName: "Emily Brown",
            items: [
              { id: "item-1", name: "Hawaiian Pizza (Medium)", quantity: 1 },
              { id: "item-2", name: "Mozzarella Sticks", quantity: 1 },
              { id: "item-3", name: "Tiramisu", quantity: 1 }
            ],
            total: "$26.97",
            placedAt: new Date(Date.now() - 35 * 60000).toISOString(), // 35 minutes ago
            isDelivery: true,
            deliveryAddress: "789 Broadway, Floor 3, New York, NY 10003",
            driverName: "Lisa Chen"
          }
        ];
        
        setOrders(mockOrders);
        setLoading(false);
      }, 1000);
    };
    
    fetchOrders();
    
    // Simulate receiving a new order every 45 seconds
    const newOrderInterval = setInterval(() => {
      const newOrder: Order = {
        id: `order-${Math.floor(Math.random() * 1000)}`,
        status: "new",
        customerName: `Customer ${Math.floor(Math.random() * 100)}`,
        items: [
          { id: `item-${Math.floor(Math.random() * 10)}`, name: "Random Pizza", quantity: 1 },
          { id: `item-${Math.floor(Math.random() * 10)}`, name: "Random Side", quantity: 1 }
        ],
        total: `$${(Math.random() * 30 + 10).toFixed(2)}`,
        placedAt: new Date().toISOString(),
        isDelivery: Math.random() > 0.5,
        deliveryAddress: Math.random() > 0.5 ? "123 Random St, City" : undefined
      };
      
      setOrders(prev => [newOrder, ...prev]);
      setNewOrderAlert(true);
      
      // Clear the alert after 5 seconds
      setTimeout(() => setNewOrderAlert(false), 5000);
    }, 45000);
    
    return () => clearInterval(newOrderInterval);
  }, []);

  // Format time
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Calculate time elapsed
  const getTimeElapsed = (dateString: string): string => {
    const orderDate = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - orderDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins === 1) return "1 minute ago";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return "1 hour ago";
    return `${diffHours} hours ago`;
  };
  
  // Handle order status change
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              status: newStatus,
              estimatedReadyTime: newStatus === "confirmed" ? "20 minutes" : order.estimatedReadyTime
            } 
          : order
      )
    );
  };
  
  // Toggle order details expansion
  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };
  
  // Get status badge color
  const getStatusBadgeColor = (status: OrderStatus): string => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800";
      case "confirmed": return "bg-purple-100 text-purple-800";
      case "preparing": return "bg-amber-100 text-amber-800";
      case "ready": return "bg-green-100 text-green-800";
      case "picked_up": return "bg-indigo-100 text-indigo-800";
      case "completed": return "bg-gray-100 text-gray-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Live Orders</h2>
        {newOrderAlert && (
          <div className="flex items-center text-green-600 animate-pulse">
            <Bell className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">New Order!</span>
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="p-8 flex justify-center">
          <div className="h-8 w-8 border-4 border-t-[#FF9800] border-r-[#FF9800] border-b-[#FF9800] border-l-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="p-6 text-center text-red-600">
          <p>{error}</p>
          <button 
            className="mt-2 text-[#FF9800] hover:underline"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <p>No orders at the moment.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {orders.map(order => (
            <div key={order.id} className="hover:bg-gray-50">
              <div 
                className="p-4 cursor-pointer"
                onClick={() => toggleOrderExpansion(order.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">Order #{order.id.split('-')[1]}</span>
                      <span className={`ml-2 text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{order.total}</p>
                    <p className="text-xs text-gray-500">{getTimeElapsed(order.placedAt)}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{formatTime(order.placedAt)}</span>
                    {order.estimatedReadyTime && (
                      <span className="ml-2">• Ready in {order.estimatedReadyTime}</span>
                    )}
                  </div>
                  {expandedOrderId === order.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
              
              {expandedOrderId === order.id && (
                <div className="px-4 pb-4">
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Order Items</h4>
                    <ul className="space-y-1">
                      {order.items.map(item => (
                        <li key={item.id} className="flex justify-between text-sm">
                          <span>
                            {item.quantity}x {item.name}
                            {item.options && item.options.length > 0 && (
                              <span className="text-gray-500 text-xs block ml-4">
                                {item.options.join(", ")}
                              </span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {order.isDelivery && order.deliveryAddress && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Delivery Address</h4>
                      <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                      {order.driverName && (
                        <p className="text-sm text-gray-600 mt-1">Driver: {order.driverName}</p>
                      )}
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {order.status === "new" && (
                      <>
                        <button 
                          onClick={() => handleStatusChange(order.id, "confirmed")}
                          className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 flex items-center"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accept Order
                        </button>
                        <button 
                          onClick={() => handleStatusChange(order.id, "cancelled")}
                          className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 flex items-center"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Decline
                        </button>
                      </>
                    )}
                    
                    {order.status === "confirmed" && (
                      <button 
                        onClick={() => handleStatusChange(order.id, "preparing")}
                        className="px-3 py-1.5 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 flex items-center"
                      >
                        Start Preparing
                      </button>
                    )}
                    
                    {order.status === "preparing" && (
                      <button 
                        onClick={() => handleStatusChange(order.id, "ready")}
                        className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 flex items-center"
                      >
                        Mark as Ready
                      </button>
                    )}
                    
                    {order.status === "ready" && !order.isDelivery && (
                      <button 
                        onClick={() => handleStatusChange(order.id, "completed")}
                        className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center"
                      >
                        Mark as Completed
                      </button>
                    )}
                    
                    {order.status === "ready" && order.isDelivery && (
                      <button 
                        onClick={() => handleStatusChange(order.id, "picked_up")}
                        className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 flex items-center"
                      >
                        Mark as Picked Up
                      </button>
                    )}
                    
                    <Link 
                      href={`/restaurant-dashboard/${restaurantId}/orders/${order.id}`}
                      className="px-3 py-1.5 bg-gray-200 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-300"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveOrdersPanel;
