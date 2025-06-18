"use client";

import { useState } from "react";
import { Clock, MapPin } from "lucide-react";
import Image from "next/image";

export default function DeliveryOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [availableOrders, setAvailableOrders] = useState([
    {
      id: "#ORD-7825",
      restaurantName: "Pizza Hub",
      restaurantAddress: "123 Maple St",
      restaurantImage: "https://images.unsplash.com/photo-1601924638867-3ec1b6c66dbe?auto=format&fit=crop&w=600&q=80",
      customerName: "Michael Chen",
      customerAddress: "456 Main Ave",
      estimatedDistance: "3.2 miles",
      estimatedTime: "20-25 min",
      paymentAmount: "$29.99",
      items: [
        { name: "Hawaiian", quantity: 1 },
        { name: "Wings", quantity: 1 }
      ],
      status: "Out for Delivery"
    },
    {
      id: "#ORD-7800",
      restaurantName: "Green Bites",
      restaurantAddress: "456 Oak Ave",
      restaurantImage: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=600&q=80",
      customerName: "Jennifer Lee",
      customerAddress: "123 Forest Rd",
      estimatedDistance: "2.9 miles",
      estimatedTime: "18-22 min",
      paymentAmount: "$21.50",
      items: [
        { name: "Margherita", quantity: 1 },
        { name: "Greek Salad", quantity: 1 }
      ],
      status: "Cancelled"
    },
    {
      id: "#ORD-7826",
      restaurantName: "Sushi Zen",
      restaurantAddress: "789 Pine Rd",
      restaurantImage: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
      customerName: "Laura Smith",
      customerAddress: "789 Birch Lane",
      estimatedDistance: "1.7 miles",
      estimatedTime: "10-15 min",
      paymentAmount: "$25.00",
      items: [
        { name: "California Roll", quantity: 2 }
      ],
      status: "Accepted"
    },
    {
      id: "#ORD-7827",
      restaurantName: "Taco Town",
      restaurantAddress: "321 Elm Blvd",
      restaurantImage: "https://images.unsplash.com/photo-1604908177521-c36b2ac2f1be?auto=format&fit=crop&w=600&q=80",
      customerName: "Tom Ray",
      customerAddress: "321 River St",
      estimatedDistance: "2.1 miles",
      estimatedTime: "12-16 min",
      paymentAmount: "$18.00",
      items: [
        { name: "Beef Tacos", quantity: 3 }
      ],
      status: "Accepted"
    }
  ]);

  const filteredAvailableOrders = availableOrders.filter((order) => {
    const query = searchQuery.toLowerCase();
    return (
      order.id.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.restaurantName.toLowerCase().includes(query)
    );
  });

  const handleAcceptOrder = (orderId: string) => {
    alert(`Order ${orderId} accepted.`);
    setAvailableOrders(availableOrders.filter(order => order.id !== orderId));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted": return "bg-blue-100 text-blue-800";
      case "out for delivery": return "bg-purple-100 text-purple-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold text-gray-800">Delivery Orders</h1>

      <input
        type="text"
        placeholder="Search orders..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="space-y-4">
        {filteredAvailableOrders.length > 0 ? (
          filteredAvailableOrders.map((order) => (
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
                <span className="text-sm text-gray-500">{order.items.length} items</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      alert(`Order ${order.id} rejected. You won't see this order again.`);
                      setAvailableOrders(availableOrders.filter(o => o.id !== order.id));
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
          ))
        ) : (
          <p className="text-center text-gray-500 mt-6">No orders found</p>
        )}
      </div>
    </div>
  );
}
