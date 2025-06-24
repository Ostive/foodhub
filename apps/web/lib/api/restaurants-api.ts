/**
 * Restaurants API client for interacting with the restaurant service
 */

import { apiRequest } from './api-client';

// Base service
const SERVICE = 'restaurant';

// Types for API requests and responses
export type Restaurant = {
  id: number;
  name: string;
  description?: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  cuisineType?: string[];
  openingHours?: string;
  rating?: number;
  priceRange?: string;
  deliveryRadius?: number;
  minimumPurchase?: number;
  averagePreparationTime?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
};

export type Dish = {
  dishId: number;
  name: string;
  description?: string;
  cost: number;
  differCost?: number;
  picture?: string;
  category?: string;
  ingredients?: string[];
  allergens?: string[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  restaurantId?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type DishResponse = {
  success: boolean;
  message: string;
  count: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  dishes: Dish[];
};

export type Menu = {
  menuId: number;
  name: string;
  description?: string;
  cost: number;
  picture?: string;
  dishes: {
    dishId: number;
    name: string;
    description?: string;
    cost: number;
    differCost?: number;
  }[];
  tags?: string[];
  isVegetarian?: boolean;
  spicyLevel?: number | null;
  restaurant?: {
    id: number;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type MenuResponse = {
  success: boolean;
  message: string;
  count: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  menus: Menu[];
};

export type CreateRestaurantDto = {
  name: string;
  description?: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  cuisineType?: string[];
  openingHours?: string;
  priceRange?: string;
  deliveryRadius?: number;
  minimumPurchase?: number;
  averagePreparationTime?: string;
  userId: number;
};

export type UpdateRestaurantDto = Partial<CreateRestaurantDto>;

export type CreateDishDto = {
  name: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
  ingredients?: string[];
  allergens?: string[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
};

export type UpdateDishDto = Partial<CreateDishDto>;

export type CreateMenuDto = {
  name: string;
  description?: string;
  price: number;
  image?: string;
  dishIds?: number[];
};

export type UpdateMenuDto = Partial<CreateMenuDto>;

export type SearchParams = {
  name?: string;
  cuisine?: string;
  location?: string;
};

// Restaurant API functions
export const restaurantsApi = {
  // Get all restaurants
  getAll: () => apiRequest<Restaurant[]>(SERVICE, 'restaurants'),
  
  // Get restaurant by ID
  getById: (id: number) => apiRequest<Restaurant>(SERVICE, `restaurants/${id}`),
  
  // Create a new restaurant
  create: (restaurantData: CreateRestaurantDto) => apiRequest<Restaurant>(SERVICE, 'restaurants', {
    method: 'POST',
    body: JSON.stringify(restaurantData),
  }),
  
  // Update a restaurant
  update: (id: number, restaurantData: UpdateRestaurantDto) => apiRequest<Restaurant>(SERVICE, `restaurants/${id}`, {
    method: 'PUT',
    body: JSON.stringify(restaurantData),
  }),
  
  // Search restaurants
  search: (params: SearchParams) => {
    const queryParams = new URLSearchParams();
    if (params.name) queryParams.append('name', params.name);
    if (params.cuisine) queryParams.append('cuisine', params.cuisine);
    if (params.location) queryParams.append('location', params.location);
    
    return apiRequest<Restaurant[]>(SERVICE, `restaurants/search?${queryParams.toString()}`);
  },
  
  // Dish-related API functions
  dishes: {
    // Get all dishes for a restaurant
    getAll: (restaurantId: number) => apiRequest<Dish[]>(SERVICE, `restaurants/${restaurantId}/dishes`),
    
    // Get dish by ID
    getById: (restaurantId: number, dishId: number) => apiRequest<Dish>(SERVICE, `restaurants/${restaurantId}/dishes/${dishId}`),
    
    // Create a new dish
    create: (restaurantId: number, dishData: CreateDishDto) => apiRequest<Dish>(SERVICE, `restaurants/${restaurantId}/dishes`, {
      method: 'POST',
      body: JSON.stringify(dishData),
    }),
    
    // Update a dish
    update: (restaurantId: number, dishId: number, dishData: UpdateDishDto) => apiRequest<Dish>(SERVICE, `restaurants/${restaurantId}/dishes/${dishId}`, {
      method: 'PUT',
      body: JSON.stringify(dishData),
    }),
    
    // Delete a dish
    delete: (restaurantId: number, dishId: number) => apiRequest<void>(SERVICE, `restaurants/${restaurantId}/dishes/${dishId}`, {
      method: 'DELETE',
    }),
    
    // Search dishes
    search: (restaurantId: number, query: string) => {
      const queryParams = new URLSearchParams();
      queryParams.append('q', query);
      
      return apiRequest<Dish[]>(SERVICE, `restaurants/${restaurantId}/dishes/search?${queryParams.toString()}`);
    },
  },
  
  // Menu-related API functions
  menus: {
    // Get all menus for a restaurant
    getAll: (restaurantId: number) => apiRequest<Menu[]>(SERVICE, `restaurants/${restaurantId}/menu`),
    
    // Get menu by ID
    getById: (restaurantId: number, menuId: number) => apiRequest<Menu>(SERVICE, `restaurants/${restaurantId}/menu/${menuId}`),
    
    // Create a new menu
    create: (restaurantId: number, menuData: CreateMenuDto) => apiRequest<Menu>(SERVICE, `restaurants/${restaurantId}/menu`, {
      method: 'POST',
      body: JSON.stringify(menuData),
    }),
    
    // Update a menu
    update: (restaurantId: number, menuId: number, menuData: UpdateMenuDto) => apiRequest<Menu>(SERVICE, `restaurants/${restaurantId}/menu/${menuId}`, {
      method: 'PUT',
      body: JSON.stringify(menuData),
    }),
    
    // Delete a menu
    delete: (restaurantId: number, menuId: number) => apiRequest<void>(SERVICE, `restaurants/${restaurantId}/menu/${menuId}`, {
      method: 'DELETE',
    }),
    
    // Search menus
    search: (restaurantId: number, query: string) => {
      const queryParams = new URLSearchParams();
      queryParams.append('q', query);
      
      return apiRequest<Menu[]>(SERVICE, `restaurants/${restaurantId}/menu/search?${queryParams.toString()}`);
    },
    
    // Add dishes to a menu
    addDishes: (restaurantId: number, menuId: number, dishIds: number[]) => apiRequest<Menu>(SERVICE, `restaurants/${restaurantId}/menu/${menuId}/dishes`, {
      method: 'POST',
      body: JSON.stringify({ dishIds }),
    }),
    
    // Remove a dish from a menu
    removeDish: (restaurantId: number, menuId: number, dishId: number) => apiRequest<void>(SERVICE, `restaurants/${restaurantId}/menu/${menuId}/dishes/${dishId}`, {
      method: 'DELETE',
    }),
  },
};
