"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { User, MapPin, Phone, Mail, Lock, Edit, Save, X, Camera, CreditCard, Bell, Shield, Clock, Heart, LogOut, Trash2, Plus } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import CustomerNavbar from "../_components/CustomerNavbar";

type PaymentMethod = {
  id: string;
  type: "card" | "paypal";
  name: string;
  last4?: string;
  expiry?: string;
  icon: string;
};

type NotificationSetting = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
};

type ProfileTab = "personal" | "payment" | "notifications" | "security";

interface ProfileClientProps {
  initialUserData: any;
  initialPaymentMethods: PaymentMethod[];
  initialNotificationSettings: NotificationSetting[];
  error: string | null;
}

export default function ProfileClient({ 
  initialUserData, 
  initialPaymentMethods, 
  initialNotificationSettings,
  error 
}: ProfileClientProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>("personal");
  const [showAddPaymentForm, setShowAddPaymentForm] = useState(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [showEnableTwoFactorForm, setShowEnableTwoFactorForm] = useState(false);
  
  // User data state
  const [userData, setUserData] = useState({
    name: initialUserData?.name || "User",
    email: initialUserData?.email || "user@example.com",
    phone: initialUserData?.phone || "+1 (555) 123-4567",
    address: initialUserData?.address || "123 Main St, New York, NY 10001",
    avatar: initialUserData?.avatar || "/images/default-avatar.png" // Use local default image
  });
  
  // Form state
  const [formData, setFormData] = useState({ ...userData });
  
  // Payment methods state
  const [paymentMethods, setPaymentMethods] = useState<any[]>(
    initialUserData?.creditCards || initialPaymentMethods || []
  );
  
  // New credit card state
  const [newCreditCard, setNewCreditCard] = useState({
    creditCardNumber: '',
    expiryDate: '',
    name: ''
  });
  
  // Credit card form state
  const [showAddCardForm, setShowAddCardForm] = useState(false);
  
  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>(
    initialNotificationSettings || []
  );
  
  // Handle logout
  const handleLogout = () => {
    logout();
    router.push("/customer/login");
  };
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Get the auth token from cookies
      const authToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];
      
      if (!authToken) {
        console.error('No auth token found');
        return;
      }
      
      // Save the data to the server using our new PATCH endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/users/customers/email/${userData.email}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.statusText}`);
      }
      
      const updatedData = await response.json();
      // Ensure avatar is never empty
      const updatedUserData = {
        ...updatedData,
        avatar: updatedData.avatar || userData.avatar || "/images/default-avatar.png"
      };
      setUserData(updatedUserData);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };
  
  // Handle cancel edit
  const handleCancelEdit = () => {
    setFormData(userData);
    setIsEditing(false);
  };
  
  // Toggle notification setting
  const toggleNotification = (id: string) => {
    setNotificationSettings(prev => 
      prev.map(setting => 
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
    // In a real app, we would save the setting to the server here
  };
  
  // Handle credit card input change
  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCreditCard(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle add credit card
  const handleAddCreditCard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Get the auth token from cookies
      const authToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];
      
      if (!authToken) {
        console.error('No auth token found');
        return;
      }
      
      // Add the new credit card to the server
      const response = await fetch(`${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/users/customers/email/${userData.email}/credit-cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(newCreditCard)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to add credit card: ${response.statusText}`);
      }
      
      const updatedUser = await response.json();
      
      // Update the payment methods state with the new credit cards
      setPaymentMethods(updatedUser.creditCards || []);
      
      // Reset the form
      setNewCreditCard({
        creditCardNumber: '',
        expiryDate: '',
        name: ''
      });
      setShowAddCardForm(false);
      
      alert('Credit card added successfully!');
    } catch (error) {
      console.error('Error adding credit card:', error);
      alert('Failed to add credit card. Please try again.');
    }
  };
  
  // Handle delete credit card
  const handleDeleteCreditCard = async (creditCardId: number) => {
    try {
      // Get the auth token from cookies
      const authToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];
      
      if (!authToken) {
        console.error('No auth token found');
        return;
      }
      
      // Delete the credit card from the server
      const response = await fetch(`${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/users/customers/email/${userData.email}/credit-cards/${creditCardId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete credit card: ${response.statusText}`);
      }
      
      // Update the payment methods state
      setPaymentMethods(prev => prev.filter(card => card.creditCardId !== creditCardId));
      
      alert('Credit card deleted successfully!');
    } catch (error) {
      console.error('Error deleting credit card:', error);
      alert('Failed to delete credit card. Please try again.');
    }
  };
  
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <CustomerNavbar />
      
      <div className="max-w-6xl mx-auto px-4 pt-24">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            Error loading profile: {error}
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden">
                  <Image 
                    src={userData.avatar} 
                    alt={userData.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 shadow-md">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h2 className="text-xl font-semibold">{userData.name}</h2>
              <p className="text-gray-500 text-sm">{userData.email}</p>
            </div>
            
            <nav className="space-y-1">
              <button 
                onClick={() => setActiveTab("personal")}
                className={`w-full flex items-center px-4 py-2 rounded-md ${
                  activeTab === "personal" 
                    ? "bg-primary text-white" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <User className="w-5 h-5 mr-3" />
                Personal Info
              </button>
              <button 
                onClick={() => setActiveTab("payment")}
                className={`w-full flex items-center px-4 py-2 rounded-md ${
                  activeTab === "payment" 
                    ? "bg-primary text-white" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <CreditCard className="w-5 h-5 mr-3" />
                Payment Methods
              </button>
              <button 
                onClick={() => setActiveTab("notifications")}
                className={`w-full flex items-center px-4 py-2 rounded-md ${
                  activeTab === "notifications" 
                    ? "bg-primary text-white" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Bell className="w-5 h-5 mr-3" />
                Notifications
              </button>
              <button 
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center px-4 py-2 rounded-md ${
                  activeTab === "security" 
                    ? "bg-primary text-white" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Shield className="w-5 h-5 mr-3" />
                Security
              </button>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 rounded-md text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </nav>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            {/* Personal Info Tab */}
            {activeTab === "personal" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Personal Information</h2>
                  {!isEditing ? (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="flex items-center text-primary hover:text-primary-dark"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button 
                        onClick={handleCancelEdit}
                        className="flex items-center text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </button>
                      <button 
                        onClick={handleSubmit}
                        className="flex items-center text-primary hover:text-primary-dark"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </button>
                    </div>
                  )}
                </div>
                
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <User className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium">{userData.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Mail className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Email Address</p>
                        <p className="font-medium">{userData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Phone Number</p>
                        <p className="font-medium">{userData.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium">{userData.address}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Payment Methods Tab */}
            {activeTab === "payment" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Payment Methods</h2>
                  <button 
                    onClick={() => setShowAddCardForm(true)}
                    className="flex items-center text-primary hover:text-primary-dark"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add New Card
                  </button>
                </div>
                
                {showAddCardForm && (
                  <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Add New Credit Card</h3>
                    <form onSubmit={handleAddCreditCard} className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={newCreditCard.name}
                          onChange={handleCardInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="creditCardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          id="creditCardNumber"
                          name="creditCardNumber"
                          value={newCreditCard.creditCardNumber}
                          onChange={handleCardInputChange}
                          placeholder="1234567890123456"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                          required
                          maxLength={16}
                        />
                      </div>
                      <div>
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date (MM/YY)
                        </label>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          value={newCreditCard.expiryDate}
                          onChange={handleCardInputChange}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                          required
                          maxLength={5}
                        />
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddCardForm(false)}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                        >
                          Add Card
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                {paymentMethods.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">No payment methods added yet</p>
                    <button 
                      onClick={() => setShowAddCardForm(true)}
                      className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                    >
                      Add Credit Card
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paymentMethods.map((card) => (
                      <div 
                        key={card.creditCardId} 
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 mr-4 flex items-center justify-center bg-gray-100 rounded-md">
                            <CreditCard className="w-6 h-6 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium">{card.name}</p>
                            <p className="text-sm text-gray-500">
                              •••• •••• •••• {card.creditCardNumber.slice(-4)}
                            </p>
                            <p className="text-xs text-gray-500">Expires {card.expiryDate}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDeleteCreditCard(card.creditCardId)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold">Notification Preferences</h2>
                  <p className="text-gray-500 mt-1">Manage how you receive notifications</p>
                </div>
                
                <div className="space-y-4">
                  {notificationSettings.map((setting) => (
                    <div 
                      key={setting.id} 
                      className="flex items-center justify-between p-4 border border-gray-100 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{setting.name}</p>
                        <p className="text-sm text-gray-500">{setting.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={setting.enabled}
                          onChange={() => toggleNotification(setting.id)}
                        />
                        <div className={`w-11 h-6 rounded-full peer ${setting.enabled ? 'bg-primary' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-opacity-50 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${setting.enabled ? 'after:translate-x-full' : ''}`}></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold">Security Settings</h2>
                  <p className="text-gray-500 mt-1">Manage your account security</p>
                </div>
                
                <div className="space-y-6">
                  {/* Password Section */}
                  <div className="border-b border-gray-200 pb-6">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="font-medium">Password</h3>
                        <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                      </div>
                      <button 
                        onClick={() => setShowChangePasswordForm(true)}
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>
                  
                  {/* Two-Factor Authentication */}
                  <div className="border-b border-gray-200 pb-6">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="font-medium">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <button 
                        onClick={() => setShowEnableTwoFactorForm(true)}
                        className="px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary-50"
                      >
                        Enable
                      </button>
                    </div>
                  </div>
                  
                  {/* Login History */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="font-medium">Login History</h3>
                        <p className="text-sm text-gray-500">Recent login activity</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center">
                          <div className="bg-green-100 p-2 rounded-full mr-3">
                            <Shield className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Current Session</p>
                            <p className="text-xs text-gray-500">New York, USA • Chrome on Windows</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">Just now</p>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center">
                          <div className="bg-gray-100 p-2 rounded-full mr-3">
                            <Shield className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Previous Login</p>
                            <p className="text-xs text-gray-500">New York, USA • Chrome on Windows</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">Yesterday</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
