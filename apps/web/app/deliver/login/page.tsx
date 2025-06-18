"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Eye, EyeOff, AlertCircle } from "lucide-react";

// Mock delivery driver data
const mockDrivers = [
  {
    id: "driver-1",
    email: "driver1@example.com",
    password: "password123",
    name: "Michael Rodriguez",
    phone: "+1 (555) 987-6543",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4.8,
    completedDeliveries: 342,
    vehicle: "Honda Civic",
    licensePlate: "ABC-1234",
    activeOrders: 0,
    earnings: {
      today: 85.50,
      week: 645.75,
      month: 2450.25
    }
  },
  {
    id: "driver-2",
    email: "driver2@example.com",
    password: "password123",
    name: "Sarah Chen",
    phone: "+1 (555) 123-4567",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4.9,
    completedDeliveries: 512,
    vehicle: "Toyota Prius",
    licensePlate: "XYZ-5678",
    activeOrders: 1,
    earnings: {
      today: 92.25,
      week: 712.50,
      month: 2875.00
    }
  }
];

export default function DeliveryLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const driver = mockDrivers.find(d => d.email === email && d.password === password);
      
      if (driver) {
        // Store driver info in localStorage (in a real app, you'd use a more secure method)
        localStorage.setItem("deliveryDriver", JSON.stringify({
          id: driver.id,
          name: driver.name,
          image: driver.image,
          isLoggedIn: true
        }));
        
        // Redirect to driver dashboard
        router.push(`/deliver/dashboard/${driver.id}`);
      } else {
        setError("Invalid email or password");
        setLoading(false);
      }
    }, 1000);
  };
  
  return (
    <div className="min-h-svh bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-xs py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/deliver" className="text-2xl font-bold text-[#0072B2]">Food'EM</Link>
          <Link 
            href="/deliver/signup"
            className="text-[#0072B2] font-medium hover:underline"
          >
            Sign Up
          </Link>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="grow flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Driver Login</h1>
            <p className="text-gray-600">Sign in to start delivering</p>
          </div>
          
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-600">
              <AlertCircle className="h-5 w-5 mr-2 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0072B2] focus:border-transparent"
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0072B2] focus:border-transparent"
                  placeholder="u2022u2022u2022u2022u2022u2022u2022u2022"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <div className="flex justify-end mt-1">
                <Link href="/deliver/forgot-password" className="text-sm text-[#0072B2] hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0072B2] hover:bg-[#1565c0] text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link href="/deliver/signup" className="text-[#0072B2] font-medium hover:underline">
                Sign up to deliver
              </Link>
            </p>
          </div>
          
          {/* Demo accounts for easy testing */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Demo Accounts</h3>
            <div className="space-y-3">
              {mockDrivers.map(driver => (
                <button
                  key={driver.id}
                  onClick={() => {
                    setEmail(driver.email);
                    setPassword(driver.password);
                  }}
                  className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                    <Image src={driver.image} alt={driver.name} width={40} height={40} />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{driver.name}</p>
                    <p className="text-sm text-gray-500">{driver.email}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white py-4 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Food'EM. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
