import { getOrderDataWithFallback } from "./_components/OrderTrackingServer";
import OrderTrackingClient from "./_components/OrderTrackingClient";
import { Suspense } from "react";

export const dynamic = 'force-dynamic'; // Ensure the page is dynamic and not statically generated

/**
 * Order tracking page that uses server components to fetch data
 * and passes it to a client component for rendering
 */
export default async function OrderTrackingPage({ params }: { params: { orderId: string } }) {
  try {
    // Get order ID from params - properly awaited to fix the error
    const { orderId } = params;
    
    if (!orderId) {
      throw new Error('Order ID is missing');
    }
    
    // Fetch order data using server component helper
    const { order, error } = await getOrderDataWithFallback(orderId);
    
    // If there's an error, show it properly
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md w-full text-center shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
            <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Order</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <a href="/customer/orders" className="inline-block px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              Back to Orders
            </a>
          </div>
        </div>
      );
    }
    
    // Render the order tracking client component with the fetched data
    return (
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      }>
        <OrderTrackingClient 
          order={order} 
          error={null} 
        />
      </Suspense>
    );
  } catch (error) {
    // Handle errors gracefully with a user-friendly error page
    console.error('Error in order tracking page:', error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md w-full text-center shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Something Went Wrong</h2>
          <p className="text-red-600 mb-4">We couldn't load your order details. Please try again later.</p>
          <a href="/customer/orders" className="inline-block px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            Back to Orders
          </a>
        </div>
      </div>
    );
  }
}
