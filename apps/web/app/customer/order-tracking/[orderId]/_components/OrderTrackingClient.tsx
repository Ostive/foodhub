"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Clock, Check, MapPin, Phone, MessageSquare, ThumbsUp, User, Utensils } from "lucide-react";
import CustomerNavbar from "../../../_components/CustomerNavbar";

// Order status types
type OrderStatus = "placed" | "confirmed" | "preparing" | "ready" | "picked_up" | "on_the_way" | "delivered";

// Props interface
interface OrderTrackingClientProps {
  order: any; // Using any for now, should be replaced with proper Order type
  error: string | null;
}

export default function OrderTrackingClient({ order, error }: OrderTrackingClientProps) {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Helper function to get status index
  const getStatusIndex = (status: OrderStatus): number => {
    const statuses: OrderStatus[] = ["placed", "confirmed", "preparing", "ready", "picked_up", "on_the_way", "delivered"];
    return statuses.indexOf(status);
  };
  
  // Helper function to format time
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // If there's an error or no order, show error state
  if (error || !order) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <CustomerNavbar />
        <div className="max-w-lg mx-auto pt-24 px-4">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-6">
              {error || "We couldn't find the order you're looking for."}
            </p>
            <Link href="/customer" className="inline-block bg-primary text-white font-medium px-6 py-2 rounded-md hover:bg-primary-dark transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Calculate time since order was placed
  const orderTime = new Date(order.placedAt);
  const minutesSinceOrder = Math.floor((currentTime.getTime() - orderTime.getTime()) / 60000);
  
  // Get status index for progress bar
  const statusIndex = getStatusIndex(order.status);
  
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <CustomerNavbar />
      
      <div className="max-w-lg mx-auto pt-24 px-4">
        {/* Back button */}
        <Link href="/customer/orders" className="inline-flex items-center text-gray-600 mb-4">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Orders
        </Link>
        
        {/* Order status card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          {/* Restaurant info */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-md overflow-hidden mr-4 bg-gray-100">
                {order.restaurant.image ? (
                  <Image 
                    src={order.restaurant.image} 
                    alt={order.restaurant.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <Utensils className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{order.restaurant.name}</h2>
                <p className="text-gray-500">Order #{order.id.slice(-4)}</p>
                <p className="text-sm text-gray-500">
                  Placed at {formatTime(order.placedAt)} ({minutesSinceOrder} min ago)
                </p>
              </div>
            </div>
          </div>
          
          {/* Status progress */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between mb-2">
              <h3 className="font-semibold text-gray-900">Order Status</h3>
              <span className="text-primary font-medium">
                {order.status === "delivered" ? "Delivered" : 
                 order.status === "on_the_way" ? "On the way" : 
                 order.status === "picked_up" ? "Picked up" :
                 order.status === "ready" ? "Ready for pickup" :
                 order.status === "preparing" ? "Preparing" :
                 order.status === "confirmed" ? "Confirmed" : "Placed"}
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="relative pt-4">
              <div className="flex mb-2">
                <div className="flex-1 flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${statusIndex >= 0 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                    {statusIndex >= 0 ? <Check className="w-5 h-5" /> : 1}
                  </div>
                </div>
                <div className="flex-1 flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${statusIndex >= 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                    {statusIndex >= 2 ? <Check className="w-5 h-5" /> : 2}
                  </div>
                </div>
                <div className="flex-1 flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${statusIndex >= 5 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                    {statusIndex >= 5 ? <Check className="w-5 h-5" /> : 3}
                  </div>
                </div>
                <div className="flex-1 flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${statusIndex >= 6 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                    {statusIndex >= 6 ? <Check className="w-5 h-5" /> : 4}
                  </div>
                </div>
              </div>
              
              {/* Progress bar line */}
              <div className="absolute top-8 left-4 right-4 h-1 bg-gray-200">
                <div 
                  className="h-full bg-primary" 
                  style={{ 
                    width: `${Math.min(100, (statusIndex / 6) * 100)}%`,
                    transition: 'width 0.5s ease-in-out'
                  }}
                ></div>
              </div>
              
              {/* Status labels */}
              <div className="flex text-xs text-gray-500 pt-4">
                <div className="flex-1 text-center">Placed</div>
                <div className="flex-1 text-center">Preparing</div>
                <div className="flex-1 text-center">On the way</div>
                <div className="flex-1 text-center">Delivered</div>
              </div>
            </div>
            
            {/* Estimated delivery time */}
            <div className="mt-6 flex items-center">
              <Clock className="w-5 h-5 text-gray-400 mr-2" />
              <p className="text-gray-600">
                {order.status === "delivered" 
                  ? "Delivered"
                  : `Estimated delivery: ${order.delivery.estimatedTime}`}
              </p>
            </div>
          </div>
          
          {/* Delivery driver info (if applicable) */}
          {order.status === "on_the_way" && order.delivery.driver && (
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Delivery Details</h3>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-100">
                  {order.delivery.driver.image ? (
                    <Image 
                      src={order.delivery.driver.image} 
                      alt={order.delivery.driver.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <User className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{order.delivery.driver.name}</p>
                  <p className="text-sm text-gray-500">Your delivery driver</p>
                </div>
                <div className="flex space-x-3">
                  <a href={`tel:${order.delivery.driver.phone}`} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-gray-600" />
                  </a>
                  <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
              
              {order.delivery.driver.eta && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md flex items-center">
                  <MapPin className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
                  <p className="text-sm text-blue-700">
                    Your driver is <span className="font-medium">{order.delivery.driver.eta}</span> away
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Order items */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex">
                  <div className="w-8 text-center text-gray-500 mr-2">
                    {item.quantity}x
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    {item.options && item.options.length > 0 && (
                      <p className="text-sm text-gray-500">{item.options.join(", ")}</p>
                    )}
                  </div>
                  <div className="text-gray-800">{item.price}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Order totals */}
          <div className="p-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery Fee</span>
                <span>{order.deliveryFee}</span>
              </div>
              {order.tax && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Tax</span>
                  <span>{order.tax}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-100 font-semibold text-base">
                <span>Total</span>
                <span>{order.total}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Customer address */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Delivery Address</h3>
          <div className="flex items-start">
            <MapPin className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
            <p className="text-gray-600">{order.customer.address}</p>
          </div>
        </div>
        
        {/* Help button */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            Contact the restaurant or our support team for assistance with your order.
          </p>
          <div className="flex space-x-4 justify-center">
            <a href={`tel:${order.restaurant.phone}`} className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Phone className="w-4 h-4 mr-2" />
              Call Restaurant
            </a>
            <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark">
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
