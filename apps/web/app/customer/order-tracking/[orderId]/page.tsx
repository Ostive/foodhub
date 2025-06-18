"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Clock, Check, MapPin, Phone, MessageSquare, ThumbsUp, User, Utensils } from "lucide-react";
import CustomerNavbar from "../../_components/CustomerNavbar";

// Order status types
type OrderStatus = "placed" | "confirmed" | "preparing" | "ready" | "picked_up" | "on_the_way" | "delivered";

// Order details interface
interface OrderDetails {
  id: string;
  status: OrderStatus;
  restaurant: {
    id: string;
    name: string;
    image: string;
    phone: string;
  };
  customer: {
    name: string;
    address: string;
  };
  delivery: {
    estimatedTime: string;
    driver?: {
      name: string;
      phone: string;
      image: string;
      eta?: string;
      location?: {
        lat: number;
        lng: number;
      };
    };
  };
  items: {
    id: string;
    name: string;
    quantity: number;
    price: string;
    options?: string[];
  }[];
  placedAt: string;
  total: string;
  subtotal: string;
  deliveryFee: string;
  tip: string;
  tax: string;
}

// Mock order data
const mockOrders: Record<string, OrderDetails> = {
  "order-123": {
    id: "order-123",
    status: "on_the_way",
    restaurant: {
      id: "restaurant-1",
      name: "Burger Palace",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
      phone: "+1 (555) 123-4567"
    },
    customer: {
      name: "John Doe",
      address: "123 Main St, Apt 4B, New York, NY 10001"
    },
    delivery: {
      estimatedTime: "35-45 min",
      driver: {
        name: "Michael Rodriguez",
        phone: "+1 (555) 987-6543",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        eta: "15 min",
        location: {
          lat: 40.7128,
          lng: -74.006
        }
      }
    },
    items: [
      {
        id: "item-1",
        name: "Double Cheeseburger",
        quantity: 2,
        price: "$12.99",
        options: ["No pickles", "Extra cheese"]
      },
      {
        id: "item-2",
        name: "French Fries (Large)",
        quantity: 1,
        price: "$4.99"
      },
      {
        id: "item-3",
        name: "Chocolate Milkshake",
        quantity: 2,
        price: "$5.99"
      }
    ],
    placedAt: "2025-05-13T12:30:00Z",
    total: "$48.94",
    subtotal: "$42.95",
    deliveryFee: "$2.99",
    tip: "$5.00",
    tax: "$3.00"
  },
  "order-456": {
    id: "order-456",
    status: "preparing",
    restaurant: {
      id: "restaurant-2",
      name: "Pizza Palace",
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80",
      phone: "+1 (555) 234-5678"
    },
    customer: {
      name: "John Doe",
      address: "123 Main St, Apt 4B, New York, NY 10001"
    },
    delivery: {
      estimatedTime: "40-50 min"
    },
    items: [
      {
        id: "item-1",
        name: "Margherita Pizza (Large)",
        quantity: 1,
        price: "$14.99"
      },
      {
        id: "item-2",
        name: "Pepperoni Pizza (Medium)",
        quantity: 1,
        price: "$12.99"
      },
      {
        id: "item-3",
        name: "Garlic Bread",
        quantity: 1,
        price: "$4.99"
      },
      {
        id: "item-4",
        name: "Soda (2L)",
        quantity: 1,
        price: "$3.99"
      }
    ],
    placedAt: "2025-05-13T13:15:00Z",
    total: "$42.95",
    subtotal: "$36.96",
    deliveryFee: "$2.99",
    tip: "$4.00",
    tax: "$3.00"
  }
};

// Status step mapping
const statusSteps: { status: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { status: "placed", label: "Order Placed", icon: <Check className="w-5 h-5" /> },
  { status: "confirmed", label: "Order Confirmed", icon: <ThumbsUp className="w-5 h-5" /> },
  { status: "preparing", label: "Preparing Your Food", icon: <Utensils className="w-5 h-5" /> },
  { status: "ready", label: "Ready for Pickup", icon: <Check className="w-5 h-5" /> },
  { status: "picked_up", label: "Order Picked Up", icon: <User className="w-5 h-5" /> },
  { status: "on_the_way", label: "On the Way", icon: <MapPin className="w-5 h-5" /> },
  { status: "delivered", label: "Delivered", icon: <Check className="w-5 h-5" /> },
];

// Get status index
const getStatusIndex = (status: OrderStatus): number => {
  return statusSteps.findIndex(step => step.status === status);
};

