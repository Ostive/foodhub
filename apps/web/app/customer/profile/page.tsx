"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CustomerNavbar from "../_components/CustomerNavbar";
import Image from "next/image";
import Link from "next/link";
import { User, MapPin, Phone, Mail, Lock, Edit, Save, X, Camera, CreditCard, Bell, Shield, Clock, Heart, LogOut, Trash2, Plus, Calendar } from "lucide-react";
import { isLoggedIn } from "../_utils/authState";

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

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>("personal");
  const [showAddPaymentForm, setShowAddPaymentForm] = useState(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [showEnableTwoFactorForm, setShowEnableTwoFactorForm] = useState(false);
  
  // Mock user data
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, New York, NY 10001",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  });
  
  // Form state
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    address: userData.address
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // New payment method form state
  const [newPaymentForm, setNewPaymentForm] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    type: "card" as "card" | "paypal"
  });

  // Two-factor form state
  const [twoFactorForm, setTwoFactorForm] = useState({
    phoneNumber: userData.phone,
    verificationCode: ""
  });
  
  // Mock payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "card-1",
      type: "card",
      name: "Visa ending in 4242",
      last4: "4242",
      expiry: "12/25",
      icon: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
    },
    {
      id: "paypal-1",
      type: "paypal",
      name: "PayPal - john.doe@example.com",
      icon: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
    }
  ]);

  // Mock notification settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: "order-updates",
      name: "Order Updates",
      description: "Get notified about your order status",
      enabled: true
    },
    {
      id: "promotions",
      name: "Promotions & Deals",
      description: "Receive special offers and discounts",
      enabled: true
    },
    {
      id: "newsletter",
      name: "Newsletter",
      description: "Stay updated with our weekly newsletter",
      enabled: false
    },
    {
      id: "restaurant-updates",
      name: "Restaurant Updates",
      description: "Get notified when your favorite restaurants add new items",
      enabled: true
    }
  ]);
  
  // Check authentication
  useEffect(() => {
    if (!isLoggedIn.value) {
      router.push("/customer/login");
    }
  }, [router]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update user data
    setUserData(prev => ({
      ...prev,
      ...formData
    }));
    setIsEditing(false);
  };
  
  const cancelEdit = () => {
    // Reset form data to current user data
    setFormData({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      address: userData.address
    });
    setIsEditing(false);
  };

  const toggleNotification = (id: string) => {
    setNotificationSettings(prev => 
      prev.map(setting => 
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  const removePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
  };

  const handleLogout = () => {
    isLoggedIn.value = false;
    router.push("/customer/login");
  };
  
  // Handle adding a new payment method
  const handleAddPaymentMethod = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate a random ID for the new payment method
    const newId = `card-${Math.floor(Math.random() * 10000)}`;
    
    // Create a new payment method object
    const newMethod: PaymentMethod = {
      id: newId,
      type: newPaymentForm.type,
      name: newPaymentForm.type === 'card' 
        ? `${newPaymentForm.cardName.split(' ')[0]} ending in ${newPaymentForm.cardNumber.slice(-4)}` 
        : `PayPal - ${userData.email}`,
      last4: newPaymentForm.cardNumber.slice(-4),
      expiry: newPaymentForm.expiryDate,
      icon: newPaymentForm.type === 'card' 
        ? "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
        : "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
    };
    
    // Add the new payment method to the list
    setPaymentMethods(prev => [...prev, newMethod]);
    
    // Reset the form
    setNewPaymentForm({
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
      type: "card"
    });
    
    // Hide the form
    setShowAddPaymentForm(false);
  };
  
  // Handle changing password
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }
    
    // In a real app, you would send this to an API
    console.log("Password changed successfully!");
    
    // Reset the form
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    
    // Hide the form
    setShowChangePasswordForm(false);
  };
  
  // Handle enabling two-factor authentication
  const handleEnableTwoFactor = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate verification code
    if (twoFactorForm.verificationCode.length !== 6) {
      alert("Verification code must be 6 digits!");
      return;
    }
    
    // In a real app, you would send this to an API
    console.log("Two-factor authentication enabled!");
    
    // Reset the form
    setTwoFactorForm({
      phoneNumber: userData.phone,
      verificationCode: ""
    });
    
    // Hide the form
    setShowEnableTwoFactorForm(false);
  };

  return (
    <div className="bg-[#f8f9fa] min-h-svh">
      <CustomerNavbar forceLight={true} />
      <main className="pt-20 pb-20">
        <div className="max-w-6xl mx-auto px-4" style={{ marginTop: "30px" }}>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="md:w-64">
              <div className="bg-white rounded-xl shadow-xs overflow-hidden sticky top-24">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full overflow-hidden">
                      <Image 
                        src={userData.avatar} 
                        alt={userData.name} 
                        width={48} 
                        height={48} 
                        className="object-cover" 
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{userData.name}</h3>
                      <p className="text-sm text-gray-500">{userData.email}</p>
                    </div>
                  </div>
                </div>
                <nav className="p-2">
                  <button 
                    onClick={() => setActiveTab("personal")}
                    className={`w-full flex items-center px-4 py-2 rounded-lg text-left ${activeTab === "personal" ? 'bg-[#4CAF50]/10 text-[#4CAF50]' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <User className="h-5 w-5 mr-3" /> Personal Info
                  </button>
                  <button 
                    onClick={() => setActiveTab("payment")}
                    className={`w-full flex items-center px-4 py-2 rounded-lg text-left ${activeTab === "payment" ? 'bg-[#4CAF50]/10 text-[#4CAF50]' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <CreditCard className="h-5 w-5 mr-3" /> Payment Methods
                  </button>
                  <button 
                    onClick={() => setActiveTab("notifications")}
                    className={`w-full flex items-center px-4 py-2 rounded-lg text-left ${activeTab === "notifications" ? 'bg-[#4CAF50]/10 text-[#4CAF50]' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <Bell className="h-5 w-5 mr-3" /> Notifications
                  </button>
                  <button 
                    onClick={() => setActiveTab("security")}
                    className={`w-full flex items-center px-4 py-2 rounded-lg text-left ${activeTab === "security" ? 'bg-[#4CAF50]/10 text-[#4CAF50]' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <Shield className="h-5 w-5 mr-3" /> Security
                  </button>
                </nav>
                <div className="p-4 border-t border-gray-100">
                  <Link href="/customer/orders" className="w-full flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
                    <Clock className="h-5 w-5 mr-3" /> Order History
                  </Link>
                  <Link href="/customer/favorites" className="w-full flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
                    <Heart className="h-5 w-5 mr-3" /> Saved Restaurants
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 mt-2"
                  >
                    <LogOut className="h-5 w-5 mr-3" /> Sign Out
                  </button>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1">
              {/* Personal Info Tab */}
              {activeTab === "personal" && (
                <div className="bg-white rounded-xl shadow-xs overflow-hidden">
                  <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                    {!isEditing ? (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center text-sm font-medium"
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </button>
                    ) : (
                      <button 
                        onClick={cancelEdit}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center text-sm font-medium"
                      >
                        <X className="h-4 w-4 mr-1" /> Cancel
                      </button>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center mb-8">
                      <div className="relative mb-4 sm:mb-0 sm:mr-6">
                        <div className="h-24 w-24 rounded-full overflow-hidden">
                          <Image 
                            src={userData.avatar} 
                            alt={userData.name} 
                            width={96} 
                            height={96} 
                            className="object-cover" 
                          />
                        </div>
                        {isEditing && (
                          <button className="absolute bottom-0 right-0 bg-[#4CAF50] text-white p-2 rounded-full shadow-md hover:bg-[#388E3C] transition-colors">
                            <Camera className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{userData.name}</h3>
                        <p className="text-gray-500">Update your profile photo and personal details</p>
                      </div>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <User className="inline h-4 w-4 mr-1" /> Full Name
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                            />
                          ) : (
                            <p className="text-gray-900 py-2">{userData.name}</p>
                          )}
                        </div>
                        
                        {/* Email */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <Mail className="inline h-4 w-4 mr-1" /> Email Address
                          </label>
                          {isEditing ? (
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                            />
                          ) : (
                            <p className="text-gray-900 py-2">{userData.email}</p>
                          )}
                        </div>
                        
                        {/* Phone */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <Phone className="inline h-4 w-4 mr-1" /> Phone Number
                          </label>
                          {isEditing ? (
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                            />
                          ) : (
                            <p className="text-gray-900 py-2">{userData.phone}</p>
                          )}
                        </div>
                        
                        {/* Address */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <MapPin className="inline h-4 w-4 mr-1" /> Delivery Address
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                            />
                          ) : (
                            <p className="text-gray-900 py-2">{userData.address}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Save button */}
                      {isEditing && (
                        <div className="mt-6">
                          <button 
                            type="submit"
                            className="px-6 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#388E3C] transition-colors flex items-center"
                          >
                            <Save className="h-4 w-4 mr-2" /> Save Changes
                          </button>
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              )}
              
              {/* Payment Methods Tab */}
              {activeTab === "payment" && (
                <div className="bg-white rounded-xl shadow-xs overflow-hidden">
                  <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Payment Methods</h2>
                    <button 
                      onClick={() => setShowAddPaymentForm(true)}
                      className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#388E3C] transition-colors flex items-center text-sm font-medium"
                    >
                      <CreditCard className="h-4 w-4 mr-1" /> Add New
                    </button>
                  </div>
                  
                  <div className="p-6">
                    {paymentMethods.length > 0 ? (
                      <div className="space-y-4">
                        {paymentMethods.map(method => (
                          <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center">
                              <div className="h-10 w-16 relative mr-4">
                                <Image 
                                  src={method.icon} 
                                  alt={method.type} 
                                  fill
                                  className="object-contain" 
                                />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">{method.name}</h3>
                                {method.expiry && (
                                  <p className="text-sm text-gray-500">Expires {method.expiry}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => removePaymentMethod(method.id)}
                                className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CreditCard className="h-12 w-12 mx-auto text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No payment methods</h3>
                        <p className="mt-1 text-gray-500">Add a payment method to make checkout faster</p>
                        <button 
                          onClick={() => setShowAddPaymentForm(true)}
                          className="mt-4 px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#388E3C] transition-colors"
                        >
                          Add Payment Method
                        </button>
                      </div>
                    )}
                    {showAddPaymentForm && (
                      <div className="mt-8">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium text-gray-900">Add New Payment Method</h3>
                          <button 
                            onClick={() => setShowAddPaymentForm(false)}
                            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <form onSubmit={handleAddPaymentMethod}>
                          {/* Payment Type Selector */}
                          <div className="mb-6">
                            <div className="flex space-x-4">
                              <button
                                type="button"
                                onClick={() => setNewPaymentForm(prev => ({ ...prev, type: "card" }))}
                                className={`flex-1 py-3 px-4 rounded-lg border ${newPaymentForm.type === 'card' ? 'border-[#4CAF50] bg-[#4CAF50]/5' : 'border-gray-200'} flex items-center justify-center`}
                              >
                                <div className="h-6 w-10 relative mr-2">
                                  <Image 
                                    src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" 
                                    alt="Credit Card" 
                                    fill
                                    className="object-contain" 
                                  />
                                </div>
                                <span className={`font-medium ${newPaymentForm.type === 'card' ? 'text-[#4CAF50]' : 'text-gray-700'}`}>Credit Card</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setNewPaymentForm(prev => ({ ...prev, type: "paypal" }))}
                                className={`flex-1 py-3 px-4 rounded-lg border ${newPaymentForm.type === 'paypal' ? 'border-[#4CAF50] bg-[#4CAF50]/5' : 'border-gray-200'} flex items-center justify-center`}
                              >
                                <div className="h-6 w-10 relative mr-2">
                                  <Image 
                                    src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" 
                                    alt="PayPal" 
                                    fill
                                    className="object-contain" 
                                  />
                                </div>
                                <span className={`font-medium ${newPaymentForm.type === 'paypal' ? 'text-[#4CAF50]' : 'text-gray-700'}`}>PayPal</span>
                              </button>
                            </div>
                          </div>
                          
                          {newPaymentForm.type === 'card' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Card Number */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  <CreditCard className="inline h-4 w-4 mr-1" /> Card Number
                                </label>
                                <input
                                  type="text"
                                  name="cardNumber"
                                  value={newPaymentForm.cardNumber}
                                  onChange={(e) => setNewPaymentForm(prev => ({ ...prev, cardNumber: e.target.value }))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                                />
                              </div>
                              
                              {/* Card Name */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  <User className="inline h-4 w-4 mr-1" /> Card Name
                                </label>
                                <input
                                  type="text"
                                  name="cardName"
                                  value={newPaymentForm.cardName}
                                  onChange={(e) => setNewPaymentForm(prev => ({ ...prev, cardName: e.target.value }))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                                />
                              </div>
                              
                              {/* Expiry Date */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  <Calendar className="inline h-4 w-4 mr-1" /> Expiry Date
                                </label>
                                <input
                                  type="text"
                                  name="expiryDate"
                                  value={newPaymentForm.expiryDate}
                                  onChange={(e) => setNewPaymentForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                                />
                              </div>
                              
                              {/* CVV */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  <Lock className="inline h-4 w-4 mr-1" /> CVV
                                </label>
                                <input
                                  type="text"
                                  name="cvv"
                                  value={newPaymentForm.cvv}
                                  onChange={(e) => setNewPaymentForm(prev => ({ ...prev, cvv: e.target.value }))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* PayPal Email */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  <Mail className="inline h-4 w-4 mr-1" /> PayPal Email
                                </label>
                                <p className="text-gray-900 py-2">{userData.email}</p>
                              </div>
                            </div>
                          )}
                          
                          {/* Save button */}
                          <div className="mt-6">
                            <button 
                              type="submit"
                              className="px-6 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#388E3C] transition-colors flex items-center"
                            >
                              <Save className="h-4 w-4 mr-2" /> Save Changes
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="bg-white rounded-xl shadow-xs overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Notification Preferences</h2>
                    <p className="text-gray-500 mt-1">Manage how you receive notifications</p>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-6">
                      {notificationSettings.map(setting => (
                        <div key={setting.id} className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{setting.name}</h3>
                            <p className="text-sm text-gray-500">{setting.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={setting.enabled} 
                              onChange={() => toggleNotification(setting.id)} 
                              className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-hidden peer-focus:ring-4 peer-focus:ring-[#4CAF50]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4CAF50]"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="bg-white rounded-xl shadow-xs overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Security Settings</h2>
                    <p className="text-gray-500 mt-1">Manage your account security</p>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-8">
                      {/* Password */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Password</h3>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-gray-700">Last changed 3 months ago</p>
                            <p className="text-sm text-gray-500">It's a good idea to use a strong password that you don't use elsewhere</p>
                          </div>
                          <button 
                            onClick={() => setShowChangePasswordForm(true)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                          >
                            Change Password
                          </button>
                        </div>
                        {showChangePasswordForm && (
                          <div className="mt-4">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
                              <button 
                                onClick={() => setShowChangePasswordForm(false)}
                                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                            <form onSubmit={handleChangePassword}>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Current Password */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <Lock className="inline h-4 w-4 mr-1" /> Current Password
                                  </label>
                                  <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                                  />
                                </div>
                                
                                {/* New Password */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <Lock className="inline h-4 w-4 mr-1" /> New Password
                                  </label>
                                  <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                                  />
                                </div>
                                
                                {/* Confirm Password */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <Lock className="inline h-4 w-4 mr-1" /> Confirm Password
                                  </label>
                                  <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                                  />
                                </div>
                              </div>
                              
                              {/* Save button */}
                              <div className="mt-6">
                                <button 
                                  type="submit"
                                  className="px-6 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#388E3C] transition-colors flex items-center"
                                >
                                  <Save className="h-4 w-4 mr-2" /> Save Changes
                                </button>
                              </div>
                            </form>
                          </div>
                        )}
                      </div>
                      
                      {/* Two-Factor Authentication */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Two-Factor Authentication</h3>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-gray-700">Not enabled</p>
                            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                          </div>
                          <button 
                            onClick={() => setShowEnableTwoFactorForm(true)}
                            className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#388E3C] transition-colors text-sm font-medium"
                          >
                            Enable
                          </button>
                        </div>
                        {showEnableTwoFactorForm && (
                          <div className="mt-4">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-medium text-gray-900">Enable Two-Factor Authentication</h3>
                              <button 
                                onClick={() => setShowEnableTwoFactorForm(false)}
                                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                            <form onSubmit={handleEnableTwoFactor}>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Phone Number */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <Phone className="inline h-4 w-4 mr-1" /> Phone Number
                                  </label>
                                  <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={twoFactorForm.phoneNumber}
                                    onChange={(e) => setTwoFactorForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                                  />
                                </div>
                                
                                {/* Verification Code */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <Lock className="inline h-4 w-4 mr-1" /> Verification Code
                                  </label>
                                  <input
                                    type="text"
                                    name="verificationCode"
                                    value={twoFactorForm.verificationCode}
                                    onChange={(e) => setTwoFactorForm(prev => ({ ...prev, verificationCode: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                                  />
                                </div>
                              </div>
                              
                              {/* Save button */}
                              <div className="mt-6">
                                <button 
                                  type="submit"
                                  className="px-6 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#388E3C] transition-colors flex items-center"
                                >
                                  <Save className="h-4 w-4 mr-2" /> Save Changes
                                </button>
                              </div>
                            </form>
                          </div>
                        )}
                      </div>
                      
                      {/* Login Sessions */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Active Sessions</h3>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                            <div>
                              <p className="text-gray-700 font-medium">Current Session</p>
                              <p className="text-sm text-gray-500">Windows • Chrome • New York, USA</p>
                            </div>
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                          </div>
                          <button className="text-red-600 text-sm font-medium hover:text-red-700">
                            Sign out of all other sessions
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
