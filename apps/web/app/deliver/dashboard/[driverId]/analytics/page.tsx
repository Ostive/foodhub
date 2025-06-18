"use client";

import { useState } from "react";
import { BarChart2, TrendingUp, DollarSign, ShoppingBag, Users, Clock, Calendar, ChevronDown, ArrowUp, ArrowDown } from "lucide-react";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("week");
  
  // Mock data for analytics
  const analyticsData = {
    revenue: {
      total: 4825.75,
      change: 12.5,
      trend: "up",
    },
    orders: {
      total: 187,
      change: 8.3,
      trend: "up",
    },
    customers: {
      total: 142,
      change: 15.2,
      trend: "up",
    },
    avgOrderValue: {
      total: 25.80,
      change: -2.1,
      trend: "down",
    },
    topSellingItems: [
      { name: "Margherita Pizza", quantity: 78, revenue: 1013.22 },
      { name: "Pepperoni Pizza", quantity: 65, revenue: 974.35 },
      { name: "Garlic Bread", quantity: 54, revenue: 269.46 },
      { name: "Tiramisu", quantity: 42, revenue: 251.58 },
      { name: "Coca Cola", quantity: 39, revenue: 97.11 },
    ],
    ordersByHour: [
      { hour: "10:00", orders: 5 },
      { hour: "11:00", orders: 8 },
      { hour: "12:00", orders: 24 },
      { hour: "13:00", orders: 32 },
      { hour: "14:00", orders: 18 },
      { hour: "15:00", orders: 12 },
      { hour: "16:00", orders: 9 },
      { hour: "17:00", orders: 14 },
      { hour: "18:00", orders: 22 },
      { hour: "19:00", orders: 28 },
      { hour: "20:00", orders: 19 },
      { hour: "21:00", orders: 11 },
      { hour: "22:00", orders: 6 },
    ],
    ordersByDay: [
      { day: "Monday", orders: 21 },
      { day: "Tuesday", orders: 18 },
      { day: "Wednesday", orders: 25 },
      { day: "Thursday", orders: 27 },
      { day: "Friday", orders: 35 },
      { day: "Saturday", orders: 42 },
      { day: "Sunday", orders: 29 },
    ],
  };

  // Helper function to get max value for chart scaling
  const getMaxValue = (data, key) => {
    return Math.max(...data.map(item => item[key])) * 1.2; // Add 20% padding
  };

  // Calculate max values for charts
  const maxOrdersByHour = getMaxValue(analyticsData.ordersByHour, "orders");
  const maxOrdersByDay = getMaxValue(analyticsData.ordersByDay, "orders");

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Analytics</h1>
          <p className="text-gray-600">Track your restaurant's performance and insights</p>
        </div>
        <div className="relative">
          <button className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50">
            <Calendar className="h-4 w-4" />
            <span>
              {timeRange === "today" && "Today"}
              {timeRange === "week" && "This Week"}
              {timeRange === "month" && "This Month"}
              {timeRange === "year" && "This Year"}
            </span>
            <ChevronDown className="h-4 w-4" />
          </button>
          {/* Time range dropdown would go here */}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-xs p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Total Revenue</h3>
            <div className="p-2 bg-orange-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-[#FF9800]" />
            </div>
          </div>
          <p className="text-3xl font-bold">${analyticsData.revenue.total.toFixed(2)}</p>
          <div className={`flex items-center mt-2 text-sm ${analyticsData.revenue.trend === "up" ? 'text-green-600' : 'text-red-600'}`}>
            {analyticsData.revenue.trend === "up" ? (
              <ArrowUp className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDown className="h-4 w-4 mr-1" />
            )}
            <span>{analyticsData.revenue.change}% from previous {timeRange}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xs p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Total Orders</h3>
            <div className="p-2 bg-orange-100 rounded-lg">
              <ShoppingBag className="h-5 w-5 text-[#FF9800]" />
            </div>
          </div>
          <p className="text-3xl font-bold">{analyticsData.orders.total}</p>
          <div className={`flex items-center mt-2 text-sm ${analyticsData.orders.trend === "up" ? 'text-green-600' : 'text-red-600'}`}>
            {analyticsData.orders.trend === "up" ? (
              <ArrowUp className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDown className="h-4 w-4 mr-1" />
            )}
            <span>{analyticsData.orders.change}% from previous {timeRange}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xs p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Total Customers</h3>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Users className="h-5 w-5 text-[#FF9800]" />
            </div>
          </div>
          <p className="text-3xl font-bold">{analyticsData.customers.total}</p>
          <div className={`flex items-center mt-2 text-sm ${analyticsData.customers.trend === "up" ? 'text-green-600' : 'text-red-600'}`}>
            {analyticsData.customers.trend === "up" ? (
              <ArrowUp className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDown className="h-4 w-4 mr-1" />
            )}
            <span>{analyticsData.customers.change}% from previous {timeRange}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xs p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Avg. Order Value</h3>
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-[#FF9800]" />
            </div>
          </div>
          <p className="text-3xl font-bold">${analyticsData.avgOrderValue.total.toFixed(2)}</p>
          <div className={`flex items-center mt-2 text-sm ${analyticsData.avgOrderValue.trend === "up" ? 'text-green-600' : 'text-red-600'}`}>
            {analyticsData.avgOrderValue.trend === "up" ? (
              <ArrowUp className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDown className="h-4 w-4 mr-1" />
            )}
            <span>{Math.abs(analyticsData.avgOrderValue.change)}% from previous {timeRange}</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Orders by Hour Chart */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders by Hour</h3>
          <div className="h-64 flex items-end space-x-2">
            {analyticsData.ordersByHour.map((item) => (
              <div key={item.hour} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-orange-200 rounded-t-sm hover:bg-orange-300 transition-colors"
                  style={{ height: `${(item.orders / maxOrdersByHour) * 100}%` }}
                ></div>
                <div className="text-xs text-gray-500 mt-1 rotate-45 origin-left translate-y-3">{item.hour}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Orders by Day Chart */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders by Day</h3>
          <div className="h-64 flex items-end space-x-2">
            {analyticsData.ordersByDay.map((item) => (
              <div key={item.day} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-orange-200 rounded-t-sm hover:bg-orange-300 transition-colors"
                  style={{ height: `${(item.orders / maxOrdersByDay) * 100}%` }}
                ></div>
                <div className="text-xs text-gray-500 mt-1">{item.day.substring(0, 3)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Selling Items */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-100 mb-8">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Top Selling Items</h3>
          <p className="text-gray-500">Your best performing menu items</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-3 text-gray-500 font-medium text-sm">Item Name</th>
                <th className="px-6 py-3 text-gray-500 font-medium text-sm">Quantity Sold</th>
                <th className="px-6 py-3 text-gray-500 font-medium text-sm">Revenue</th>
                <th className="px-6 py-3 text-gray-500 font-medium text-sm">% of Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {analyticsData.topSellingItems.map((item, index) => {
                const percentOfTotal = (item.revenue / analyticsData.revenue.total) * 100;
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.quantity}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">${item.revenue.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[150px]">
                          <div 
                            className="bg-[#FF9800] h-2.5 rounded-full" 
                            style={{ width: `${percentOfTotal}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">{percentOfTotal.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Insights</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-600">Average Preparation Time</span>
              <div className="flex items-center font-medium">
                <Clock className="h-4 w-4 mr-1 text-gray-400" />
                <span>18 mins</span>
              </div>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-600">Peak Order Time</span>
              <div className="flex items-center font-medium">
                <Clock className="h-4 w-4 mr-1 text-gray-400" />
                <span>19:00 - 20:00</span>
              </div>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-600">Busiest Day</span>
              <div className="flex items-center font-medium">
                <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                <span>Saturday</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Items Per Order</span>
              <span className="font-medium">2.7 items</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Insights</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-600">New Customers</span>
              <div className="flex items-center">
                <span className="font-medium">38</span>
                <span className="text-green-600 text-sm ml-2">(+12%)</span>
              </div>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-600">Returning Customers</span>
              <div className="flex items-center">
                <span className="font-medium">104</span>
                <span className="text-green-600 text-sm ml-2">(+8%)</span>
              </div>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-600">Customer Retention Rate</span>
              <div className="flex items-center">
                <span className="font-medium">73%</span>
                <span className="text-green-600 text-sm ml-2">(+5%)</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Orders per Customer</span>
              <span className="font-medium">1.3 orders</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