// Format time
const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Simulate real-time updates
  const [currentStatus, setCurrentStatus] = useState<OrderStatus | null>(null);
  
  useEffect(() => {
    // Fetch order details
    const fetchOrder = () => {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        const orderData = mockOrders[orderId];
        
        if (orderData) {
          setOrder(orderData);
          setCurrentStatus(orderData.status);
        } else {
          setError("Order not found");
        }
        
        setLoading(false);
      }, 1000);
    };
    
    fetchOrder();
    
    // Set up polling for status updates (every 30 seconds)
    const intervalId = setInterval(() => {
      if (order && order.status !== "delivered") {
        // Simulate status update (in a real app, this would be an API call)
        const statusIndex = getStatusIndex(order.status);
        if (statusIndex >= 0 && statusIndex < statusSteps.length - 1) {
          // Randomly decide whether to update status (20% chance)
          if (Math.random() < 0.2) {
            const newStatus = statusSteps[statusIndex + 1].status;
            setCurrentStatus(newStatus);
            setOrder(prev => prev ? {...prev, status: newStatus} : null);
          }
        }
      }
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [orderId, order]);
  
  // Get current status index
  const currentStatusIndex = currentStatus ? getStatusIndex(currentStatus) : -1;
  
  if (loading) {
    return (
      <div className="bg-[#f8f9fa] min-h-svh">
        <CustomerNavbar />
        <div className="max-w-4xl mx-auto px-4 pt-20 pb-6 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#009E73] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !order) {
    return (
      <div className="bg-[#f8f9fa] min-h-svh">
        <CustomerNavbar />
        <div className="max-w-4xl mx-auto px-4 pt-20 pb-6">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
            <Link href="/customer/orders" className="bg-[#009E73] hover:bg-[#388E3C] text-white px-6 py-3 rounded-lg font-medium inline-flex items-center transition-colors">
              <ChevronLeft className="mr-2 h-5 w-5" />
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-[#f8f9fa] min-h-svh pb-20">
      {/* Dark overlay for navbar */}
      <div className="fixed top-0 left-0 right-0 h-16 z-40 backdrop-blur-xs bg-linear-to-b from-black/60 via-black/40 to-transparent pointer-events-none" style={{ height: 90 }}></div>
      <CustomerNavbar />
      
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-6">
        <div className="flex items-center mb-6" style={{ marginTop: 30 }}>
          <Link href="/customer/orders" className="mr-4 bg-white p-2 rounded-full shadow-xs text-gray-700 hover:bg-gray-100 transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Order Tracking</h1>
        </div>
        
        {/* Order Status */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4" >
            <h2 className="text-xl font-bold text-gray-900">Order Status</h2>
            <div className="flex items-center text-[#009E73] font-medium">
              <Clock className="w-4 h-4 mr-1" />
              <span>Order placed at {formatTime(order.placedAt)}</span>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="relative mb-8">
            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
              <div 
                className="h-full bg-[#009E73] transition-all duration-500" 
                style={{ width: `${currentStatusIndex >= 0 ? (currentStatusIndex / (statusSteps.length - 1)) * 100 : 0}%` }}
              ></div>
            </div>
            
            {/* Status Steps */}
            <div className="flex justify-between relative z-10">
              {statusSteps.map((step, index) => {
                const isActive = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                
                return (
                  <div key={step.status} className="flex flex-col items-center">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${isCurrent ? 'bg-[#009E73] text-white ring-4 ring-[#009E73]/20' : isActive ? 'bg-[#009E73] text-white' : 'bg-gray-200 text-gray-500'}`}
                    >
                      {step.icon}
                    </div>
                    <span className={`text-xs mt-2 text-center max-w-[70px] ${isActive ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Estimated Delivery */}
          <div className="text-center p-4 bg-[#009E73]/10 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-1">Estimated Delivery Time</h3>
            <p className="text-[#009E73] text-xl font-bold">{order.delivery.estimatedTime}</p>
          </div>
        </div>
        
        {/* Delivery Driver Info (if assigned) */}
        {order.delivery.driver && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Delivery Driver</h2>
            
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                <Image 
                  src={order.delivery.driver.image} 
                  alt={order.delivery.driver.name} 
                  width={64} 
                  height={64} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="grow">
                <h3 className="font-medium text-gray-900">{order.delivery.driver.name}</h3>
                <div className="flex items-center text-gray-500 text-sm mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>Arriving in {order.delivery.driver.eta}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <a 
                  href={`tel:${order.delivery.driver.phone}`} 
                  className="w-10 h-10 bg-[#009E73]/10 text-[#009E73] rounded-full flex items-center justify-center hover:bg-[#009E73]/20 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                </a>
                <button 
                  className="w-10 h-10 bg-[#009E73]/10 text-[#009E73] rounded-full flex items-center justify-center hover:bg-[#009E73]/20 transition-colors"
                  onClick={() => alert('Messaging feature coming soon!')}
                >
                  <MessageSquare className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Map placeholder - in a real app, this would be an actual map */}
            <div className="mt-4 bg-gray-200 h-48 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Live map tracking would appear here</p>
            </div>
          </div>
        )}
        
        {/* Order Details */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Details</h2>
          
          <div className="flex items-start mb-6">
            <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
              <Image 
                src={order.restaurant.image} 
                alt={order.restaurant.name} 
                width={64} 
                height={64} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900">{order.restaurant.name}</h3>
              <div className="flex items-center text-gray-500 text-sm mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{order.customer.address}</span>
              </div>
            </div>
          </div>
          
          {/* Order Items */}
          <div className="border-t border-gray-100 pt-4">
            <h3 className="font-medium text-gray-900 mb-3">Your Order</h3>
            
            <div className="space-y-3">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">{item.quantity}×</span>
                      <span className="ml-2 text-gray-800">{item.name}</span>
                    </div>
                    {item.options && item.options.length > 0 && (
                      <div className="text-sm text-gray-500 ml-6">
                        {item.options.join(', ')}
                      </div>
                    )}
                  </div>
                  <span className="text-gray-900">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="border-t border-gray-100 mt-6 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>{order.deliveryFee}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>{order.tax}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tip</span>
                <span>{order.tip}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100 mt-2">
                <span>Total</span>
                <span>{order.total}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Help & Support */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Need Help?</h2>
          
          <div className="space-y-4">
            <button 
              onClick={() => alert('Contacting restaurant...')} 
              className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-[#009E73] mr-3" />
                <span className="font-medium">Contact Restaurant</span>
              </div>
              <span className="text-gray-500">{order.restaurant.phone}</span>
            </button>
            
            <button 
              onClick={() => router.push('/customer/support')} 
              className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <MessageSquare className="w-5 h-5 text-[#009E73] mr-3" />
                <span className="font-medium">Contact Support</span>
              </div>
              <span className="text-gray-500">24/7 Customer Service</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
