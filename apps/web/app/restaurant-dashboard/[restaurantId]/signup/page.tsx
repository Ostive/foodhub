"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, Eye, EyeOff, Check } from "lucide-react";
import Link from "next/link";

export default function RestaurantSignup() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    restaurantName: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    city: "",
    zipCode: "",
    cuisineType: "",
    description: "",
    acceptTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send the data to your backend
    console.log("Form submitted:", formData);
    nextStep();
  };

  return (
    <main className="min-h-svh bg-linear-to-br from-[#fff7ed] via-[#fff3e0] to-[#fff7ed] py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left Side - Image */}
          <div className="md:w-1/2 bg-[#D55E00] relative hidden md:block">
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <Image 
              src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80" 
              alt="Restaurant signup" 
              layout="fill"
              objectFit="cover"
              className="absolute inset-0"
            />
            <div className="relative z-10 flex flex-col justify-center items-center h-full text-white p-8">
              <h2 className="text-3xl font-bold mb-4">Join Our Restaurant Network</h2>
              <p className="text-lg text-center">Grow your business and reach more hungry customers with FoodHUB.</p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="md:w-1/2 p-8">
            <div className="mb-6 flex items-center">
              <Link href="/restaurant" className="text-gray-500 hover:text-[#D55E00] mr-4">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Restaurant Registration</h1>
            </div>

            {step === 1 && (
              <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
                    <input
                      type="text"
                      id="restaurantName"
                      name="restaurantName"
                      value={formData.restaurantName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D55E00] focus:border-[#D55E00]"
                      placeholder="Your restaurant name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D55E00] focus:border-[#D55E00]"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D55E00] focus:border-[#D55E00]"
                      placeholder="(123) 456-7890"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D55E00] focus:border-[#D55E00]"
                        placeholder="Create a secure password"
                        required
                      />
                      <button 
                        type="button" 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full bg-[#D55E00] text-white py-2 px-4 rounded-lg mt-6 hover:bg-[#e65100] transition-colors font-medium"
                >
                  Continue
                </button>
                
                <p className="mt-4 text-sm text-gray-600 text-center">
                  Already have an account? <a href="/restaurant-dashboard" className="text-[#D55E00] font-medium hover:underline">Sign in</a>
                </p>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D55E00] focus:border-[#D55E00]"
                      placeholder="123 Main St"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D55E00] focus:border-[#D55E00]"
                        placeholder="City"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D55E00] focus:border-[#D55E00]"
                        placeholder="12345"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="cuisineType" className="block text-sm font-medium text-gray-700 mb-1">Cuisine Type</label>
                    <select
                      id="cuisineType"
                      name="cuisineType"
                      value={formData.cuisineType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D55E00] focus:border-[#D55E00]"
                      required
                    >
                      <option value="" disabled>Select cuisine type</option>
                      <option value="italian">Italian</option>
                      <option value="chinese">Chinese</option>
                      <option value="mexican">Mexican</option>
                      <option value="indian">Indian</option>
                      <option value="japanese">Japanese</option>
                      <option value="american">American</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Restaurant Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D55E00] focus:border-[#D55E00]"
                      placeholder="Tell customers about your restaurant..."
                      required
                    ></textarea>
                  </div>
                </div>
                
                <div className="flex justify-between mt-6">
                  <button 
                    type="button" 
                    onClick={prevStep}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  
                  <button 
                    type="submit" 
                    className="bg-[#D55E00] text-white py-2 px-6 rounded-lg hover:bg-[#e65100] transition-colors font-medium"
                  >
                    Continue
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                    <h3 className="font-medium text-gray-900 mb-2">Terms of Service</h3>
                    <div className="h-40 overflow-y-auto text-sm text-gray-600 bg-white p-3 rounded border border-gray-200 mb-3">
                      <p className="mb-2">Welcome to FoodHUB's Restaurant Partner Agreement. By checking the box below, you agree to the following terms:</p>
                      <p className="mb-2">1. You confirm that you are authorized to represent the restaurant in this agreement.</p>
                      <p className="mb-2">2. You agree to maintain accurate menu information and pricing.</p>
                      <p className="mb-2">3. You will prepare food in accordance with all applicable health and safety regulations.</p>
                      <p className="mb-2">4. FoodHUB will charge a commission on orders processed through our platform.</p>
                      <p className="mb-2">5. Payment processing will occur on a weekly basis.</p>
                      <p>6. Either party may terminate this agreement with 30 days written notice.</p>
                    </div>
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="acceptTerms"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 text-[#D55E00] focus:ring-[#D55E00] rounded"
                        required
                      />
                      <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-700">
                        I have read and agree to the Terms of Service and Privacy Policy
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-6">
                  <button 
                    type="button" 
                    onClick={prevStep}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  
                  <button 
                    type="submit" 
                    className="bg-[#D55E00] text-white py-2 px-6 rounded-lg hover:bg-[#e65100] transition-colors font-medium"
                    disabled={!formData.acceptTerms}
                  >
                    Complete Registration
                  </button>
                </div>
              </form>
            )}

            {step === 4 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Complete!</h2>
                <p className="text-gray-600 mb-6">Your restaurant account has been created successfully.</p>
                <p className="text-sm text-gray-500 mb-6">We'll review your information and get back to you within 24-48 hours to complete the onboarding process.</p>
                <Link 
                  href="/restaurant-dashboard" 
                  className="inline-block bg-[#D55E00] text-white py-2 px-6 rounded-lg hover:bg-[#e65100] transition-colors font-medium"
                >
                  Go to Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
