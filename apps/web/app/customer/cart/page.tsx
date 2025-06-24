import { getCartPageData } from "./_components/CartServer";
import { Suspense } from "react";
import CartWrapper from "./CartWrapper";


export const dynamic = 'force-dynamic'; // Ensure the page is dynamic and not statically generated

/**
 * Cart page that uses server components to fetch data
 * and passes it to a client component for rendering
 */
export default async function CartPage() {
  try {
    // Fetch cart page data using server component helper
    const { addressSuggestions, paymentMethods, error } = await getCartPageData();
    
    // Render the cart client component with the fetched data
    return (
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      }>
        <CartWrapper 
          addressSuggestions={addressSuggestions} 
          paymentMethods={paymentMethods} 
          error={error || null} 
        />
      </Suspense>
    );
  } catch (error) {
    // Handle errors gracefully
    console.error('Error in cart page:', error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl font-semibold mb-4">Failed to load cart</p>
        <a href="/customer" className="text-primary hover:underline">
          Back to home
        </a>
      </div>
    );
  }
}
