/**
 * Server actions for restaurant-related operations in Next.js Server Components
 */

import { serverApiRequest } from './server-api';
import { 
  Restaurant, 
  Dish, 
  DishResponse,
  Menu, 
  MenuResponse,
  CreateRestaurantDto, 
  UpdateRestaurantDto,
  CreateDishDto,
  UpdateDishDto,
  CreateMenuDto,
  UpdateMenuDto,
  SearchParams
} from './restaurants-api';

// Base service
const SERVICE = 'restaurant';

// Restaurant server actions
export async function fetchRestaurants(options?: { cache?: RequestCache, revalidate?: number }) {
  return serverApiRequest<Restaurant[]>(
    SERVICE,
    'restaurants',
    {
      cache: options?.cache,
      next: options?.revalidate !== undefined ? { revalidate: options.revalidate } : undefined
    }
  );
}

export async function fetchPopularRestaurants(options?: { limit?: number, cache?: RequestCache, revalidate?: number }) {
  const queryParams = options?.limit ? `?limit=${options.limit}` : '';
  return serverApiRequest<Restaurant[]>(
    'restaurant', // Use the restaurant service
    `popular${queryParams ? '?' + queryParams : ''}`, // Use the popular endpoint
    {
      cache: options?.cache,
      next: options?.revalidate !== undefined ? { revalidate: options.revalidate } : undefined
    }
  );
}

export async function fetchRestaurantById(id: number, options?: { cache?: RequestCache, revalidate?: number }) {
  return serverApiRequest<Restaurant>(
    SERVICE,
    `restaurants/${id}`,
    {
      cache: options?.cache,
      next: options?.revalidate !== undefined ? { revalidate: options.revalidate } : undefined
    }
  );
}

export async function searchRestaurants(params: SearchParams, options?: { cache?: RequestCache, revalidate?: number }) {
  const queryParams = new URLSearchParams();
  if (params.name) queryParams.append('name', params.name);
  if (params.cuisine) queryParams.append('cuisine', params.cuisine);
  if (params.location) queryParams.append('location', params.location);
  
  return serverApiRequest<Restaurant[]>(
    SERVICE,
    `restaurants/search?${queryParams.toString()}`,
    {
      cache: options?.cache,
      next: options?.revalidate !== undefined ? { revalidate: options.revalidate } : undefined
    }
  );
}

export async function createRestaurant(restaurantData: CreateRestaurantDto) {
  return serverApiRequest<Restaurant>(
    SERVICE,
    'restaurants',
    {
      method: 'POST',
      body: JSON.stringify(restaurantData),
    }
  );
}

