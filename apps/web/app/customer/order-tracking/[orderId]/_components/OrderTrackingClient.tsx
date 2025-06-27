"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, ChevronLeft, Clock, MapPin, MessageSquare, Phone, ThumbsUp, Truck as TruckIcon, User, Utensils } from "lucide-react";
import CustomerNavbar from "../../../_components/CustomerNavbar";

// Order status types
type OrderStatus = "placed" | "confirmed" | "preparing" | "ready" | "picked_up" | "on_the_way" | "delivered";

// Props interface
interface OrderTrackingClientProps {
  order: any; // Using any for now, should be replaced with proper Order type
  error: string | null;
}

// Order tracking client component

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
  const getStatusIndex = (status: string): number => {
    // Match the status values used in the current status indicator
    if (status === "created") return 0;
    if (status === "accepted_restaurant") return 1;
    if (status === "preparing") return 2;
    if (status === "out_for_delivery") return 3;
    if (status === "delivered") return 4;
    return -1; // Unknown status
  };
  
  // Helper function to format time with consistent output between server and client
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    // Use explicit 24-hour format to avoid AM/PM differences
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  
  // If there's an error, show error state
  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <CustomerNavbar />
        <div className="max-w-lg mx-auto pt-24 px-4">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">
              {error}
            </p>
            <Link href="/customer/orders" className="inline-block bg-primary text-white font-medium px-6 py-2 rounded-md hover:bg-primary-dark transition-colors">
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // If no order found, show a friendly message
  if (!order) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <CustomerNavbar />
        <div className="max-w-lg mx-auto pt-24 px-4">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <Clock className="h-12 w-12 text-gray-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-6">
              We couldn't find the order you're looking for. It may have been removed or the order ID is incorrect.
            </p>
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-center">
              <Link href="/customer/orders" className="inline-block bg-primary text-white font-medium px-6 py-2 rounded-md hover:bg-primary-dark transition-colors">
                View Your Orders
              </Link>
              <Link href="/customer" className="inline-block bg-white border border-gray-300 text-gray-700 font-medium px-6 py-2 rounded-md hover:bg-gray-50 transition-colors">
                Back to Home
              </Link>
            </div>
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
    <div className="bg-gradient-to-b from-green-50 to-white min-h-screen pb-20">
      <CustomerNavbar />
      
      <div className="max-w-lg mx-auto pt-24 px-4">
        {/* Back button */}
        <Link href="/customer/orders" className="inline-flex items-center text-gray-600 mb-4">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Orders
        </Link>
        
        {/* Order status card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6 border-t-4 border-green-500">
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
          <div className="p-6 border-b border-gray-100 bg-green-50">
            <div className="flex justify-between mb-2">
              <h3 className="font-semibold text-gray-900">Order Status</h3>
              <span className="bg-green-500 text-white py-1 px-3 rounded-full text-sm font-medium">
                {order.status === "delivered" ? "Delivered" : 
                 order.status === "out_for_delivery" ? "On the way" : 
                 order.status === "preparing" ? "Preparing" :
                 order.status === "accepted_restaurant" ? "Accepted" : 
                 order.status === "created" ? "Created" : order.status}
              </span>
            </div>
            
            {/* Progress bar - improved user-friendly version */}
            <div className="relative pt-4 pb-8">
              {/* Current status indicator */}
              <div className="bg-green-100 p-3 rounded-lg mb-6 border-l-4 border-green-500">
                <p className="text-gray-700 font-medium">Current Status:</p>
                <p className="text-green-600 font-bold text-lg">
                  {order.status === "created" && "Order Created"}
                  {order.status === "accepted_restaurant" && "Order Accepted by Restaurant"}
                  {order.status === "preparing" && "Chef is Preparing Your Order"}
                  {order.status === "out_for_delivery" && "Your Order is On the Way"}
                  {order.status === "delivered" && "Order Delivered Successfully"}
                </p>
              </div>
              
              {/* Progress bar line */}
              <div className="h-2 bg-gray-100 rounded-full mb-4">
                <div 
                  className="h-full bg-green-500 rounded-full" 
                  style={{ 
                    width: `${Math.min(100, (statusIndex / 4) * 100)}%`
                  }}
                ></div>
              </div>
              
              {/* Step indicators with improved visibility */}
              <div className="flex justify-between mb-1">
                <div className={`flex flex-col items-center ${statusIndex >= 0 ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${statusIndex === 0 ? 'bg-white border-4 border-green-500' : statusIndex > 0 ? 'bg-green-500 text-white' : 'bg-white border-2 border-gray-200'}`}>
                    {statusIndex > 0 ? <Check className="w-6 h-6" /> : <span className={statusIndex >= 0 ? 'text-green-500 font-bold text-lg' : 'text-gray-400'}>1</span>}
                  </div>
                  <span className={`text-sm ${statusIndex === 0 ? 'font-bold' : ''}`}>Created</span>
                </div>
                
                <div className={`flex flex-col items-center ${statusIndex >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${statusIndex === 1 ? 'bg-white border-4 border-green-500' : statusIndex > 1 ? 'bg-green-500 text-white' : 'bg-white border-2 border-gray-200'}`}>
                    {statusIndex > 1 ? <Check className="w-6 h-6" /> : <span className={statusIndex >= 1 ? 'text-green-500 font-bold text-lg' : 'text-gray-400'}>2</span>}
                  </div>
                  <span className={`text-sm ${statusIndex === 1 ? 'font-bold' : ''}`}>Accepted</span>
                </div>
                
                <div className={`flex flex-col items-center ${statusIndex >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${statusIndex === 2 ? 'bg-white border-4 border-green-500' : statusIndex > 2 ? 'bg-green-500 text-white' : 'bg-white border-2 border-gray-200'}`}>
                    {statusIndex > 2 ? <Check className="w-6 h-6" /> : <span className={statusIndex >= 2 ? 'text-green-500 font-bold text-lg' : 'text-gray-400'}>3</span>}
                  </div>
                  <span className={`text-sm ${statusIndex === 2 ? 'font-bold' : ''}`}>Preparing</span>
                </div>
                
                <div className={`flex flex-col items-center ${statusIndex >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${statusIndex === 3 ? 'bg-white border-4 border-green-500' : statusIndex > 3 ? 'bg-green-500 text-white' : 'bg-white border-2 border-gray-200'}`}>
                    {statusIndex > 3 ? <Check className="w-6 h-6" /> : <span className={statusIndex >= 3 ? 'text-green-500 font-bold text-lg' : 'text-gray-400'}>4</span>}
                  </div>
                  <span className={`text-sm ${statusIndex === 3 ? 'font-bold' : ''}`}>On the way</span>
                </div>
                
                <div className={`flex flex-col items-center ${statusIndex >= 4 ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${statusIndex === 4 ? 'bg-white border-4 border-green-500' : statusIndex > 4 ? 'bg-green-500 text-white' : 'bg-white border-2 border-gray-200'}`}>
                    {statusIndex > 4 ? <Check className="w-6 h-6" /> : <span className={statusIndex >= 4 ? 'text-green-500 font-bold text-lg' : 'text-gray-400'}>5</span>}
                  </div>
                  <span className={`text-sm ${statusIndex === 4 ? 'font-bold' : ''}`}>Delivered</span>
                </div>
              </div>
            </div>
            
            {/* Estimated delivery time */}
            <div className="mt-6 flex items-center bg-green-100 p-3 rounded-lg">
              <div className="bg-green-500 p-2 rounded-full mr-3">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-gray-700 font-medium">
                  {order.status === "delivered" 
                    ? "Delivered"
                    : `Estimated delivery by:`}
                </p>
                {order.status !== "delivered" && (
                  <p className="text-green-600 font-bold text-lg">
                    {(() => {
                      const estimatedDelivery = new Date(new Date(order.placedAt).getTime() + 30 * 60000);
                      const hours = estimatedDelivery.getHours().toString().padStart(2, '0');
                      const minutes = estimatedDelivery.getMinutes().toString().padStart(2, '0');
                      return `${hours}:${minutes}`;
                    })()}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Delivery info section */}
          {order.status === "on_the_way" && (
            <div className="p-6 border-b border-gray-100 bg-gradient-to-br from-white to-green-50">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <TruckIcon className="w-5 h-5 text-green-500 mr-2" />
                Delivery Details
              </h3>
              <div className="flex items-center bg-white p-4 rounded-lg shadow-sm">
                <div className="w-14 h-14 rounded-full overflow-hidden mr-4 bg-green-100 border-2 border-green-200">
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-7 h-7 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800">Delivery Driver</p>
                  <p className="text-green-600 font-medium">Your order is on the way!</p>
                </div>
                <div className="flex space-x-3">
                  <button className="w-10 h-10 rounded-full bg-green-100 hover:bg-green-200 transition-colors flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-600" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-green-100 hover:bg-green-200 transition-colors flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                  </button>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-green-100 rounded-lg flex items-center border border-green-200">
                <div className="bg-green-500 p-2 rounded-full mr-3 flex-shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Delivery Address:</p>
                  <p className="text-green-800 font-bold">{order.customer.address || "123 Main Street, Anytown"}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Order items */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Utensils className="w-5 h-5 text-green-500 mr-2" />
              Order Summary
            </h3>
            <div className="space-y-4 rounded-lg overflow-hidden border border-green-100">
              {order.items.map((item: any, index: number) => (
                <div key={item.id} className={`flex p-3 ${index % 2 === 0 ? 'bg-green-50' : 'bg-white'}`}>
                  <div className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-full text-green-700 font-bold mr-3">
                    {item.quantity}x
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    {item.options && item.options.length > 0 && (
                      <p className="text-sm text-gray-500">{item.options.join(", ")}</p>
                    )}
                  </div>
                  <div className="text-green-700 font-bold">{item.price}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Order totals */}
          <div className="p-6 bg-gradient-to-br from-green-50 to-white rounded-b-lg">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-5 h-5 flex items-center justify-center mr-2 text-green-500">
                $
              </div>
              Payment Details
            </h3>
            <div className="bg-white p-4 rounded-lg border border-green-100 shadow-sm">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{order.subtotal}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">{order.deliveryFee}</span>
                </div>
                {order.tax && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">{order.tax}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 font-bold text-base">
                  <span className="text-gray-800">Total</span>
                  <span className="text-green-600 text-lg">{order.total}</span>
                </div>
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
