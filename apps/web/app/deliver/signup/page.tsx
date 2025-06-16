"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, Eye, EyeOff, Check, Upload, ChevronRight, Shield, Clock, DollarSign, Star } from "lucide-react";
import Link from "next/link";

export default function DeliverSignup() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    city: "",
    zipCode: "",
    vehicle: "",
    licenseNumber: "",
    hasInsurance: false,
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

  const benefits = [
    { title: "Flexible Hours", description: "Work on your own schedule", icon: Clock },
    { title: "Weekly Payments", description: "Get paid reliably every week", icon: DollarSign },
    { title: "Earn Tips", description: "Keep 100% of your customer tips", icon: Star },
    { title: "Safe & Secure", description: "Safety features in our app", icon: Shield },
  ];

  return (
    <main className="min-h-svh bg-white">
      {/* Navbar */}
      <nav className="bg-white shadow-xs py-4 px-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#1976d2]">FoodYou<span className="text-[#64B5F6]">Deliver</span></Link>
          <div className="flex items-center space-x-6">
            <Link href="/deliver" className="text-gray-600 hover:text-[#1976d2] transition-colors">Back to Deliver</Link>
            <Link href="/deliver/login" className="bg-[#1976d2] text-white px-5 py-2 rounded-full font-medium hover:bg-[#0d47a1] transition-colors">Sign In</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Side - Form */}
          <div className="lg:w-7/12">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              {/* Progress Steps */}
              <div className="bg-linear-to-r from-[#1976d2] to-[#64B5F6] p-6 relative">
                <div className="flex justify-between items-center relative z-10">
                  {[1, 2, 3, 4].map((stepNumber) => (
                    <div key={stepNumber} className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= stepNumber ? 'bg-white text-[#1976d2]' : 'bg-white/30 text-white'} font-bold text-lg`}>
                        {step > stepNumber ? <Check className="h-5 w-5" /> : stepNumber}
                      </div>
                      <p className="text-white text-xs mt-2 font-medium">
                        {stepNumber === 1 && "Account"}
                        {stepNumber === 2 && "Details"}
                        {stepNumber === 3 && "Documents"}
                        {stepNumber === 4 && "Complete"}
                      </p>
                    </div>
                  ))}
                  
                  {/* Connecting Lines */}
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/30">
                    <div 
                      className="h-full bg-white transition-all duration-500" 
                      style={{ width: `${(step - 1) * 33.33}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {step === 1 && (
                  <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Your Account</h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#1976d2] focus:border-[#1976d2] transition-colors"
                            placeholder="Your first name"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#1976d2] focus:border-[#1976d2] transition-colors"
                            placeholder="Your last name"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#1976d2] focus:border-[#1976d2] transition-colors"
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#1976d2] focus:border-[#1976d2] transition-colors"
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#1976d2] focus:border-[#1976d2] transition-colors"
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
                        <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
                      </div>
                    </div>
                    
                    <button 
                      type="submit" 
                      className="w-full bg-[#1976d2] text-white py-3 px-4 rounded-xl mt-8 hover:bg-[#0d47a1] transition-colors font-medium flex items-center justify-center"
                    >
                      Continue <ChevronRight className="ml-2 h-5 w-5" />
                    </button>
                    
                    <p className="mt-4 text-sm text-gray-600 text-center">
                      Already have an account? <Link href="/deliver/login" className="text-[#1976d2] font-medium hover:underline">Sign in</Link>
                    </p>
                  </form>
                )}

                {step === 2 && (
                  <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Details</h2>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#1976d2] focus:border-[#1976d2] transition-colors"
                          placeholder="123 Main St"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#1976d2] focus:border-[#1976d2] transition-colors"
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#1976d2] focus:border-[#1976d2] transition-colors"
                            placeholder="12345"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                        <select
                          id="vehicle"
                          name="vehicle"
                          value={formData.vehicle}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#1976d2] focus:border-[#1976d2] transition-colors"
                          required
                        >
                          <option value="" disabled>Select vehicle type</option>
                          <option value="car">Car</option>
                          <option value="motorcycle">Motorcycle</option>
                          <option value="bicycle">Bicycle</option>
                          <option value="scooter">Scooter</option>
                          <option value="walking">Walking</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">Driver's License Number</label>
                        <input
                          type="text"
                          id="licenseNumber"
                          name="licenseNumber"
                          value={formData.licenseNumber}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#1976d2] focus:border-[#1976d2] transition-colors"
                          placeholder="License number"
                          required
                        />
                      </div>
                      
                      <div className="flex items-start p-4 bg-blue-50 rounded-xl">
                        <input
                          type="checkbox"
                          id="hasInsurance"
                          name="hasInsurance"
                          checked={formData.hasInsurance}
                          onChange={handleChange}
                          className="mt-1 h-4 w-4 text-[#1976d2] focus:ring-[#1976d2] rounded"
                          required
                        />
                        <label htmlFor="hasInsurance" className="ml-2 text-sm text-gray-700">
                          I confirm that I have valid vehicle insurance (required for motorized vehicles)
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-8">
                      <button 
                        type="button" 
                        onClick={prevStep}
                        className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                      >
                        Back
                      </button>
                      
                      <button 
                        type="submit" 
                        className="bg-[#1976d2] text-white py-3 px-6 rounded-xl hover:bg-[#0d47a1] transition-colors font-medium flex items-center"
                      >
                        Continue <ChevronRight className="ml-2 h-5 w-5" />
                      </button>
                    </div>
                  </form>
                )}

                {step === 3 && (
                  <form onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Documents</h2>
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="border-2 border-dashed border-blue-200 rounded-xl p-6 text-center hover:border-[#1976d2] transition-colors bg-blue-50">
                          <Upload className="h-12 w-12 text-[#1976d2] mx-auto mb-4" />
                          <p className="text-lg font-medium text-gray-800 mb-2">Upload Driver's License</p>
                          <p className="text-sm text-gray-600 mb-4">JPG, PNG or PDF (max 5MB)</p>
                          <input type="file" className="hidden" id="license-upload" />
                          <label htmlFor="license-upload" className="mt-2 inline-block bg-white border border-gray-300 rounded-xl px-6 py-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors">
                            Choose File
                          </label>
                        </div>
                        
                        <div className="border-2 border-dashed border-blue-200 rounded-xl p-6 text-center hover:border-[#1976d2] transition-colors bg-blue-50">
                          <Upload className="h-12 w-12 text-[#1976d2] mx-auto mb-4" />
                          <p className="text-lg font-medium text-gray-800 mb-2">Upload Vehicle Insurance</p>
                          <p className="text-sm text-gray-600 mb-4">JPG, PNG or PDF (max 5MB)</p>
                          <input type="file" className="hidden" id="insurance-upload" />
                          <label htmlFor="insurance-upload" className="mt-2 inline-block bg-white border border-gray-300 rounded-xl px-6 py-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors">
                            Choose File
                          </label>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                        <h3 className="font-medium text-gray-900 mb-3 text-lg">Terms of Service</h3>
                        <div className="h-48 overflow-y-auto text-sm text-gray-600 bg-white p-4 rounded-xl border border-gray-200 mb-4">
                          <p className="mb-3">Welcome to FoodYou's Delivery Partner Agreement. By checking the box below, you agree to the following terms:</p>
                          <p className="mb-3">1. You confirm that you are at least 18 years old and legally allowed to work.</p>
                          <p className="mb-3">2. You agree to maintain your vehicle in good working condition.</p>
                          <p className="mb-3">3. You will deliver orders promptly and professionally.</p>
                          <p className="mb-3">4. FoodYou is not responsible for traffic violations or accidents during deliveries.</p>
                          <p className="mb-3">5. Payment processing will occur on a weekly basis.</p>
                          <p>6. Either party may terminate this agreement with 7 days written notice.</p>
                        </div>
                        <div className="flex items-start">
                          <input
                            type="checkbox"
                            id="acceptTerms"
                            name="acceptTerms"
                            checked={formData.acceptTerms}
                            onChange={handleChange}
                            className="mt-1 h-4 w-4 text-[#1976d2] focus:ring-[#1976d2] rounded"
                            required
                          />
                          <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-700">
                            I have read and agree to the <Link href="#" className="text-[#1976d2] hover:underline">Terms of Service</Link> and <Link href="#" className="text-[#1976d2] hover:underline">Privacy Policy</Link>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-8">
                      <button 
                        type="button" 
                        onClick={prevStep}
                        className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                      >
                        Back
                      </button>
                      
                      <button 
                        type="submit" 
                        className="bg-[#1976d2] text-white py-3 px-6 rounded-xl hover:bg-[#0d47a1] transition-colors font-medium flex items-center"
                      >
                        Submit Application <ChevronRight className="ml-2 h-5 w-5" />
                      </button>
                    </div>
                  </form>
                )}

                {step === 4 && (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="h-10 w-10 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
                    <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                      Thank you for applying to be a FoodYou delivery partner. We'll review your application and get back to you within 24-48 hours.
                    </p>
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-xl">
                        <h3 className="font-medium text-gray-900 mb-2">What's Next?</h3>
                        <ol className="text-left text-gray-700 space-y-2">
                          <li className="flex items-start">
                            <span className="bg-[#1976d2] text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 shrink-0 mt-0.5">1</span>
                            <span>We'll review your application and documents</span>
                          </li>
                          <li className="flex items-start">
                            <span className="bg-[#1976d2] text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 shrink-0 mt-0.5">2</span>
                            <span>You'll receive an email with the status of your application</span>
                          </li>
                          <li className="flex items-start">
                            <span className="bg-[#1976d2] text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 shrink-0 mt-0.5">3</span>
                            <span>If approved, you'll get access to download the delivery app</span>
                          </li>
                          <li className="flex items-start">
                            <span className="bg-[#1976d2] text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 shrink-0 mt-0.5">4</span>
                            <span>Start accepting orders and earning money!</span>
                          </li>
                        </ol>
                      </div>
                    </div>
                    <Link 
                      href="/deliver" 
                      className="inline-block bg-[#1976d2] text-white py-3 px-8 rounded-xl hover:bg-[#0d47a1] transition-colors font-medium mt-8"
                    >
                      Return to Home
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Benefits */}
          <div className="lg:w-5/12">
            <div className="sticky top-24">
              <div className="bg-linear-to-r from-[#1976d2] to-[#64B5F6] rounded-3xl overflow-hidden shadow-xl mb-8">
                <div className="relative h-64 w-full">
                  <Image 
                    src="https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=800&q=80" 
                    alt="Delivery partner" 
                    fill
                    className="object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#1976d2] to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-8 text-white">
                    <h2 className="text-3xl font-bold mb-2">Join Our Team</h2>
                    <p className="text-xl text-blue-100">Become a delivery partner today</p>
                  </div>
                </div>
                <div className="p-8 text-white">
                  <h3 className="text-xl font-semibold mb-6">Why Join FoodYou?</h3>
                  <div className="space-y-4">
                    {benefits.map((benefit, index) => {
                      const Icon = benefit.icon;
                      return (
                        <div key={index} className="flex items-start">
                          <div className="bg-white/20 p-2 rounded-lg mr-4">
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium">{benefit.title}</h4>
                            <p className="text-sm text-blue-100">{benefit.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">How much can I earn?</h4>
                    <p className="text-gray-600 text-sm">Earnings vary based on your location and hours, but our partners typically earn $15-25 per hour including tips.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">When will I get paid?</h4>
                    <p className="text-gray-600 text-sm">Payments are processed weekly and deposited directly to your bank account.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">What vehicle do I need?</h4>
                    <p className="text-gray-600 text-sm">You can deliver with a car, motorcycle, scooter, bicycle, or even on foot in some dense urban areas.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">How long is the application process?</h4>
                    <p className="text-gray-600 text-sm">Most applications are processed within 24-48 hours after all required documents are submitted.</p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-gray-600 text-sm">Have more questions? <Link href="#" className="text-[#1976d2] font-medium hover:underline">Contact Support</Link></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <Link href="/" className="text-2xl font-bold text-white">FoodYou<span className="text-[#64B5F6]">Deliver</span></Link>
          <p className="mt-2 text-gray-400 text-sm">u00a9 {new Date().getFullYear()} FoodYou. All rights reserved.</p>
          <div className="mt-4 flex justify-center space-x-6">
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
