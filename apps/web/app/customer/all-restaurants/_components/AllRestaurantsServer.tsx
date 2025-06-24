import { fetchRestaurants } from "@/lib/api/restaurant-server-actions";
import { Restaurant } from "@/lib/api/restaurants-api";
import { getMockRestaurantsData } from "../../_server-components/RestaurantDataProvider";

/**
 * Server component that fetches all restaurants
 * This is a server-only component that fetches data and passes it to the client
 */
export async function getAllRestaurantsData(): Promise<{
  restaurants: Restaurant[];
  error: string | null;
}> {
  try {
    // Fetch restaurants with server-side caching
    const restaurants = await fetchRestaurants({
      cache: "no-store", // Don't cache to ensure fresh data
      revalidate: 60 // Revalidate every minute as fallback
    });
    
    return {
      restaurants,
      error: null
    };
  } catch (error) {
    console.error("Error fetching all restaurants:", error);
    // Fallback to mock data
    return {
      restaurants: getMockRestaurantsData(),
      error: "Using mock data due to API error: " + (error instanceof Error ? error.message : String(error))
    };
  }
}