export async function updateRestaurant(id: number, restaurantData: UpdateRestaurantDto) {
  return serverApiRequest<Restaurant>(
    SERVICE,
    `restaurants/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(restaurantData),
    }
  );
}

// Dish server actions
export async function fetchRestaurantDishes(restaurantId: number, options?: { cache?: RequestCache, revalidate?: number }) {
  return serverApiRequest<DishResponse>(
    SERVICE,
    `restaurants/${restaurantId}/dishes`,
    {
      cache: options?.cache,
      next: options?.revalidate !== undefined ? { revalidate: options.revalidate } : undefined
    }
  );
}

/**
 * Fetch dishes for a specific menu
 */
export async function fetchMenuDishes(restaurantId: number, menuId: number, options?: { cache?: RequestCache, revalidate?: number }) {
  return serverApiRequest<DishResponse>(
    SERVICE,
    `restaurants/${restaurantId}/menu/${menuId}/dishes`,
    {
      cache: options?.cache,
      next: options?.revalidate !== undefined ? { revalidate: options.revalidate } : undefined
    }
  );
}

export async function fetchRestaurantDishById(restaurantId: number, dishId: number, options?: { cache?: RequestCache, revalidate?: number }) {
  return serverApiRequest<Dish>(
    SERVICE,
    `restaurants/${restaurantId}/dishes/${dishId}`,
    {
      cache: options?.cache,
      next: options?.revalidate !== undefined ? { revalidate: options.revalidate } : undefined
    }
  );
}

export async function searchRestaurantDishes(restaurantId: number, query: string, options?: { cache?: RequestCache, revalidate?: number }) {
  const queryParams = new URLSearchParams();
  queryParams.append('q', query);
  
  return serverApiRequest<Dish[]>(
    SERVICE,
    `restaurants/${restaurantId}/dishes/search?${queryParams.toString()}`,
    {
      cache: options?.cache,
      next: options?.revalidate !== undefined ? { revalidate: options.revalidate } : undefined
    }
  );
}

export async function createRestaurantDish(restaurantId: number, dishData: CreateDishDto) {
  return serverApiRequest<Dish>(
    SERVICE,
    `restaurants/${restaurantId}/dishes`,
    {
      method: 'POST',
      body: JSON.stringify(dishData),
    }
  );
}

export async function updateRestaurantDish(restaurantId: number, dishId: number, dishData: UpdateDishDto) {
  return serverApiRequest<Dish>(
    SERVICE,
    `restaurants/${restaurantId}/dishes/${dishId}`,
    {
      method: 'PUT',
      body: JSON.stringify(dishData),
    }
  );
}

export async function deleteRestaurantDish(restaurantId: number, dishId: number) {
  return serverApiRequest<void>(
    SERVICE,
    `restaurants/${restaurantId}/dishes/${dishId}`,
    {
      method: 'DELETE',
    }
  );
}

// Menu server actions
export async function fetchRestaurantMenus(restaurantId: number, options?: { cache?: RequestCache, revalidate?: number }) {
  return serverApiRequest<MenuResponse>(
    SERVICE,
    `restaurants/${restaurantId}/menu`,
    {
      cache: options?.cache,
      next: options?.revalidate !== undefined ? { revalidate: options.revalidate } : undefined
    }
  );
}

export async function fetchRestaurantMenuById(restaurantId: number, menuId: number, options?: { cache?: RequestCache, revalidate?: number }) {
  return serverApiRequest<Menu>(
    SERVICE,
    `restaurants/${restaurantId}/menu/${menuId}`,
    {
      cache: options?.cache,
      next: options?.revalidate !== undefined ? { revalidate: options.revalidate } : undefined
    }
  );
}

export async function searchRestaurantMenus(restaurantId: number, query: string, options?: { cache?: RequestCache, revalidate?: number }) {
  const queryParams = new URLSearchParams();
  queryParams.append('q', query);
  
  return serverApiRequest<Menu[]>(
    SERVICE,
    `restaurants/${restaurantId}/menu/search?${queryParams.toString()}`,
    {
      cache: options?.cache,
      next: options?.revalidate !== undefined ? { revalidate: options.revalidate } : undefined
    }
  );
}

export async function createRestaurantMenu(restaurantId: number, menuData: CreateMenuDto) {
  return serverApiRequest<Menu>(
    SERVICE,
    `restaurants/${restaurantId}/menu`,
    {
      method: 'POST',
      body: JSON.stringify(menuData),
    }
  );
}

export async function updateRestaurantMenu(restaurantId: number, menuId: number, menuData: UpdateMenuDto) {
  return serverApiRequest<Menu>(
    SERVICE,
    `restaurants/${restaurantId}/menu/${menuId}`,
    {
      method: 'PUT',
      body: JSON.stringify(menuData),
    }
  );
}

export async function deleteRestaurantMenu(restaurantId: number, menuId: number) {
  return serverApiRequest<void>(
    SERVICE,
    `restaurants/${restaurantId}/menu/${menuId}`,
    {
      method: 'DELETE',
    }
  );
}

export async function addDishesToMenu(restaurantId: number, menuId: number, dishIds: number[]) {
  return serverApiRequest<Menu>(
    SERVICE,
    `restaurants/${restaurantId}/menu/${menuId}/dishes`,
    {
      method: 'POST',
      body: JSON.stringify({ dishIds }),
    }
  );
}

export async function removeDishFromMenu(restaurantId: number, menuId: number, dishId: number) {
  return serverApiRequest<void>(
    SERVICE,
    `restaurants/${restaurantId}/menu/${menuId}/dishes/${dishId}`,
    {
      method: 'DELETE',
    }
  );
}
