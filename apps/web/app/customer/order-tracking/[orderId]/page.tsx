import { getOrderDataWithFallback } from "./_components/OrderTrackingServer";
import OrderTrackingClient from "./_components/OrderTrackingClient";
import { Suspense } from "react";

export const dynamic = 'force-dynamic'; // Ensure the page is dynamic and not statically generated

/**
 * Order tracking page that uses server components to fetch data
 * and passes it to a client component for rendering
 */
export default async function OrderTrackingPage({ params }: { params: { orderId: string } }) {
  // Get order ID from params
  const orderId = params.orderId;
  
  try {
    // Fetch order data using server component helper
    const { order, error } = await getOrderDataWithFallback(orderId);
    
    // Render the order tracking client component with the fetched data
    return (
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      }>
        <OrderTrackingClient 
          order={order} 
          error={error} 
        />
      </Suspense>
    );
  } catch (error) {
    // Handle errors gracefully
    console.error('Error in order tracking page:', error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl font-semibold mb-4">Failed to load order details</p>
        <a href="/customer/orders" className="text-primary hover:underline">
          Back to orders
        </a>
      </div>
    );
  }
}
