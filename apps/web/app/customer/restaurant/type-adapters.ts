import { Restaurant, Dish, Menu } from "@/lib/api/restaurants-api";
import { 
  ExtendedDish, 
  ExtendedMenu, 
  ExtendedRestaurant 
} from "./[restaurantId]/_components/RestaurantDetailsClient";

/**
 * Adapters to convert between API types and client component types
 * These functions help bridge the gap between the backend API response structure
 * and the frontend component expectations
 */

/**
 * Convert API Restaurant type to ExtendedRestaurant type
 */
export function toExtendedRestaurant(restaurant: Restaurant): ExtendedRestaurant {
  return {
    id: restaurant.id,
    userId: restaurant.userId,
    name: restaurant.name,
    address: restaurant.address,
    rating: restaurant.rating,
    bannerUrl: restaurant.website, // Use website as banner URL for now
    deliveryTime: restaurant.averagePreparationTime,
    deliveryFee: restaurant.minimumPurchase,
  };
}

/**
 * Convert API Dish type to ExtendedDish type
 */
export function toExtendedDish(dish: any): ExtendedDish {
  return {
    dishId: dish.dishId || dish.id || 0,
    id: dish.dishId || dish.id || 0, // Keep id for compatibility
    name: dish.name || "",
    description: dish.description || "",
    cost: dish.cost || dish.price || 0,
    userId: dish.userId || dish.restaurantId || 0,
    imageUrl: dish.picture || dish.image || "",
    picture: dish.picture || dish.image || "",
    tags: dish.category ? [dish.category] : [],
    isVegetarian: dish.isVegetarian || false,
    spicyLevel: dish.spicyLevel || 0,
    createdAt: dish.createdAt || new Date().toISOString(),
    updatedAt: dish.updatedAt || new Date().toISOString()
  };
}

/**
 * Convert API Menu type to ExtendedMenu type
 */
export function toExtendedMenu(menu: any, dishes: any[] = []): ExtendedMenu {
  // Handle the actual API response structure
  return {
    menuId: menu.menuId || menu.id || 0,
    id: menu.menuId || menu.id || 0, // Keep id for compatibility
    name: menu.name || "",
    description: menu.description || "",
    cost: menu.cost || menu.price || 0,
    picture: menu.picture || menu.image || "",
    tags: menu.tags || [],
    isVegetarian: menu.isVegetarian || false,
    spicyLevel: menu.spicyLevel || 0,
    createdAt: menu.createdAt || new Date().toISOString(),
    updatedAt: menu.updatedAt || new Date().toISOString(),
    dishes: (dishes || []).map(dish => toExtendedDish({
      id: dish.dishId || dish.id || 0,
      name: dish.name || "",
      description: dish.description || "",
      price: dish.cost || dish.price || 0,
      image: dish.picture || dish.image || "",
      category: dish.category || "",
      restaurantId: dish.userId || dish.restaurantId || 0,
      createdAt: dish.createdAt || new Date().toISOString(),
      updatedAt: dish.updatedAt || new Date().toISOString(),
      isVegetarian: dish.isVegetarian || false,
      isVegan: dish.isVegan || false,
      isGlutenFree: dish.isGlutenFree || false,
      ingredients: dish.ingredients || [],
      allergens: dish.allergens || []
    }))
  };
}

/**
 * Convert array of API types to array of extended types
 */
export function toExtendedDishes(dishes: Dish[]): ExtendedDish[] {
  return dishes.map(toExtendedDish);
}

export function toExtendedMenus(menus: any[], allDishes: Dish[] = []): ExtendedMenu[] {
  return menus.map(menu => {
    // Check if the menu has a dishes array in the API response
    // The API response structure has dishes nested in each menu
    const menuDishes = menu.dishes || [];
    
    // Log for debugging
    console.log('Menu:', menu.name, 'Dishes:', menuDishes.length);
    
    return toExtendedMenu(menu, menuDishes);
  });
}

/**
 * Convert dish categories object to use ExtendedDish
 */
export function toExtendedDishCategories(
  dishCategories: {[key: string]: Dish[]}
): {[key: string]: ExtendedDish[]} {
  const result: {[key: string]: ExtendedDish[]} = {};
  
  for (const [category, dishes] of Object.entries(dishCategories)) {
    result[category] = toExtendedDishes(dishes);
  }
  
  return result;
}
