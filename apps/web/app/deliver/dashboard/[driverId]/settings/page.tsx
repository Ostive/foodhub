"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { User, MapPin, Phone, Mail, Lock, Edit, Save, X, Camera, CreditCard, Bell, Shield, Clock, Heart, LogOut, Trash2, Plus, Calendar } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";

// Bank account type
type BankAccount = {
  id: string;
  bankName: string;
  accountHolder: string;
  iban: string;
  bic: string;
  isDefault: boolean;
};

type NotificationSetting = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
};

type ProfileTab = "personal" | "bank" | "notifications" | "security";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false); // State for editing profile
  const [activeTab, setActiveTab] = useState<ProfileTab>("personal");
  const [showAddPaymentForm, setShowAddPaymentForm] = useState(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [showEnableTwoFactorForm, setShowEnableTwoFactorForm] = useState(false);
  
  // We'll update the existing handleLogout function below
  
  // User data from auth context
  const [userData, setUserData] = useState({
    name: user ? `${user.firstName} ${user.lastName || ''}` : "User",
    email: user?.email || "user@example.com",
    phone: user?.phone || "+1 (555) 123-4567",
    address: user?.address || "123 Main St, New York, NY 10001",
    avatar: user?.profilePicture || "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"
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

  // New bank account form state
  const [newBankForm, setNewBankForm] = useState<BankAccount>({
    id: "",
    bankName: "",
    accountHolder: "",
    iban: "",
    bic: "",
    isDefault: false
  });

  // Two-factor form state
  const [twoFactorForm, setTwoFactorForm] = useState({
    phoneNumber: userData.phone,
    verificationCode: ""
  });

  // Mock bank accounts for payment (RIB)
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: "bank-1",
      bankName: "BNP Paribas",
      accountHolder: "John Doe",
      iban: "FR76 3000 6000 0123 4567 8912 345",
      bic: "BNPAFRPP",
      isDefault: true
    }
  ]);

  // Mock notification settings for delivery drivers
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: "delivery-requests",
      name: "Delivery Requests",
      description: "Get notified about new delivery requests",
      enabled: true
    },
    {
      id: "earnings-updates",
      name: "Earnings Updates",
      description: "Receive updates about your earnings and payments",
      enabled: true
    },
    {
      id: "schedule-changes",
      name: "Schedule Changes",
      description: "Get notified about changes to your delivery schedule",
      enabled: true
    },
    {
      id: "app-updates",
      name: "App Updates",
      description: "Get notified about new features and updates",
      enabled: true
    }
  ]);

  // Authentication is now handled by the ProtectedRoute component

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

  const removeBankAccount = (id: string) => {
    setBankAccounts(prev => prev.filter(account => account.id !== id));
  };

  const handleLogout = () => {
    logout();
    router.push("/deliver/login");
  };

  // Handle adding a new bank account
  const handleAddBankAccount = (e: React.FormEvent) => {
    e.preventDefault();

    const newAccount = {
      id: `bank-${Date.now()}`,
      bankName: newBankForm.bankName,
      accountHolder: newBankForm.accountHolder,
      iban: newBankForm.iban,
      bic: newBankForm.bic,
      isDefault: bankAccounts.length === 0 ? true : newBankForm.isDefault
    };

    setBankAccounts([...bankAccounts, newAccount]);
    setShowAddPaymentForm(false);
    setNewBankForm({
      id: "",
      bankName: "",
      accountHolder: "",
      iban: "",
      bic: "",
      isDefault: false
    });
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
                    className={`w-full flex items-center px-4 py-2 rounded-lg text-left ${activeTab === "personal" ? 'bg-[#009E73]/10 text-[#009E73]' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <User className="h-5 w-5 mr-3" /> Personal Info
                  </button>
                  <button
                    onClick={() => setActiveTab("bank")}
                    className={`w-full flex items-center px-4 py-2 rounded-lg text-left ${activeTab === "bank" ? 'bg-[#009E73]/10 text-[#009E73]' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <CreditCard className="h-5 w-5 mr-3" /> Bank Accounts
                  </button>
                  <button
                    onClick={() => setActiveTab("notifications")}
                    className={`w-full flex items-center px-4 py-2 rounded-lg text-left ${activeTab === "notifications" ? 'bg-[#009E73]/10 text-[#009E73]' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <Bell className="h-5 w-5 mr-3" /> Notifications
                  </button>
                  <button
                    onClick={() => setActiveTab("security")}
                    className={`w-full flex items-center px-4 py-2 rounded-lg text-left ${activeTab === "security" ? 'bg-[#009E73]/10 text-[#009E73]' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <Shield className="h-5 w-5 mr-3" /> Security
                  </button>
                </nav>
                <div className="p-4 border-t border-gray-100">
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
                          <button className="absolute bottom-0 right-0 bg-[#009E73] text-white p-2 rounded-full shadow-md hover:bg-[#388E3C] transition-colors">
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
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#009E73] focus:border-transparent"
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
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#009E73] focus:border-transparent"
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
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#009E73] focus:border-transparent"
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
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#009E73] focus:border-transparent"
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
                            className="px-6 py-2 bg-[#009E73] text-white rounded-lg hover:bg-[#388E3C] transition-colors flex items-center"
                          >
                            <Save className="h-4 w-4 mr-2" /> Save Changes
                          </button>
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              )}

              {/* Bank Account Tab */}
              {activeTab === "bank" && (
                <div className="bg-white rounded-xl shadow-xs overflow-hidden">
                  <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Bank Accounts</h2>
                    <button
                      onClick={() => setShowAddPaymentForm(true)}
                      className="px-4 py-2 bg-[#009E73] text-white rounded-lg hover:bg-[#388E3C] transition-colors flex items-center text-sm font-medium"
                    >
                      <CreditCard className="h-4 w-4 mr-1" /> Add New
                    </button>
                  </div>

                  <div className="p-6">
                    {bankAccounts.length > 0 ? (
                      <div className="space-y-4">
                        {bankAccounts.map(account => (
                          <div key={account.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-medium text-gray-900">{account.bankName}</h3>
                                {account.isDefault && (
                                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Default</span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 mb-1">Account Holder: {account.accountHolder}</p>
                              <p className="text-sm text-gray-500 mb-1">IBAN: {account.iban}</p>
                              <p className="text-sm text-gray-500">BIC: {account.bic}</p>
                            </div>
                            <button
                              onClick={() => removeBankAccount(account.id)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CreditCard className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No bank account</h3>
                        <p className="text-gray-500 mb-4">Add your bank account information to receive payments</p>
                        <button
                          onClick={() => setShowAddPaymentForm(true)}
                          className="px-4 py-2 bg-[#009E73] text-white rounded-lg hover:bg-[#388E3C] transition-colors inline-flex items-center text-sm font-medium"
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add Bank Account
                        </button>
                      </div>
                    )}
                    {showAddPaymentForm && (
                      <div className="mt-8">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium text-gray-900">Add New Bank Account</h3>
                          <button
                            onClick={() => setShowAddPaymentForm(false)}
                            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <form onSubmit={handleAddBankAccount}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Bank Name */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                <CreditCard className="inline h-4 w-4 mr-1" /> Bank Name
                              </label>
                              <input
                                type="text"
                                name="bankName"
                                value={newBankForm.bankName}
                                onChange={(e) => setNewBankForm(prev => ({ ...prev, bankName: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#009E73] focus:border-transparent"
                              />
                            </div>

                            {/* Account Holder */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                <User className="inline h-4 w-4 mr-1" /> Account Holder
                              </label>
                              <input
                                type="text"
                                name="accountHolder"
                                value={newBankForm.accountHolder}
                                onChange={(e) => setNewBankForm(prev => ({ ...prev, accountHolder: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#009E73] focus:border-transparent"
                              />
                            </div>

                            {/* IBAN */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                <CreditCard className="inline h-4 w-4 mr-1" /> IBAN
                              </label>
                              <input
                                type="text"
                                name="iban"
                                value={newBankForm.iban}
                                onChange={(e) => setNewBankForm(prev => ({ ...prev, iban: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#009E73] focus:border-transparent"
                              />
                            </div>

                            {/* BIC */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                <CreditCard className="inline h-4 w-4 mr-1" /> BIC
                              </label>
                              <input
                                type="text"
                                name="bic"
                                value={newBankForm.bic}
                                onChange={(e) => setNewBankForm(prev => ({ ...prev, bic: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#009E73] focus:border-transparent"
                              />
                            </div>

                            {/* Default */}
                            <div className="col-span-2">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id="isDefault"
                                  name="isDefault"
                                  checked={newBankForm.isDefault}
                                  onChange={(e) => setNewBankForm(prev => ({ ...prev, isDefault: e.target.checked }))}
                                  className="h-4 w-4 text-[#009E73] focus:ring-[#009E73] border-gray-300 rounded"
                                />
                                <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                                  <Shield className="inline h-4 w-4 mr-1" /> Set as default payment account
                                </label>
                              </div>
                            </div>
                          </div>

                          {/* Save button */}
                          <div className="mt-6">
                            <button
                              type="submit"
                              className="px-6 py-2 bg-[#009E73] text-white rounded-lg hover:bg-[#388E3C] transition-colors flex items-center"
                            >
                              <Save className="h-4 w-4 mr-2" /> Add Bank Account
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
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-hidden peer-focus:ring-4 peer-focus:ring-[#009E73]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#009E73]"></div>
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#009E73] focus:border-transparent"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#009E73] focus:border-transparent"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#009E73] focus:border-transparent"
                                  />
                                </div>
                              </div>
                              
                              {/* Save button */}
                              <div className="mt-6">
                                <button 
                                  type="submit"
                                  className="px-6 py-2 bg-[#009E73] text-white rounded-lg hover:bg-[#388E3C] transition-colors flex items-center"
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
                            className="px-4 py-2 bg-[#009E73] text-white rounded-lg hover:bg-[#388E3C] transition-colors text-sm font-medium"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#009E73] focus:border-transparent"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#009E73] focus:border-transparent"
                                  />
                                </div>
                              </div>
                              
                              {/* Save button */}
                              <div className="mt-6">
                                <button 
                                  type="submit"
                                  className="px-6 py-2 bg-[#009E73] text-white rounded-lg hover:bg-[#388E3C] transition-colors flex items-center"
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
