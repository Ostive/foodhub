import { fetchRestaurantById, fetchRestaurantDishes, fetchRestaurantMenus } from "@/lib/api/restaurant-server-actions";
import { Restaurant, Dish, DishResponse, Menu, MenuResponse } from "@/lib/api/restaurants-api";
import { ExtendedRestaurant, ExtendedDish, ExtendedMenu } from "./RestaurantDetailsClient";
import { toExtendedRestaurant, toExtendedDishes, toExtendedMenus, toExtendedDishCategories } from "../../type-adapters";

/**
 * Server component that fetches restaurant details and dishes
 * This is a server-only component that fetches data and passes it to the client
 */
export async function getRestaurantData(restaurantId: string): Promise<{
  restaurant: ExtendedRestaurant | null;
  dishes: ExtendedDish[];
  menus: ExtendedMenu[];
  dishCategories: {[key: string]: ExtendedDish[]};
  error: string | null;
}> {
  try {
    // Fetch restaurant details, dishes, and menus in parallel
    const [restaurantResult, dishesResponse, menusResult] = await Promise.all([
      fetchRestaurantById(parseInt(restaurantId), {
        cache: "no-store", // Don't cache to ensure fresh data
        revalidate: 60 // Revalidate every minute as fallback
      }).catch(error => {
        console.error("Error fetching restaurant:", error);
        return null;
      }),
      fetchRestaurantDishes(parseInt(restaurantId), {
        cache: "no-store", // Don't cache to ensure fresh data
        revalidate: 60 // Revalidate every minute as fallback
      }).catch(error => {
        console.error("Error fetching dishes:", error);
        return { 
          success: false, 
          message: "Error fetching dishes", 
          count: 0, 
          page: 1, 
          limit: 10, 
          totalPages: 0, 
          hasNext: false, 
          hasPrevious: false, 
          dishes: [] 
        } as DishResponse;
      }),
      fetchRestaurantMenus(parseInt(restaurantId), {
        cache: "no-store", // Don't cache to ensure fresh data
        revalidate: 60 // Revalidate every minute as fallback
      }).then((response: MenuResponse | Menu[]) => {
        // Extract menus from the API response structure
        console.log('Menu API response:', response);
        // Check if response is the new MenuResponse structure
        if (response && 'menus' in response) {
          return response.menus;
        }
        // Fallback to old structure where response is directly Menu[]
        return response as Menu[];
      }).catch(error => {
        console.error("Error fetching menus:", error);
        return [];
      })
    ]);
    
    // Extract dishes from the DishResponse
    const dishesArray = dishesResponse && 'dishes' in dishesResponse ? dishesResponse.dishes : [];
    const menusArray = Array.isArray(menusResult) ? menusResult : [];
    
    // Log for debugging
    console.log('Dishes response:', dishesResponse);
    console.log('Extracted dishes:', dishesArray);
    
    // Organize dishes by category
    const dishCategories: {[key: string]: Dish[]} = {};
    
    // Process dishes by category
    dishesArray.forEach((dish: any) => {
      const category = dish.category || 'Uncategorized';
      if (!dishCategories[category]) {
        dishCategories[category] = [];
      }
      dishCategories[category].push(dish);
    });
    
    // Convert API types to extended types using our adapters
    const extendedRestaurant = restaurantResult ? toExtendedRestaurant(restaurantResult) : null;
    
    // Use the already defined arrays for dishes and menus
    const extendedDishes = toExtendedDishes(dishesArray);
    const extendedMenus = toExtendedMenus(menusArray, dishesArray);
    const extendedDishCategories = toExtendedDishCategories(dishCategories);
    
    // Return the converted data
    return {
      restaurant: extendedRestaurant,
      dishes: extendedDishes,
      menus: extendedMenus,
      dishCategories: extendedDishCategories,
      error: null
    };
  } catch (error) {
    console.error("Error in getRestaurantData:", error);
    // Fallback to mock data in development
    if (process.env.NODE_ENV === 'development') {
      const mockRestaurant = getMockRestaurant(restaurantId);
      const mockDishes = getMockDishes(restaurantId);
      const mockMenus: Menu[] = []; // Empty mock menus for now
      
      // Organize mock dishes by category
      const mockDishCategories: {[key: string]: Dish[]} = {};
      mockDishes.forEach(dish => {
        const category = dish.category || 'Uncategorized';
        if (!mockDishCategories[category]) {
          mockDishCategories[category] = [];
        }
        mockDishCategories[category].push(dish);
      });
      
      // Convert mock data to extended types
      const extendedMockRestaurant = toExtendedRestaurant(mockRestaurant);
      const extendedMockDishes = toExtendedDishes(mockDishes);
      const extendedMockMenus = toExtendedMenus(mockMenus, mockDishes);
      const extendedMockDishCategories = toExtendedDishCategories(mockDishCategories);
      
      return {
        restaurant: extendedMockRestaurant,
        dishes: extendedMockDishes,
        menus: extendedMockMenus,
        dishCategories: extendedMockDishCategories,
        error: "Using mock data due to API error: " + (error instanceof Error ? error.message : String(error))
      };
    } else {
      // Fallback to empty arrays in case of error, but convert to extended types
      return {
        restaurant: null,
        dishes: toExtendedDishes([]),
        menus: toExtendedMenus([], []),
        dishCategories: toExtendedDishCategories({}),
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

/**
 * Helper function to get mock restaurant data for development and fallback
 */
export function getMockRestaurant(restaurantId: string): Restaurant {
  return {
    id: parseInt(restaurantId),
    name: `Restaurant ${restaurantId}`,
    description: "A delicious restaurant with a variety of dishes",
    address: "123 Main St, New York, NY 10001",
    phone: "(212) 555-1234",
    email: `restaurant${restaurantId}@example.com`,
    website: `https://restaurant${restaurantId}.com`,
    cuisineType: ["American", "Italian", "Asian Fusion"],
    openingHours: "Mon-Sun: 11am-10pm",
    priceRange: "$$",
    rating: 4.5,
    deliveryRadius: 5,
    minimumPurchase: 15,
    averagePreparationTime: "15-20 minutes",
    userId: 101,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Helper function to get mock dish data for development and fallback
 */
export function getMockDishes(restaurantId: string): Dish[] {
  return [
    {
      dishId: 1,
      name: "Classic Burger",
      description: "Juicy beef patty with lettuce, tomato, and special sauce",
      cost: 12.99,
      picture: "/images/dishes/burger.jpg",
      category: "Burgers",
      ingredients: ["Beef", "Lettuce", "Tomato", "Onion", "Special Sauce"],
      allergens: ["Gluten", "Dairy"],
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      restaurantId: parseInt(restaurantId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      dishId: 2,
      name: "Caesar Salad",
      description: "Fresh romaine lettuce with parmesan cheese and croutons",
      cost: 9.99,
      picture: "/images/dishes/salad.jpg",
      category: "Salads",
      ingredients: ["Romaine Lettuce", "Parmesan Cheese", "Croutons", "Caesar Dressing"],
      allergens: ["Gluten", "Dairy", "Eggs"],
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      restaurantId: parseInt(restaurantId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      dishId: 3,
      name: "Margherita Pizza",
      description: "Classic pizza with tomato sauce, mozzarella, and basil",
      cost: 14.99,
      picture: "/images/dishes/pizza.jpg",
      category: "Pizzas",
      ingredients: ["Dough", "Tomato Sauce", "Mozzarella", "Basil"],
      allergens: ["Gluten", "Dairy"],
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      restaurantId: parseInt(restaurantId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      dishId: 4,
      name: "French Fries",
      description: "Crispy golden fries with sea salt",
      cost: 4.99,
      picture: "/images/dishes/fries.jpg",
      category: "Sides",
      ingredients: ["Potatoes", "Salt", "Oil"],
      allergens: [],
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
      restaurantId: parseInt(restaurantId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      dishId: 5,
      name: "Chocolate Milkshake",
      description: "Rich and creamy chocolate milkshake",
      cost: 5.99,
      picture: "/images/dishes/milkshake.jpg",
      category: "Drinks",
      ingredients: ["Milk", "Ice Cream", "Chocolate Syrup"],
      allergens: ["Dairy"],
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true,
      restaurantId: parseInt(restaurantId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}
