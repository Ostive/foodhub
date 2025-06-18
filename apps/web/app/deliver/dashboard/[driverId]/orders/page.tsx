"use client";

import { useState } from "react";
import { Clock, MapPin, Eye, Truck } from "lucide-react";

export default function DeliveryOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered mock orders for delivery personnel
  const orders = [
    { id: "#ORD-7825", customer: "Michael Chen", restaurant: "Pizza Hub", location: "123 Maple St", items: "Hawaiian, Wings", total: "$29.99", time: "9:30 AM", date: "Today", status: "Out for Delivery" },
    { id: "#ORD-7800", customer: "Jennifer Lee", restaurant: "Green Bites", location: "456 Oak Ave", items: "Margherita, Greek Salad", total: "$21.50", time: "6:30 PM", date: "Yesterday", status: "Cancelled" },
    { id: "#ORD-7826", customer: "Laura Smith", restaurant: "Sushi Zen", location: "789 Pine Rd", items: "2x California Roll", total: "$25.00", time: "10:10 AM", date: "Today", status: "Accepted" },
    { id: "#ORD-7827", customer: "Tom Ray", restaurant: "Taco Town", location: "321 Elm Blvd", items: "3x Beef Tacos", total: "$18.00", time: "10:20 AM", date: "Today", status: "Accepted" },
  ];

  const filteredOrders = orders.filter(order => {
    const query = searchQuery.toLowerCase();
    return (
      order.id.toLowerCase().includes(query) ||
      order.customer.toLowerCase().includes(query) ||
      order.restaurant.toLowerCase().includes(query)
    );
  });

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
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white p-4 rounded-xl shadow border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-md font-semibold text-gray-800">{order.id}</h2>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <p className="text-sm text-gray-600"><strong>Customer:</strong> {order.customer}</p>
              <p className="text-sm text-gray-600"><strong>Restaurant:</strong> {order.restaurant}</p>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <MapPin className="w-4 h-4 mr-1" /> {order.location}
              </div>
              <div className="flex items-center text-sm text-gray-400 mt-1">
                <Clock className="w-4 h-4 mr-1" /> {order.date}, {order.time}
              </div>
              <div className="mt-2 flex gap-2">
                <button className="text-blue-600 hover:underline text-sm flex items-center">
                  <Eye className="w-4 h-4 mr-1" /> View
                </button>
                {order.status === "Accepted" && (
                  <button className="text-green-600 hover:underline text-sm flex items-center">
                    <Truck className="w-4 h-4 mr-1" /> Start Delivery
                  </button>
                )}
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
