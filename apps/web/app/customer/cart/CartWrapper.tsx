'use client';

import dynamic from "next/dynamic";
import { Suspense } from "react";
import CustomerNavbar from "../_components/CustomerNavbar";

// Import the cart client component with dynamic import to avoid SSR
// This is necessary because the cart relies on browser APIs and client-side state
const DynamicCartClient = dynamic(() => import("./CartClient"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  )
});

interface CartWrapperProps {
  addressSuggestions: any[];
  paymentMethods: any[];
  error: string | null;
}

export default function CartWrapper({ addressSuggestions, paymentMethods, error }: CartWrapperProps) {
  return (
    <>
      <CustomerNavbar />
      <div className="pt-8"> {/* Add spacing between navbar and content */}
        <DynamicCartClient 
          addressSuggestions={addressSuggestions} 
          paymentMethods={paymentMethods} 
          error={error || ''} /* Fix the type error by providing empty string as fallback */
        />
      </div>
    </>
  );
}
