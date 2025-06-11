"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Plus, Edit, Trash2, Save, X, AlertCircle, Check } from "lucide-react";
import Link from "next/link";

type Category = {
  id: string;
  name: string;
  description: string;
  itemCount: number;
};

export default function CategoriesPage() {
  const router = useRouter();
  const params = useParams();
  const restaurantId = params.restaurantId as string;
  
  // State for categories
  const [categories, setCategories] = useState<Category[]>([
    { id: "pizza", name: "Pizza", description: "Our signature pizzas made with fresh ingredients", itemCount: 8 },
    { id: "sides", name: "Sides", description: "Perfect accompaniments to your meal", itemCount: 5 },
    { id: "drinks", name: "Drinks", description: "Refreshing beverages", itemCount: 6 },
    { id: "desserts", name: "Desserts", description: "Sweet treats to finish your meal", itemCount: 4 },
    { id: "specials", name: "Specials", description: "Limited time offers and chef's specials", itemCount: 2 },
  ]);
  
  // State for new category form
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  
  // State for editing category
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", description: "" });
  
  // State for alerts
  const [alert, setAlert] = useState<{ type: "success" | "error", message: string } | null>(null);
  
  // Handle adding a new category
  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      setAlert({ type: "error", message: "Category name is required" });
      return;
    }
    
    // Generate a simple ID based on the name
    const id = newCategory.name.toLowerCase().replace(/\s+/g, "-");
    
    // Check if ID already exists
    if (categories.some(cat => cat.id === id)) {
      setAlert({ type: "error", message: "A category with this name already exists" });
      return;
    }
    
    const newCategoryWithId: Category = {
      id,
      name: newCategory.name,
      description: newCategory.description,
      itemCount: 0,
    };
    
    setCategories([...categories, newCategoryWithId]);
    setNewCategory({ name: "", description: "" });
    setIsAddingCategory(false);
    setAlert({ type: "success", message: "Category added successfully" });
    
    // Clear alert after 3 seconds
    setTimeout(() => setAlert(null), 3000);
  };
  
  // Handle starting to edit a category
  const handleStartEdit = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditForm({ name: category.name, description: category.description });
  };
  
  // Handle saving edited category
  const handleSaveEdit = (id: string) => {
    if (!editForm.name.trim()) {
      setAlert({ type: "error", message: "Category name is required" });
      return;
    }
    
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, name: editForm.name, description: editForm.description } : cat
    ));
    
    setEditingCategoryId(null);
    setAlert({ type: "success", message: "Category updated successfully" });
    
    // Clear alert after 3 seconds
    setTimeout(() => setAlert(null), 3000);
  };
  
  // Handle canceling edit
  const handleCancelEdit = () => {
    setEditingCategoryId(null);
  };
  
  // Handle deleting a category
  const handleDeleteCategory = (id: string) => {
    // In a real app, you'd want to confirm deletion first
    // and check if there are menu items in this category
    
    const categoryToDelete = categories.find(cat => cat.id === id);
    if (categoryToDelete && categoryToDelete.itemCount > 0) {
      setAlert({ 
        type: "error", 
        message: `Cannot delete category with ${categoryToDelete.itemCount} items. Move or delete the items first.` 
      });
      return;
    }
    
    setCategories(categories.filter(cat => cat.id !== id));
    setAlert({ type: "success", message: "Category deleted successfully" });
    
    // Clear alert after 3 seconds
    setTimeout(() => setAlert(null), 3000);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href={`/restaurant-dashboard/${restaurantId}/menu`} className="mr-4">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Menu Categories</h1>
        </div>
        
        <button
          onClick={() => setIsAddingCategory(true)}
          className="px-4 py-2 bg-[#4CAF50] hover:bg-[#388E3C] text-white rounded-lg flex items-center transition-colors"
          disabled={isAddingCategory}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Category
        </button>
      </div>
      
      {/* Alert message */}
      {alert && (
        <div className={`mb-6 p-4 rounded-lg flex items-start ${
          alert.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"
        }`}>
          {alert.type === "success" ? (
            <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-green-500" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-red-500" />
          )}
          <span>{alert.message}</span>
        </div>
      )}
      
      {/* Add new category form */}
      {isAddingCategory && (
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 mb-6">
          <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Category Name*</label>
              <input
                type="text"
                id="name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:outline-none transition-all duration-200"
                placeholder="e.g. Appetizers"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
              <input
                type="text"
                id="description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:outline-none transition-all duration-200"
                placeholder="e.g. Starters and small plates"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsAddingCategory(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCategory}
                className="px-4 py-2 bg-[#4CAF50] hover:bg-[#388E3C] text-white rounded-lg transition-colors"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Categories list */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 p-4 border-b border-gray-200">
          <div className="col-span-4 font-medium text-gray-700">Name</div>
          <div className="col-span-5 font-medium text-gray-700">Description</div>
          <div className="col-span-1 font-medium text-gray-700 text-center">Items</div>
          <div className="col-span-2 font-medium text-gray-700 text-right">Actions</div>
        </div>
        
        {categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No categories found. Add your first category to organize your menu.
          </div>
        ) : (
          <div>
            {categories.map((category) => (
              <div key={category.id} className="grid grid-cols-12 p-4 border-b border-gray-100 items-center hover:bg-gray-50">
                {editingCategoryId === category.id ? (
                  // Edit mode
                  <>
                    <div className="col-span-4">
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                      />
                    </div>
                    <div className="col-span-5">
                      <input
                        type="text"
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                      />
                    </div>
                    <div className="col-span-1 text-center">
                      {category.itemCount}
                    </div>
                    <div className="col-span-2 flex justify-end space-x-2">
                      <button
                        onClick={() => handleSaveEdit(category.id)}
                        className="p-1.5 bg-[#4CAF50] hover:bg-[#388E3C] text-white rounded-md transition-colors"
                        title="Save"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                        title="Cancel"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  // View mode
                  <>
                    <div className="col-span-4 font-medium text-gray-800">{category.name}</div>
                    <div className="col-span-5 text-gray-600">{category.description || "No description"}</div>
                    <div className="col-span-1 text-center">{category.itemCount}</div>
                    <div className="col-span-2 flex justify-end space-x-2">
                      <button
                        onClick={() => handleStartEdit(category)}
                        className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className={`p-1.5 ${category.itemCount > 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-600'} rounded-md transition-colors`}
                        title={category.itemCount > 0 ? "Cannot delete category with items" : "Delete"}
                        disabled={category.itemCount > 0}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Help text */}
      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
        <p className="flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-blue-500" />
          <span>
            <strong>Note:</strong> Categories with menu items cannot be deleted. You must first move or delete all items in a category before you can delete it.
          </span>
        </p>
      </div>
    </div>
  );
}
