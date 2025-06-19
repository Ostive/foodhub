"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Eye, EyeOff, AlertCircle } from "lucide-react";

// Import our authentication hooks
import { useLogin } from "@/lib/hooks/use-auth";
import { useAuth } from "@/lib/auth/auth-context";

export default function DeliveryLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  
  // Use our login mutation hook
  const { mutate: login, isPending: isLoading, error: loginError } = useLogin();
  const { isAuthenticated, user } = useAuth();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate form fields
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    // Call login mutation
    login(
      { email, password },
      {
        onSuccess: (data) => {
          // Check if the user has the correct role
          if (data.user.role !== 'delivery_person') {
            setError("This login is only for delivery personnel. Please use the appropriate login page.");
            return;
          }
          
          // Redirect directly to the driver-specific dashboard with user ID
          router.push(`/deliver/dashboard/${data.user.userId}`);
        },
        onError: (error: Error) => {
          setError(error.message || "Login failed. Please try again.");
        }
      }
    );
  };
  
  // Redirect if already authenticated using useEffect
  useEffect(() => {
    if (isAuthenticated && user?.role === 'delivery_person') {
      // Redirect directly to driver-specific dashboard with user ID
      if (user?.userId) {
        router.push(`/deliver/dashboard/${user.userId}`);
      } else {
        // Fallback if userId is somehow missing
        router.push("/deliver/dashboard");
      }
    } else if (isAuthenticated && user?.role !== 'delivery_person') {
      // If authenticated but wrong role, redirect to appropriate dashboard
      switch(user?.role) {
        case 'customer':
          router.push("/customer");
          break;
        case 'restaurant':
          router.push("/restaurant/dashboard");
          break;
        default:
          // For other roles like admin
          router.push("/");
      }
    }
  }, [isAuthenticated, user, router]);
  
  return (
    <div className="min-h-svh bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-xs py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/deliver" className="text-2xl font-bold text-[#0072B2]">FoodHUB</Link>
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
                  placeholder="••••••••"
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
            
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-[#0072B2] hover:bg-[#005b8f] text-white font-medium py-2.5 px-4 rounded-lg w-full flex items-center justify-center"
                disabled={isLoading}
              >
                <span>{isLoading ? "Logging in..." : "Login"}</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link href="/deliver/signup" className="text-[#0072B2] font-medium hover:underline">
                Sign up to deliver
              </Link>
            </p>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white py-4 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} FoodHUB. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
