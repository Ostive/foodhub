"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock, ArrowRight, User } from "lucide-react";
import { useRouter } from "next/navigation";

// This will be replaced with a proper auth context in a real app
import { isLoggedIn } from "../_utils/authState";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    // Simulate API call
    try {
      // Replace with actual authentication logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, simple validation
      if (!email || !password) {
        throw new Error("Please fill in all fields");
      }
      
      // Set logged in state
      isLoggedIn.value = true;
      
      // Redirect to home page after successful login
      router.push("/customer");
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // For testing purposes
  const handleTestLogin = () => {
    isLoggedIn.value = true;
    router.push("/customer");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          <div className="text-center mb-8">
            <Link href="/customer" className="inline-block">
              <span className="text-4xl font-bold text-[#4CAF50]">Foodyou</span>
            </Link>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/customer/register" className="font-medium text-[#4CAF50] hover:text-[#388e3c]">
                Sign up
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-[#4CAF50] focus:border-[#4CAF50] sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-[#4CAF50] focus:border-[#4CAF50] sm:text-sm"
                  placeholder="Enter your password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#4CAF50] focus:ring-[#4CAF50] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="/customer/forgot-password" className="font-medium text-[#4CAF50] hover:text-[#388e3c]">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-[#4CAF50] hover:bg-[#388e3c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4CAF50] transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>Sign in <ArrowRight className="ml-2 h-4 w-4" /></>
                )}
              </button>
            </div>
          </form>

          {/* Test Login Button */}
          <div className="mt-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">For testing purposes</span>
              </div>
            </div>
            <button
              onClick={handleTestLogin}
              className="mt-4 w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4CAF50] transition-colors duration-200"
            >
              <User className="mr-2 h-4 w-4 text-[#4CAF50]" />
              Login as Test User
            </button>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden md:block md:flex-1 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1600&q=80')" }}>
        <div className="h-full w-full bg-black bg-opacity-40 flex flex-col justify-center items-center text-white p-12">
          <div className="max-w-md text-center">
            <h2 className="text-3xl font-bold mb-6">Delicious food, delivered to your door</h2>
            <p className="text-lg mb-8">Order from your favorite local restaurants with free delivery on your first order.</p>
            <div className="flex justify-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl flex flex-col items-center">
                <span className="text-2xl font-bold">1000+</span>
                <span className="text-sm">Restaurants</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl flex flex-col items-center">
                <span className="text-2xl font-bold">30 min</span>
                <span className="text-sm">Average Delivery</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl flex flex-col items-center">
                <span className="text-2xl font-bold">4.8/5</span>
                <span className="text-sm">Customer Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
