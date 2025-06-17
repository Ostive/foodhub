"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Plus, Edit, Trash2, Search, Filter, ChevronDown, DollarSign, Tag, Clock, ChevronUp, Eye, CheckCircle, XCircle } from "lucide-react";

export default function MenuPage() {
  const params = useParams();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });
  
  // Mock data for menu categories
  const categories = [
    { id: "all", name: "All Items" },
    { id: "pizza", name: "Pizza" },
    { id: "sides", name: "Sides" },
    { id: "drinks", name: "Drinks" },
    { id: "desserts", name: "Desserts" },
    { id: "specials", name: "Specials" },
  ];

  // Define menu item type
  type MenuItem = {
    id: number;
    name: string;
    category: string;
    price: number;
    description: string;
    image: string;
    prepTime: string;
    isAvailable: boolean;
    isPopular: boolean;
    [key: string]: any; // Index signature to allow string indexing
  };

  // Mock data for menu items
  const menuItems: MenuItem[] = [
    { 
      id: 1, 
      name: "Margherita Pizza", 
      category: "pizza", 
      price: 12.99, 
      description: "Classic pizza with tomato sauce, mozzarella, and basil", 
      image: "https://images.unsplash.com/photo-1548365328-8b849e6c7b85?auto=format&fit=crop&w=400&q=80",
      prepTime: "15 min",
      isAvailable: true,
      isPopular: true
    },
    { 
      id: 2, 
      name: "Pepperoni Pizza", 
      category: "pizza", 
      price: 14.99, 
      description: "Classic pizza topped with pepperoni slices", 
      image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=400&q=80",
      prepTime: "15 min",
      isAvailable: true,
      isPopular: true
    },
    { 
      id: 3, 
      name: "Vegetarian Pizza", 
      category: "pizza", 
      price: 13.99, 
      description: "Pizza topped with bell peppers, mushrooms, onions, and olives", 
      image: "https://images.unsplash.com/photo-1564936281291-294551497d81?auto=format&fit=crop&w=400&q=80",
      prepTime: "15 min",
      isAvailable: true,
      isPopular: false
    },
    { 
      id: 4, 
      name: "Garlic Bread", 
      category: "sides", 
      price: 4.99, 
      description: "Toasted bread with garlic butter and herbs", 
      image: "https://images.unsplash.com/photo-1619535860434-cf9b2bca5e82?auto=format&fit=crop&w=400&q=80",
      prepTime: "8 min",
      isAvailable: true,
      isPopular: true
    },
    { 
      id: 5, 
      name: "Caesar Salad", 
      category: "sides", 
      price: 6.99, 
      description: "Fresh romaine lettuce with Caesar dressing, croutons, and parmesan", 
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
      prepTime: "5 min",
      isAvailable: true,
      isPopular: false
    },
    { 
      id: 6, 
      name: "Coca Cola", 
      category: "drinks", 
      price: 2.49, 
      description: "Classic cola drink, served cold", 
      image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=400&q=80",
      prepTime: "1 min",
      isAvailable: true,
      isPopular: false
    },
    { 
      id: 7, 
      name: "Tiramisu", 
      category: "desserts", 
      price: 5.99, 
      description: "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream", 
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80",
      prepTime: "3 min",
      isAvailable: true,
      isPopular: true
    },
    { 
      id: 8, 
      name: "Family Feast", 
      category: "specials", 
      price: 29.99, 
      description: "Large pizza, garlic bread, 4 drinks, and a dessert", 
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
      prepTime: "25 min",
      isAvailable: true,
      isPopular: true
    },
  ];

  // Filter menu items based on category and search query
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort items based on sortConfig
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Request sort for a specific column
  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get sort indicator for column header
  const getSortIndicator = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="h-4 w-4 ml-1" /> : 
      <ChevronDown className="h-4 w-4 ml-1" />;
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Menu Management</h1>
          <p className="text-gray-600">Add, edit, and manage your restaurant menu</p>
        </div>
        <div className="flex space-x-3">
          <Link href={`/restaurant-dashboard/${params.restaurantId}/menu/categories`} className="bg-[#4CAF50] hover:bg-[#388E3C] text-white px-4 py-2 rounded-lg flex items-center">
            <Tag className="h-5 w-5 mr-2" />
            Manage Categories
          </Link>
          <Link href={`/restaurant-dashboard/${params.restaurantId}/menu/manage`} className="bg-[#FF9800] hover:bg-[#e65100] text-white px-4 py-2 rounded-lg flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Add New Item
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="flex overflow-x-auto pb-2 hide-scrollbar">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap mr-2 ${activeCategory === category.id ? 'bg-[#FF9800] text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
            >
              {category.name}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input 
            type="text" 
            placeholder="Search menu items..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#FF9800] focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Menu Items Table */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Image</th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('name')}
                >
                  <div className="flex items-center">
                    Name {getSortIndicator('name')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('category')}
                >
                  <div className="flex items-center">
                    Category {getSortIndicator('category')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('price')}
                >
                  <div className="flex items-center">
                    Price {getSortIndicator('price')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('prepTime')}
                >
                  <div className="flex items-center">
                    Prep Time {getSortIndicator('prepTime')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('isAvailable')}
                >
                  <div className="flex items-center">
                    Status {getSortIndicator('isAvailable')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('isPopular')}
                >
                  <div className="flex items-center">
                    Popular {getSortIndicator('isPopular')}
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedItems.length > 0 ? (
                sortedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative h-12 w-12 rounded-md overflow-hidden">
                        <Image 
                          src={item.image} 
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">{item.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#FF9800]">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-400" />
                        {item.prepTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {item.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.isPopular ? (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Popular
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                          <Eye className="h-4 w-4 text-gray-500" />
                        </button>
                        <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                          <Edit className="h-4 w-4 text-blue-500" />
                        </button>
                        <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                    <p>No menu items found matching your criteria</p>
                    <button 
                      onClick={() => { setActiveCategory("all"); setSearchQuery(""); }}
                      className="mt-2 text-[#FF9800] hover:underline"
                    >
                      Clear filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Menu Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-xs p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Items</h3>
          <p className="text-3xl font-bold text-[#FF9800]">{menuItems.length}</p>
          <p className="text-sm text-gray-500 mt-1">Across {categories.length - 1} categories</p>
        </div>
        <div className="bg-white rounded-xl shadow-xs p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Popular Items</h3>
          <p className="text-3xl font-bold text-[#FF9800]">{menuItems.filter(item => item.isPopular).length}</p>
          <p className="text-sm text-gray-500 mt-1">Based on order frequency</p>
        </div>
        <div className="bg-white rounded-xl shadow-xs p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Avg. Item Price</h3>
          <p className="text-3xl font-bold text-[#FF9800]">
            ${(menuItems.reduce((sum, item) => sum + item.price, 0) / menuItems.length).toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Excluding special offers</p>
        </div>
        <div className="bg-white rounded-xl shadow-xs p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Unavailable</h3>
          <p className="text-3xl font-bold text-[#FF9800]">{menuItems.filter(item => !item.isAvailable).length}</p>
          <p className="text-sm text-gray-500 mt-1">Items currently not available</p>
        </div>
      </div>

      {/* Add Item Modal (simplified) */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Add New Menu Item</h2>
              <p className="text-gray-500">Enter the details for your new menu item</p>
            </div>
            <div className="p-6 space-y-4">
              {/* Form fields would go here */}
              <p className="text-center text-gray-500 py-8">Form implementation simplified for this example</p>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
              <button 
                onClick={() => setShowAddItemModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowAddItemModal(false)}
                className="px-4 py-2 bg-[#FF9800] text-white rounded-lg hover:bg-[#e65100]"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
