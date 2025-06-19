"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowRight, Check, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success state
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-md">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Check your email</h2>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to <span className="font-medium">{email}</span>. Please check your inbox and follow the instructions to reset your password.
            </p>
            <div className="space-y-3">
              <Link 
                href="/customer/login" 
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-xs text-sm font-medium text-white bg-[#009E73] hover:bg-[#388e3c] focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-[#009E73] transition-colors"
              >
                Return to login <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <button 
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail("");
                }}
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-xs text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-[#009E73] transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Try another email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          <div className="text-center mb-8">
            <Link href="/customer" className="inline-block">
              <span className="text-4xl font-bold text-[#009E73]">FoodHUB</span>
            </Link>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Reset your password</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-xs placeholder-gray-400 focus:outline-hidden focus:ring-[#009E73] focus:border-[#009E73] sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-xs text-sm font-medium text-white bg-[#009E73] hover:bg-[#388e3c] focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-[#009E73] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending reset link...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Send reset link <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link href="/customer/login" className="font-medium text-[#009E73] hover:text-[#388e3c] text-sm">
              <ArrowLeft className="inline-block mr-1 h-4 w-4" /> Back to login
            </Link>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden md:block md:flex-1 relative">
        <div className="absolute inset-0 bg-linear-to-r from-[#009E73]/90 to-[#2E7D32]/90 z-10"></div>
        <Image
          src="https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=1740&auto=format&fit=crop"
          alt="Food delivery"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center z-20 p-12">
          <div className="max-w-md text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Forgot your password?</h2>
            <p className="text-white/90 text-lg">
              Don't worry! It happens to the best of us. We'll help you get back to enjoying delicious meals in no time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
