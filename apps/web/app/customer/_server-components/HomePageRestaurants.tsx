import { getAllRestaurants, getPopularRestaurants, getRestaurantsByCuisine, getMockRestaurantsData } from './RestaurantDataProvider';
import { Restaurant } from '@/lib/api/restaurants-api';

/**
 * Server component props
 */
interface HomePageRestaurantsProps {
  popularLimit?: number;
  cuisineTypes?: string[];
}

/**
 * Server component that fetches restaurant data for the home page
 * @returns Object containing restaurant data for different sections
 */
export async function getHomePageRestaurants({
  popularLimit = 4,
  cuisineTypes = ['Pizza', 'Sushi', 'Burgers', 'Italian']
}: HomePageRestaurantsProps = {}) {
  try {
    // Fetch data in parallel for better performance
    const [allRestaurants, popularRestaurants, ...cuisineRestaurants] = await Promise.all([
      getAllRestaurants(),
      getPopularRestaurants(popularLimit),
      ...cuisineTypes.map(cuisine => getRestaurantsByCuisine(cuisine))
    ]);

    // Create a map of restaurants by cuisine
    const restaurantsByCuisine: Record<string, Restaurant[]> = {};
    cuisineTypes.forEach((cuisine, index) => {
      restaurantsByCuisine[cuisine] = cuisineRestaurants[index] || [];
    });

    return {
      allRestaurants,
      popularRestaurants,
      restaurantsByCuisine
    };
  } catch (error) {
    console.error("Error fetching homepage restaurant data:", error);
    
    // Use mock data as fallback
    const mockRestaurants = getMockRestaurantsData();
    
    // Create mock data for each section
    const mockPopular = [...mockRestaurants].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, popularLimit);
    
    // Create mock cuisine data
    const mockCuisineRestaurants: Record<string, Restaurant[]> = {};
    cuisineTypes.forEach(cuisine => {
      // Filter restaurants that have the cuisine type
      const filtered = mockRestaurants.filter(r => 
        r.cuisineType?.some(c => c.toLowerCase() === cuisine.toLowerCase())
      );
      mockCuisineRestaurants[cuisine] = filtered.length > 0 ? filtered : mockRestaurants.slice(0, 2);
    });
    
    return {
      allRestaurants: mockRestaurants,
      popularRestaurants: mockPopular,
      restaurantsByCuisine: mockCuisineRestaurants
    };
  }
}
