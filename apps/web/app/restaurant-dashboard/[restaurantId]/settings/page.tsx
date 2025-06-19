"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Save, Upload, Clock, MapPin, Phone, Mail, Globe, ChevronRight, CreditCard, Bell, Shield, User, Loader2, AlertCircle, Building, Copy, Check } from "lucide-react";

export default function SettingsPage() {
  const { restaurantId } = useParams();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Restaurant profile state
  const [restaurantProfile, setRestaurantProfile] = useState({
    name: "Loading...",
    logo: "https://cwdaust.com.au/wpress/wp-content/uploads/2015/04/placeholder-restaurant.png",
    coverImage: "https://images.unsplash.com/photo-1548365328-8b849e6c7b85?auto=format&fit=crop&w=800&q=80",
    description: "Loading...",
    address: "Loading...",
    phone: "Loading...",
    email: "Loading...",
    website: "Loading...",
    openingHours: [
      { day: "Monday", hours: "Loading..." },
      { day: "Tuesday", hours: "Loading..." },
      { day: "Wednesday", hours: "Loading..." },
      { day: "Thursday", hours: "Loading..." },
      { day: "Friday", hours: "Loading..." },
      { day: "Saturday", hours: "Loading..." },
      { day: "Sunday", hours: "Loading..." },
    ],
    deliveryRadius: 0,
    minimumOrder: 0,
    averagePreparationTime: 0,
    bankInfo: {
      accountHolder: "",
      iban: "",
      bic: "",
      bankName: ""
    }
  });
  
  // Save profile information
  const handleSaveProfileInfo = async () => {
    try {
      setSaving(true);
      setSaveSuccess(false);
      
      // Get user info from localStorage (set during login)
      const userInfo = localStorage.getItem('user');
      let userId = restaurantId;
      let token = "";
      
      if (userInfo) {
        const user = JSON.parse(userInfo);
        if (user.role === 'restaurant' && user.userId) {
          userId = user.userId.toString();
          token = user.token || "";
        }
      }
      
      if (!userId) {
        throw new Error('No restaurant ID available');
      }
      
      // Prepare the data to update
      const updateData = {
        firstName: restaurantProfile.name,
        description: restaurantProfile.description,
        address: restaurantProfile.address,
        phone: restaurantProfile.phone,
        email: restaurantProfile.email,
        website: restaurantProfile.website,
        profilePicture: restaurantProfile.logo,
        coverImage: restaurantProfile.coverImage,
        deliveryRadius: restaurantProfile.deliveryRadius,
        minimumPurchase: restaurantProfile.minimumOrder,
        averagePreparationTime: restaurantProfile.averagePreparationTime,
        openingHours: {
          monday: restaurantProfile.openingHours.find(oh => oh.day === "Monday")?.hours || "Closed",
          tuesday: restaurantProfile.openingHours.find(oh => oh.day === "Tuesday")?.hours || "Closed",
          wednesday: restaurantProfile.openingHours.find(oh => oh.day === "Wednesday")?.hours || "Closed",
          thursday: restaurantProfile.openingHours.find(oh => oh.day === "Thursday")?.hours || "Closed",
          friday: restaurantProfile.openingHours.find(oh => oh.day === "Friday")?.hours || "Closed",
          saturday: restaurantProfile.openingHours.find(oh => oh.day === "Saturday")?.hours || "Closed",
          sunday: restaurantProfile.openingHours.find(oh => oh.day === "Sunday")?.hours || "Closed",
        }
      };
      
      const response = await fetch(`http://localhost:3002/api/restaurants/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update restaurant profile');
      }
      
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error('Error updating restaurant profile:', err);
      setError('Failed to save profile information');
      
      // Hide error after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setSaving(false);
    }
  };
  
  // Save payment information
  const handleSavePaymentInfo = async () => {
    try {
      setSaving(true);
      setSaveSuccess(false);
      
      // Get user info from localStorage (set during login)
      const userInfo = localStorage.getItem('user');
      let userId = restaurantId;
      let token = "";
      
      if (userInfo) {
        const user = JSON.parse(userInfo);
        if (user.role === 'restaurant' && user.userId) {
          userId = user.userId.toString();
          token = user.token || "";
        }
      }
      
      if (!userId) {
        throw new Error('No restaurant ID available');
      }
      
      // Prepare the data to update
      const updateData = {
        bankInfo: {
          accountHolder: restaurantProfile.bankInfo.accountHolder,
          iban: restaurantProfile.bankInfo.iban,
          bic: restaurantProfile.bankInfo.bic,
          bankName: restaurantProfile.bankInfo.bankName
        }
      };
      
      const response = await fetch(`http://localhost:3002/api/restaurants/${userId}/bank-info`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update bank information');
      }
      
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error('Error updating bank information:', err);
      setError('Failed to save bank information');
      
      // Hide error after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setSaving(false);
    }
  };
  
  // Fetch restaurant data
  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get user info from localStorage (set during login)
        const userInfo = localStorage.getItem('user');
        let userId = restaurantId;
        
        // If we have user info and this is the current logged-in restaurant
        if (userInfo) {
          const user = JSON.parse(userInfo);
          if (user.role === 'restaurant' && user.userId) {
            userId = user.userId.toString();
          }
        }
        
        if (!userId) {
          throw new Error('No restaurant ID available');
        }
        
        const response = await fetch(`http://localhost:3002/api/restaurants/${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch restaurant data');
        }
        
        const data = await response.json();
        
        // Transform the API data to match our component's expected format
        setRestaurantProfile({
          name: data.firstName || "Restaurant Name",
          logo: data.profilePicture || "https://cwdaust.com.au/wpress/wp-content/uploads/2015/04/placeholder-restaurant.png",
          coverImage: data.coverImage || "https://images.unsplash.com/photo-1548365328-8b849e6c7b85?auto=format&fit=crop&w=800&q=80",
          description: data.description || "No description available",
          address: data.address || "No address provided",
          phone: data.phone || "No phone provided",
          email: data.email || "No email provided",
          website: data.website || "No website provided",
          openingHours: [
            { day: "Monday", hours: data.openingHours?.monday || "Closed" },
            { day: "Tuesday", hours: data.openingHours?.tuesday || "Closed" },
            { day: "Wednesday", hours: data.openingHours?.wednesday || "Closed" },
            { day: "Thursday", hours: data.openingHours?.thursday || "Closed" },
            { day: "Friday", hours: data.openingHours?.friday || "Closed" },
            { day: "Saturday", hours: data.openingHours?.saturday || "Closed" },
            { day: "Sunday", hours: data.openingHours?.sunday || "Closed" },
          ],
          deliveryRadius: data.deliveryRadius || 5,
          minimumOrder: data.minimumPurchase || 15,
          averagePreparationTime: data.averagePreparationTime || 20,
          bankInfo: {
            accountHolder: data.bankInfo?.accountHolder || "Restaurant Account",
            iban: data.bankInfo?.iban || "FR76 3000 6000 0112 3456 7890 189",
            bic: data.bankInfo?.bic || "AGRIFRPP989",
            bankName: data.bankInfo?.bankName || "Banque Alimentaire"
          }
        });
      } catch (err) {
        console.error('Error fetching restaurant data:', err);
        setError('Failed to load restaurant data');
        
        // Keep default values
      } finally {
        setLoading(false);
      }
    };
    
    fetchRestaurantData();
  }, [restaurantId]);

  // Tabs for settings
  const tabs = [
    { id: "profile", name: "Restaurant Profile", icon: User },
    { id: "payment", name: "Payment Methods", icon: CreditCard },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "security", name: "Security", icon: Shield },
  ];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Account</h1>
        <p className="text-gray-600">Manage your restaurant account and settings</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
          <nav>
            <ul>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-left ${activeTab === tab.id ? 'bg-orange-50 text-[#D55E00] border-l-4 border-[#D55E00]' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      <span>{tab.name}</span>
                      <ChevronRight className={`h-4 w-4 ml-auto ${activeTab === tab.id ? 'text-[#D55E00]' : 'text-gray-400'}`} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl shadow-xs border border-gray-100 p-6">
          {activeTab === "profile" && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Restaurant Profile</h2>
              
              {/* Cover Image */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                <div className="relative h-48 rounded-xl overflow-hidden bg-gray-100">
                  <Image 
                    src={restaurantProfile.coverImage} 
                    alt="Restaurant cover"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <button className="bg-white text-gray-800 px-4 py-2 rounded-lg flex items-center">
                      <Upload className="h-4 w-4 mr-2" />
                      Change Cover
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Logo and Basic Info */}
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="md:w-1/3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Logo</label>
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-gray-100 mx-auto">
                    <Image 
                      src={restaurantProfile.logo} 
                      alt="Restaurant logo"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <button className="bg-white text-gray-800 px-3 py-1 rounded-lg text-sm flex items-center">
                        <Upload className="h-3 w-3 mr-1" />
                        Change
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
                      <input
                        type="text"
                        id="restaurantName"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D55E00] focus:border-[#D55E00]"
                        value={restaurantProfile.name}
                        onChange={(e) => setRestaurantProfile({...restaurantProfile, name: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        id="description"
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D55E00] focus:border-[#D55E00] h-32"
                        value={restaurantProfile.description}
                        onChange={(e) => setRestaurantProfile({...restaurantProfile, description: e.target.value})}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      Address
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D55E00] focus:border-[#D55E00]"
                      value={restaurantProfile.address}
                      onChange={(e) => setRestaurantProfile({...restaurantProfile, address: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D55E00] focus:border-[#D55E00]"
                      value={restaurantProfile.phone}
                      onChange={(e) => setRestaurantProfile({...restaurantProfile, phone: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D55E00] focus:border-[#D55E00]"
                      value={restaurantProfile.email}
                      onChange={(e) => setRestaurantProfile({...restaurantProfile, email: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <Globe className="h-4 w-4 mr-2 text-gray-400" />
                      Website
                    </label>
                    <input
                      type="url"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D55E00] focus:border-[#D55E00]"
                      value={restaurantProfile.website}
                      onChange={(e) => setRestaurantProfile({...restaurantProfile, website: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              {/* Business Hours */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Hours</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {restaurantProfile.openingHours.map((schedule) => (
                    <div key={schedule.day} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                      <span className="font-medium">{schedule.day}</span>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        <input
                          type="text"
                          className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-[#D55E00] focus:border-[#D55E00] text-sm"
                          value={schedule.hours}
                          onChange={(e) => setRestaurantProfile({
                            ...restaurantProfile,
                            openingHours: restaurantProfile.openingHours.map((hour) => hour.day === schedule.day ? {...hour, hours: e.target.value} : hour)
                          })}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Delivery Settings */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Radius (miles)</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D55E00] focus:border-[#D55E00]"
                      value={restaurantProfile.deliveryRadius}
                      onChange={(e) => setRestaurantProfile({...restaurantProfile, deliveryRadius: Number(e.target.value)})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order ($)</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D55E00] focus:border-[#D55E00]"
                      value={restaurantProfile.minimumOrder}
                      onChange={(e) => setRestaurantProfile({...restaurantProfile, minimumOrder: Number(e.target.value)})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Avg. Preparation Time (min)</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D55E00] focus:border-[#D55E00]"
                      value={restaurantProfile.averagePreparationTime}
                      onChange={(e) => setRestaurantProfile({...restaurantProfile, averagePreparationTime: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
              
              {/* Save Button */}
              <div className="flex justify-end items-center gap-4">
                {saveSuccess && (
                  <span className="text-green-600 text-sm flex items-center">
                    <Check className="h-4 w-4 mr-1" /> Modifications enregistrées
                  </span>
                )}
                <button 
                  className="bg-[#D55E00] hover:bg-[#e65100] disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center"
                  onClick={handleSaveProfileInfo}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Enregistrer les modifications
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {activeTab === "payment" && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Information</h2>
              
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-[#D55E00]" />
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-12 text-red-500">
                  <AlertCircle className="h-6 w-6 mr-2" />
                  <span>{error}</span>
                </div>
              ) : (
                <div>
                  {/* RIB Information */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Building className="h-5 w-5 mr-2 text-[#D55E00]" />
                      Relevé d'Identité Bancaire (RIB)
                    </h3>
                    
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Titulaire du compte</label>
                          <div className="flex">
                            <input
                              type="text"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D55E00] focus:border-[#D55E00]"
                              value={restaurantProfile.bankInfo.accountHolder}
                              onChange={(e) => setRestaurantProfile({
                                ...restaurantProfile,
                                bankInfo: {
                                  ...restaurantProfile.bankInfo,
                                  accountHolder: e.target.value
                                }
                              })}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la banque</label>
                          <div className="flex">
                            <input
                              type="text"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D55E00] focus:border-[#D55E00]"
                              value={restaurantProfile.bankInfo.bankName}
                              onChange={(e) => setRestaurantProfile({
                                ...restaurantProfile,
                                bankInfo: {
                                  ...restaurantProfile.bankInfo,
                                  bankName: e.target.value
                                }
                              })}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">IBAN</label>
                          <div className="flex">
                            <input
                              type="text"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D55E00] focus:border-[#D55E00]"
                              value={restaurantProfile.bankInfo.iban}
                              onChange={(e) => setRestaurantProfile({
                                ...restaurantProfile,
                                bankInfo: {
                                  ...restaurantProfile.bankInfo,
                                  iban: e.target.value
                                }
                              })}
                            />
                            <button 
                              className="ml-2 p-2 text-gray-500 hover:text-[#D55E00] hover:bg-orange-50 rounded-lg"
                              onClick={() => navigator.clipboard.writeText(restaurantProfile.bankInfo.iban)}
                              title="Copy IBAN"
                            >
                              <Copy className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">BIC / SWIFT</label>
                          <div className="flex">
                            <input
                              type="text"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D55E00] focus:border-[#D55E00]"
                              value={restaurantProfile.bankInfo.bic}
                              onChange={(e) => setRestaurantProfile({
                                ...restaurantProfile,
                                bankInfo: {
                                  ...restaurantProfile.bankInfo,
                                  bic: e.target.value
                                }
                              })}
                            />
                            <button 
                              className="ml-2 p-2 text-gray-500 hover:text-[#D55E00] hover:bg-orange-50 rounded-lg"
                              onClick={() => navigator.clipboard.writeText(restaurantProfile.bankInfo.bic)}
                              title="Copy BIC"
                            >
                              <Copy className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Note:</strong> Ces informations bancaires seront utilisées pour les virements de paiement. Assurez-vous que les détails sont exacts pour éviter tout retard dans les paiements.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Payment History Section */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Historique des paiements</h3>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Référence</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15 Juin 2025</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">€1,245.50</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Payé</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">PAY-2025-06-15</td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 Juin 2025</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">€978.25</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Payé</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">PAY-2025-06-01</td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15 Mai 2025</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">€1,102.75</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Payé</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">PAY-2025-05-15</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* Save Button */}
                  <div className="flex justify-end items-center gap-4">
                    {saveSuccess && (
                      <span className="text-green-600 text-sm flex items-center">
                        <Check className="h-4 w-4 mr-1" /> Modifications enregistrées
                      </span>
                    )}
                    <button 
                      className="bg-[#D55E00] hover:bg-[#e65100] disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center"
                      onClick={handleSavePaymentInfo}
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5 mr-2" />
                          Enregistrer les modifications
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "notifications" && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Settings</h2>
              <p className="text-gray-500 py-12 text-center">Notification settings would go here</p>
            </div>
          )}

          {activeTab === "security" && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h2>
              <p className="text-gray-500 py-12 text-center">Security settings would go here</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
