"use client";

import { useState } from "react";
import { Clock, Search, Filter, ChevronDown, Eye, Truck, CheckCircle, XCircle } from "lucide-react";

export default function OrdersPage() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data
  const orders = [
    { id: "#ORD-7829", customer: "Emma Wilson", items: "2u00d7 Margherita, 1u00d7 Garlic Bread", total: "$32.50", time: "10:15 AM", date: "Today", status: "Preparing" },
    { id: "#ORD-7830", customer: "James Brown", items: "1u00d7 Pepperoni, 1u00d7 Coke", total: "$18.99", time: "10:20 AM", date: "Today", status: "New" },
    { id: "#ORD-7831", customer: "Sophia Garcia", items: "1u00d7 Vegetarian, 2u00d7 Water", total: "$22.50", time: "10:25 AM", date: "Today", status: "New" },
    { id: "#ORD-7825", customer: "Michael Chen", items: "1u00d7 Hawaiian, 1u00d7 Wings, 1u00d7 Sprite", total: "$29.99", time: "9:30 AM", date: "Today", status: "Out for Delivery" },
    { id: "#ORD-7820", customer: "Sarah Johnson", items: "1u00d7 Meat Lovers, 1u00d7 Garlic Knots", total: "$26.50", time: "8:45 AM", date: "Today", status: "Delivered" },
    { id: "#ORD-7815", customer: "David Wilson", items: "1u00d7 Veggie Supreme, 1u00d7 Caesar Salad", total: "$24.99", time: "8:15 AM", date: "Today", status: "Delivered" },
    { id: "#ORD-7810", customer: "Lisa Rodriguez", items: "2u00d7 Cheese Pizza, 1u00d7 Breadsticks", total: "$27.50", time: "7:45 PM", date: "Yesterday", status: "Delivered" },
    { id: "#ORD-7805", customer: "Robert Taylor", items: "1u00d7 BBQ Chicken, 1u00d7 Onion Rings", total: "$23.99", time: "7:15 PM", date: "Yesterday", status: "Delivered" },
    { id: "#ORD-7800", customer: "Jennifer Lee", items: "1u00d7 Margherita, 1u00d7 Greek Salad", total: "$21.50", time: "6:30 PM", date: "Yesterday", status: "Cancelled" },
  ];

  // Filter orders based on status and search query
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === "all" || order.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'out for delivery': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Orders</h1>
        <p className="text-gray-600">Manage and track all your restaurant orders</p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setFilterStatus("all")} 
            className={`px-4 py-2 rounded-lg text-sm font-medium ${filterStatus === "all" ? 'bg-[#FF9800] text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
          >
            All Orders
          </button>
          <button 
            onClick={() => setFilterStatus("new")} 
            className={`px-4 py-2 rounded-lg text-sm font-medium ${filterStatus === "new" ? 'bg-[#FF9800] text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
          >
            New
          </button>
          <button 
            onClick={() => setFilterStatus("preparing")} 
            className={`px-4 py-2 rounded-lg text-sm font-medium ${filterStatus === "preparing" ? 'bg-[#FF9800] text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
          >
            Preparing
          </button>
          <button 
            onClick={() => setFilterStatus("out for delivery")} 
            className={`px-4 py-2 rounded-lg text-sm font-medium ${filterStatus === "out for delivery" ? 'bg-[#FF9800] text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
          >
            Out for Delivery
          </button>
          <button 
            onClick={() => setFilterStatus("delivered")} 
            className={`px-4 py-2 rounded-lg text-sm font-medium ${filterStatus === "delivered" ? 'bg-[#FF9800] text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
          >
            Delivered
          </button>
          <button 
            onClick={() => setFilterStatus("cancelled")} 
            className={`px-4 py-2 rounded-lg text-sm font-medium ${filterStatus === "cancelled" ? 'bg-[#FF9800] text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
          >
            Cancelled
          </button>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input 
            type="text" 
            placeholder="Search orders..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF9800] focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-3 text-gray-500 font-medium text-sm">Order ID</th>
                <th className="px-6 py-3 text-gray-500 font-medium text-sm">Customer</th>
                <th className="px-6 py-3 text-gray-500 font-medium text-sm">Items</th>
                <th className="px-6 py-3 text-gray-500 font-medium text-sm">Total</th>
                <th className="px-6 py-3 text-gray-500 font-medium text-sm">Date & Time</th>
                <th className="px-6 py-3 text-gray-500 font-medium text-sm">Status</th>
                <th className="px-6 py-3 text-gray-500 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{order.customer}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{order.items}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.total}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex flex-col">
                        <span>{order.date}</span>
                        <div className="flex items-center text-xs text-gray-400">
                          <Clock className="h-3 w-3 mr-1" />
                          {order.time}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800" title="View Details">
                          <Eye className="h-4 w-4" />
                        </button>
                        {order.status === "New" && (
                          <button className="text-yellow-600 hover:text-yellow-800" title="Start Preparing">
                            <Truck className="h-4 w-4" />
                          </button>
                        )}
                        {(order.status === "New" || order.status === "Preparing") && (
                          <button className="text-red-600 hover:text-red-800" title="Cancel Order">
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                        {order.status === "Preparing" && (
                          <button className="text-green-600 hover:text-green-800" title="Mark as Ready for Delivery">
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No orders found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Today's Orders</h3>
          <p className="text-3xl font-bold text-[#FF9800]">12</p>
          <p className="text-sm text-gray-500 mt-1">6 completed, 6 in progress</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Average Prep Time</h3>
          <p className="text-3xl font-bold text-[#FF9800]">18 min</p>
          <p className="text-sm text-gray-500 mt-1">2 min faster than last week</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Delivery Success</h3>
          <p className="text-3xl font-bold text-[#FF9800]">98%</p>
          <p className="text-sm text-gray-500 mt-1">2% increase from last month</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Cancelled Orders</h3>
          <p className="text-3xl font-bold text-[#FF9800]">3</p>
          <p className="text-sm text-gray-500 mt-1">Down from 5 last week</p>
        </div>
      </div>
    </>
  );
}
