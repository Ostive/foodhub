import { getOrdersWithFallback } from "./_components/OrdersServer";
import OrdersClient from "./_components/OrdersClient";
import { Suspense } from "react";

export const dynamic = 'force-dynamic'; // Ensure the page is dynamic and not statically generated

/**
 * Orders page that uses server components to fetch data
 * and passes it to a client component for rendering
 */
export default async function OrdersPage() {
  try {
    // Fetch orders data using server component helper
    const { orders, error } = await getOrdersWithFallback();
    
    // Render the orders client component with the fetched data
    return (
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      }>
        <OrdersClient 
          initialOrders={orders} 
          error={error} 
        />
      </Suspense>
    );
  } catch (error) {
    // Handle errors gracefully
    console.error('Error in orders page:', error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl font-semibold mb-4">Failed to load orders</p>
        <a href="/customer" className="text-primary hover:underline">
          Back to home
        </a>
      </div>
    );
  }
}
