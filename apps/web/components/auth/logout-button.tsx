"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useLogout } from '@/lib/hooks/use-logout';

interface LogoutButtonProps {
  className?: string;
  variant?: 'default' | 'icon' | 'text';
}

export function LogoutButton({ 
  className = '', 
  variant = 'default' 
}: LogoutButtonProps) {
  const router = useRouter();
  const { mutate: logout, isPending } = useLogout();
  
  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        // Redirect to login page after successful logout
        router.push('/customer/login');
      }
    });
  };

  // Different button styles based on variant
  if (variant === 'icon') {
    return (
      <button
        onClick={handleLogout}
        disabled={isPending}
        className={`p-2 rounded-full hover:bg-gray-100 text-gray-600 ${className}`}
        aria-label="Logout"
      >
        <LogOut className="h-5 w-5" />
      </button>
    );
  }

  if (variant === 'text') {
    return (
      <button
        onClick={handleLogout}
        disabled={isPending}
        className={`text-gray-600 hover:text-gray-900 font-medium ${className}`}
      >
        {isPending ? 'Logging out...' : 'Logout'}
      </button>
    );
  }

  // Default button style
  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className={`flex items-center px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 ${className}`}
    >
      {isPending ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Logging out...
        </span>
      ) : (
        <>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </>
      )}
    </button>
  );
}
