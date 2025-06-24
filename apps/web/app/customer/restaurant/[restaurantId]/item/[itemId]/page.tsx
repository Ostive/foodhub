import { getDishData } from "./_components/DishDetailsServer";
import DishDetailsClient from "./_components/DishDetailsClient";
import { Suspense } from "react";

export const dynamic = 'force-dynamic'; // Ensure the page is dynamic and not statically generated

/**
 * Dish details page that uses server components to fetch data
 * and passes it to a client component for rendering
 */
export default async function ItemDetailsPage({ params }: { params: { restaurantId: string, itemId: string } }) {
  // Get restaurant and item IDs from params
  const restaurantId = params.restaurantId;
  const itemId = params.itemId;
  
  try {
    // Fetch dish and restaurant data using server component helper
    const { dish, restaurant, error } = await getDishData(restaurantId, itemId);
    
    // If there's an error, throw it to be caught by the error boundary
    if (error) {
      throw new Error(error);
    }
    
    // If dish or restaurant is not found, throw an error
    if (!dish || !restaurant) {
      throw new Error('Dish or restaurant not found');
    }
    
    // Render the dish details client component with the fetched data
    return (
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      }>
        <DishDetailsClient 
          dish={dish} 
          restaurant={restaurant} 
        />
      </Suspense>
    );
  } catch (error) {
    // Handle errors gracefully
    console.error('Error in dish details page:', error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl font-semibold mb-4">Failed to load dish details</p>
        <a href={`/customer/restaurant/${restaurantId}`} className="text-primary hover:underline">
          Back to restaurant
        </a>
      </div>
    );
  }
}
