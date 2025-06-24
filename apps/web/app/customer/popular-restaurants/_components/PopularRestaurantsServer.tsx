import { fetchPopularRestaurants } from "@/lib/api/restaurant-server-actions";
import { Restaurant } from "@/lib/api/restaurants-api";

/**
 * Server component that fetches popular restaurants
 * This is a server-only component that fetches data and passes it to the client
 */
export async function getPopularRestaurantsData(): Promise<{
  restaurants: Restaurant[];
  error: string | null;
}> {
  try {
    // Fetch popular restaurants with server-side caching
    const restaurants = await fetchPopularRestaurants({
      limit: 20, // Get top 20 popular restaurants
      cache: "no-store", // Don't cache to ensure fresh data
      revalidate: 60 // Revalidate every minute as fallback
    });
    
    return {
      restaurants,
      error: null
    };
  } catch (error) {
    console.error("Error fetching popular restaurants:", error);
    return {
      restaurants: [],
      error: error instanceof Error ? error.message : "Failed to fetch popular restaurants"
    };
  }
}
