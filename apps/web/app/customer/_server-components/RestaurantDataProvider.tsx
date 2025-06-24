import { fetchRestaurants, searchRestaurants } from "@/lib/api/restaurant-server-actions";
import { Restaurant } from "@/lib/api/restaurants-api";

/**
 * Helper function to get mock restaurant data for development and fallback
 */
export function getMockRestaurantsData(): Restaurant[] {
  return [
    {
      id: 1,
      name: "Burger Palace",
      description: "Delicious burgers and fries in a casual setting",
      address: "123 Main St, New York, NY 10001",
      phone: "(212) 555-1234",
      email: "info@burgerpalace.com",
      website: "https://burgerpalace.com",
      cuisineType: ["American", "Burgers", "Fast Food"],
      openingHours: "Mon-Sun: 11am-10pm",
      priceRange: "$$",
      rating: 4.5,
      deliveryRadius: 5,
      minimumPurchase: 15,
      averagePreparationTime: "15-20 minutes",
      userId: 101,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 2,
      name: "Pizza Haven",
      description: "Authentic Italian pizzas made in a wood-fired oven",
      address: "456 Park Ave, New York, NY 10022",
      phone: "(212) 555-5678",
      email: "contact@pizzahaven.com",
      website: "https://pizzahaven.com",
      cuisineType: ["Italian", "Pizza"],
      openingHours: "Mon-Thu: 11am-11pm, Fri-Sun: 11am-1am",
      priceRange: "$$",
      rating: 4.7,
      deliveryRadius: 3,
      minimumPurchase: 20,
      averagePreparationTime: "20-25 minutes",
      userId: 102,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 3,
      name: "Sushi Spot",
      description: "Fresh and creative sushi in an elegant atmosphere",
      address: "789 Broadway, New York, NY 10003",
      phone: "(212) 555-9012",
      email: "hello@sushistpot.com",
      website: "https://sushistpot.com",
      cuisineType: ["Japanese", "Sushi", "Seafood"],
      openingHours: "Tue-Sun: 12pm-3pm, 5pm-10pm, Closed Mondays",
      priceRange: "$$$",
      rating: 4.8,
      deliveryRadius: 4,
      minimumPurchase: 25,
      averagePreparationTime: "15-20 minutes",
      userId: 103,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 4,
      name: "Taco Fiesta",
      description: "Authentic Mexican street food and margaritas",
      address: "321 Houston St, New York, NY 10002",
      phone: "(212) 555-3456",
      email: "info@tacofiesta.com",
      website: "https://tacofiesta.com",
      cuisineType: ["Mexican", "Tacos", "Latin"],
      openingHours: "Mon-Sun: 11am-11pm",
      priceRange: "$",
      rating: 4.3,
      deliveryRadius: 2,
      minimumPurchase: 15,
      averagePreparationTime: "10-15 minutes",
      userId: 104,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}

/**
 * Server component that fetches restaurant data
 * This component doesn't render anything, it's just used for data fetching
 */
export async function getAllRestaurants(): Promise<Restaurant[]> {
  try {
    // Fetch restaurants with server-side caching
    const restaurants = await fetchRestaurants({
      cache: "no-store", // Don't cache to ensure fresh data
      revalidate: 60 // Revalidate every minute as fallback
    });
    
    if (!restaurants || restaurants.length === 0) {
      console.log("No restaurants returned from API, using mock data");
      return getMockRestaurantsData();
    }
    
    return restaurants;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    // Return mock data on error
    return getMockRestaurantsData();
  }
}

/**
 * Get popular restaurants based on rating
 */
export async function getPopularRestaurants(limit: number = 4): Promise<Restaurant[]> {
  try {
    // Fetch all restaurants
    const allRestaurants = await getAllRestaurants();
    
    // Sort by rating and take the top ones
    return allRestaurants
      .filter(restaurant => restaurant.rating !== undefined)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
  } catch (error) {
    console.error("Error fetching popular restaurants:", error);
    // Return mock data sorted by rating
    return getMockRestaurantsData()
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
  }
}

/**
 * Get restaurants by cuisine type
 */
export async function getRestaurantsByCuisine(cuisine: string): Promise<Restaurant[]> {
  try {
    // Search restaurants by cuisine
    const restaurants = await searchRestaurants(
      { cuisine },
      {
        cache: "no-store",
        revalidate: 60
      }
    );
    
    if (!restaurants || restaurants.length === 0) {
      // If no restaurants found, filter mock data by cuisine
      const mockData = getMockRestaurantsData();
      const filteredMock = mockData.filter(r => 
        r.cuisineType?.some(c => c.toLowerCase() === cuisine.toLowerCase())
      );
      
      // If we have matching cuisines in mock data, return those, otherwise return first 2 mock restaurants
      return filteredMock.length > 0 ? filteredMock : mockData.slice(0, 2);
    }
    
    return Array.isArray(restaurants) ? restaurants : [];
  } catch (error) {
    console.error(`Error fetching ${cuisine} restaurants:`, error);
    // Filter mock data by cuisine as fallback
    const mockData = getMockRestaurantsData();
    const filteredMock = mockData.filter(r => 
      r.cuisineType?.some(c => c.toLowerCase() === cuisine.toLowerCase())
    );
    
    // If we have matching cuisines in mock data, return those, otherwise return first 2 mock restaurants
    return filteredMock.length > 0 ? filteredMock : mockData.slice(0, 2);
  }
}

/**
 * Get restaurants by location
 */
export async function getRestaurantsByLocation(location: string): Promise<Restaurant[]> {
  try {
    // Search restaurants by location
    const restaurants = await searchRestaurants(
      { location },
      {
        cache: "force-cache",
        revalidate: 3600
      }
    );
    
    return restaurants;
  } catch (error) {
    console.error(`Error fetching restaurants near ${location}:`, error);
    return [];
  }
}
