"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, AlertCircle, ArrowLeft } from "lucide-react";
import { addToCart } from '@/lib/api/cart_storage'; 

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

    // Ici tu peux intégrer ta logique d'authentification réelle

    setTimeout(() => {
      setError("Invalid email or password"); // Exemple d'erreur par défaut
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-svh bg-gray-50 flex flex-col relative overflow-hidden">
      {/* Decorative Blurs */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-100px] left-[-80px] w-[300px] h-[300px] bg-blue-400 opacity-30 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-120px] right-[-60px] w-[260px] h-[260px] bg-purple-400 opacity-30 blur-[100px] rounded-full"></div>
        <div className="absolute top-[40%] left-[30%] w-[250px] h-[250px] bg-green-300 opacity-20 blur-[100px] rounded-full"></div>
      </div>

      {/* Main Content */}
      <main className="grow flex items-center justify-center p-6 relative z-10">
        <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Link
                href="./"
                className="inline-flex items-center justify-center rounded-full p-2 hover:bg-gray-100 transition"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Restaurant Login
              </h1>
            </div>
            <p className="text-gray-600">
              Log in to manage your restaurant profile
            </p>
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
              <Link href="/restaurant/form" className="text-[#0072B2] font-medium hover:underline">
                Create a restaurant
              </Link>
            </p>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Test Account</h3>
            <div>
              <Link
                href="/restaurant-dashboard/bella-napoli"
                className="block w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-center font-medium text-[#0072B2]"
              >
                Test Restaurant
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-4 px-6 border-t border-gray-200 relative z-10">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} FoodHUB. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
