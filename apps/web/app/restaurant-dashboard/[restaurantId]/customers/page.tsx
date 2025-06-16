"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Filter, ChevronDown, Mail, Phone, Calendar, DollarSign, ShoppingBag, Star, ArrowUpDown } from "lucide-react";

export default function CustomersPage() {
  const [sortField, setSortField] = useState("lastOrder");
  const [sortDirection, setSortDirection] = useState("desc");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data for customers
  const customers = [
    { 
      id: 1, 
      name: "Emma Wilson", 
      email: "emma.wilson@example.com", 
      phone: "+1 (555) 123-4567", 
      address: "123 Main St, New York, NY",
      totalSpent: 248.75, 
      totalOrders: 8, 
      lastOrder: "2025-04-22", 
      avgRating: 4.8,
      joinDate: "2024-12-15",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      status: "active"
    },
    { 
      id: 2, 
      name: "James Brown", 
      email: "james.brown@example.com", 
      phone: "+1 (555) 234-5678", 
      address: "456 Oak Ave, Brooklyn, NY",
      totalSpent: 187.50, 
      totalOrders: 6, 
      lastOrder: "2025-04-23", 
      avgRating: 4.5,
      joinDate: "2025-01-10",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      status: "active"
    },
    { 
      id: 3, 
      name: "Sophia Garcia", 
      email: "sophia.garcia@example.com", 
      phone: "+1 (555) 345-6789", 
      address: "789 Pine Rd, Queens, NY",
      totalSpent: 312.25, 
      totalOrders: 10, 
      lastOrder: "2025-04-20", 
      avgRating: 4.9,
      joinDate: "2024-11-05",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      status: "active"
    },
    { 
      id: 4, 
      name: "Michael Chen", 
      email: "michael.chen@example.com", 
      phone: "+1 (555) 456-7890", 
      address: "101 Maple Dr, Manhattan, NY",
      totalSpent: 156.80, 
      totalOrders: 5, 
      lastOrder: "2025-04-18", 
      avgRating: 4.7,
      joinDate: "2025-02-20",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg",
      status: "active"
    },
    { 
      id: 5, 
      name: "Olivia Martinez", 
      email: "olivia.martinez@example.com", 
      phone: "+1 (555) 567-8901", 
      address: "202 Cedar St, Bronx, NY",
      totalSpent: 89.95, 
      totalOrders: 3, 
      lastOrder: "2025-04-15", 
      avgRating: 4.2,
      joinDate: "2025-03-05",
      avatar: "https://randomuser.me/api/portraits/women/90.jpg",
      status: "active"
    },
    { 
      id: 6, 
      name: "William Johnson", 
      email: "william.johnson@example.com", 
      phone: "+1 (555) 678-9012", 
      address: "303 Birch Ave, Staten Island, NY",
      totalSpent: 275.40, 
      totalOrders: 9, 
      lastOrder: "2025-04-21", 
      avgRating: 4.6,
      joinDate: "2024-12-28",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      status: "active"
    },
    { 
      id: 7, 
      name: "Ava Thompson", 
      email: "ava.thompson@example.com", 
      phone: "+1 (555) 789-0123", 
      address: "404 Elm Rd, New York, NY",
      totalSpent: 132.60, 
      totalOrders: 4, 
      lastOrder: "2025-04-10", 
      avgRating: 4.4,
      joinDate: "2025-01-25",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg",
      status: "inactive"
    },
    { 
      id: 8, 
      name: "Ethan Rodriguez", 
      email: "ethan.rodriguez@example.com", 
      phone: "+1 (555) 890-1234", 
      address: "505 Spruce Dr, Brooklyn, NY",
      totalSpent: 198.35, 
      totalOrders: 7, 
      lastOrder: "2025-04-19", 
      avgRating: 4.3,
      joinDate: "2025-02-08",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      status: "active"
    },
  ];

  // Sort and filter customers
  const sortedAndFilteredCustomers = [...customers]
    .filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           customer.phone.includes(searchQuery);
      return matchesSearch;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "totalSpent":
          comparison = a.totalSpent - b.totalSpent;
          break;
        case "totalOrders":
          comparison = a.totalOrders - b.totalOrders;
          break;
        case "lastOrder":
          comparison = new Date(a.lastOrder).getTime() - new Date(b.lastOrder).getTime();
          break;
        case "avgRating":
          comparison = a.avgRating - b.avgRating;
          break;
        case "joinDate":
          comparison = new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Helper function to toggle sort
  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Helper function to render sort indicator
  const renderSortIndicator = (field) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 ml-1 text-gray-400" />;
    return sortDirection === "asc" ? 
      <ArrowUpDown className="h-4 w-4 ml-1 text-[#FF9800]" /> : 
      <ArrowUpDown className="h-4 w-4 ml-1 text-[#FF9800]" />;
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Customers</h1>
        <p className="text-gray-600">Manage and view information about your customers</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input 
            type="text" 
            placeholder="Search customers..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#FF9800] focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex space-x-2">
          <button className="flex items-center space-x-1 text-gray-700 hover:text-[#FF9800] text-sm font-medium px-4 py-2 bg-white rounded-lg shadow-xs border border-gray-200">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
          <button className="bg-[#FF9800] hover:bg-[#e65100] text-white px-4 py-2 rounded-lg text-sm font-medium">
            Export Customers
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-100 mb-8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-3 text-gray-500 font-medium text-sm">Customer</th>
                <th className="px-6 py-3 text-gray-500 font-medium text-sm cursor-pointer" onClick={() => toggleSort("totalSpent")}>
                  <div className="flex items-center">
                    <span>Total Spent</span>
                    {renderSortIndicator("totalSpent")}
                  </div>
                </th>
                <th className="px-6 py-3 text-gray-500 font-medium text-sm cursor-pointer" onClick={() => toggleSort("totalOrders")}>
                  <div className="flex items-center">
                    <span>Orders</span>
                    {renderSortIndicator("totalOrders")}
                  </div>
                </th>
                <th className="px-6 py-3 text-gray-500 font-medium text-sm cursor-pointer" onClick={() => toggleSort("lastOrder")}>
                  <div className="flex items-center">
                    <span>Last Order</span>
                    {renderSortIndicator("lastOrder")}
                  </div>
                </th>
                <th className="px-6 py-3 text-gray-500 font-medium text-sm cursor-pointer" onClick={() => toggleSort("avgRating")}>
                  <div className="flex items-center">
                    <span>Rating</span>
                    {renderSortIndicator("avgRating")}
                  </div>
                </th>
                <th className="px-6 py-3 text-gray-500 font-medium text-sm cursor-pointer" onClick={() => toggleSort("joinDate")}>
                  <div className="flex items-center">
                    <span>Join Date</span>
                    {renderSortIndicator("joinDate")}
                  </div>
                </th>
                <th className="px-6 py-3 text-gray-500 font-medium text-sm">Status</th>
                <th className="px-6 py-3 text-gray-500 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedAndFilteredCustomers.length > 0 ? (
                sortedAndFilteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 shrink-0">
                          <Image 
                            src={customer.avatar} 
                            alt={customer.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm font-medium text-gray-900">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                        {customer.totalSpent.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <ShoppingBag className="h-4 w-4 text-gray-400 mr-1" />
                        {customer.totalOrders}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        {formatDate(customer.lastOrder)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm text-gray-500">{customer.avgRating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(customer.joinDate)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {customer.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex space-x-2">
                        <button className="text-[#FF9800] hover:text-orange-700 font-medium">View</button>
                        <button className="text-gray-500 hover:text-gray-700 font-medium">Contact</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No customers found matching your search
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-xs p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Customers</h3>
          <p className="text-3xl font-bold text-[#FF9800]">{customers.length}</p>
          <p className="text-sm text-green-600 mt-1">+12% from last month</p>
        </div>
        <div className="bg-white rounded-xl shadow-xs p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Active Customers</h3>
          <p className="text-3xl font-bold text-[#FF9800]">{customers.filter(c => c.status === 'active').length}</p>
          <p className="text-sm text-green-600 mt-1">87.5% active rate</p>
        </div>
        <div className="bg-white rounded-xl shadow-xs p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Avg. Lifetime Value</h3>
          <p className="text-3xl font-bold text-[#FF9800]">
            ${(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length).toFixed(2)}
          </p>
          <p className="text-sm text-green-600 mt-1">+5% from last month</p>
        </div>
        <div className="bg-white rounded-xl shadow-xs p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Avg. Rating</h3>
          <div className="flex items-center">
            <p className="text-3xl font-bold text-[#FF9800]">
              {(customers.reduce((sum, c) => sum + c.avgRating, 0) / customers.length).toFixed(1)}
            </p>
            <Star className="h-6 w-6 text-yellow-400 ml-2" />
          </div>
          <p className="text-sm text-green-600 mt-1">+0.2 from last month</p>
        </div>
      </div>
    </>
  );
}
