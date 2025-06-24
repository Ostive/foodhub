import { fetchRestaurantById } from "@/lib/api/restaurant-server-actions";
import { fetchRestaurantDishById } from "@/lib/api/restaurant-server-actions";
import { Restaurant, Dish } from "@/lib/api/restaurants-api";

/**
 * Server component that fetches dish details
 * This is a server-only component that fetches data and passes it to the client
 */
export async function getDishData(restaurantId: string, dishId: string): Promise<{
  restaurant: Restaurant | null;
  dish: Dish | null;
  error: string | null;
}> {
  try {
    // Fetch restaurant and dish details in parallel
    const [restaurantResult, dishResult] = await Promise.all([
      fetchRestaurantById(parseInt(restaurantId), {
        cache: "no-store", // Don't cache to ensure fresh data
        revalidate: 60 // Revalidate every minute as fallback
      }).catch(error => {
        console.error("Error fetching restaurant:", error);
        return null;
      }),
      fetchRestaurantDishById(parseInt(restaurantId), parseInt(dishId), {
        cache: "no-store", // Don't cache to ensure fresh data
        revalidate: 60 // Revalidate every minute as fallback
      }).catch(error => {
        console.error("Error fetching dish:", error);
        return null;
      })
    ]);
    
    return {
      restaurant: restaurantResult,
      dish: dishResult,
      error: null
    };
  } catch (error) {
    console.error("Error fetching dish data:", error);
    return {
      restaurant: null,
      dish: null,
      error: error instanceof Error ? error.message : "Failed to fetch dish data"
    };
  }
}
