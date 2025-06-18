"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    // Check if we're on the client-side
    if (typeof window !== 'undefined') {
      // If not authenticated, redirect to login
      if (!isAuthenticated) {
        router.push(`/customer/login?redirect=${encodeURIComponent(pathname)}`);
      }
    }
  }, [isAuthenticated, router, pathname]);

  // If we're still checking authentication or not authenticated, show loading
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-green-500" />
          <p className="mt-2 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If authenticated, render children
  return <>{children}</>;
}
