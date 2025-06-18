"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";

export default function DeliveryDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  // This is a simple dashboard page that doesn't redirect
  // It will be the default page for /deliver/dashboard
  
  return (
    <div className="min-h-svh bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Delivery Dashboard</h1>
        <p className="text-gray-600 mb-6">Welcome to the delivery dashboard!</p>
        
        {user && (
          <div className="mb-6">
            <p className="text-gray-800">Logged in as: {user.firstName} {user.lastName}</p>
            <p className="text-gray-500 text-sm">User ID: {user.userId}</p>
          </div>
        )}
        
        <button
          onClick={() => router.push(`/deliver/dashboard/${user?.userId || '13'}`)}
          className="bg-[#1976d2] hover:bg-[#1565c0] text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Go to My Dashboard
        </button>
      </div>
    </div>
  );
}
