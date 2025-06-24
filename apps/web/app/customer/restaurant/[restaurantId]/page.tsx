import { getRestaurantData } from "./_components/RestaurantDetailsServer";
import RestaurantDetailsClient from "./_components/RestaurantDetailsClient";
import { Suspense } from "react";

export const dynamic = 'force-dynamic'; // Ensure the page is dynamic and not statically generated

/**
 * Restaurant details page that uses server components to fetch data
 * and passes it to a client component for rendering
 */
export default async function RestaurantPage({ params }: { params: { restaurantId: string } }) {
  // Get restaurant ID from params - await params to follow Next.js best practices
  const { restaurantId } = await params;
  
  // Fetch restaurant data from server component
  const { restaurant, dishes, menus, dishCategories, error } = await getRestaurantData(restaurantId);
  
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading restaurant details...</div>}>
      <RestaurantDetailsClient 
        restaurant={restaurant}
        dishes={dishes}
        menus={menus}
        dishCategories={dishCategories}
        error={error}
      />
    </Suspense>
  );
}
