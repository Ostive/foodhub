/**
 * React Query hooks for restaurant-related API operations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  restaurantsApi,
  Restaurant,
  Dish,
  Menu,
  CreateRestaurantDto,
  UpdateRestaurantDto,
  CreateDishDto,
  UpdateDishDto,
  CreateMenuDto,
  UpdateMenuDto,
  SearchParams
} from '../api/restaurants-api';

// Query keys
export const restaurantKeys = {
  all: ['restaurants'] as const,
  lists: () => [...restaurantKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...restaurantKeys.lists(), filters] as const,
  details: () => [...restaurantKeys.all, 'detail'] as const,
  detail: (id: number) => [...restaurantKeys.details(), id] as const,
  search: (params: SearchParams) => [...restaurantKeys.all, 'search', params] as const,
  dishes: (restaurantId: number) => [...restaurantKeys.detail(restaurantId), 'dishes'] as const,
  dish: (restaurantId: number, dishId: number) => [...restaurantKeys.dishes(restaurantId), dishId] as const,
  menus: (restaurantId: number) => [...restaurantKeys.detail(restaurantId), 'menus'] as const,
  menu: (restaurantId: number, menuId: number) => [...restaurantKeys.menus(restaurantId), menuId] as const,
};

// Restaurant hooks
export function useRestaurants(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: restaurantKeys.lists(),
    queryFn: () => restaurantsApi.getAll(),
    enabled: options?.enabled,
  });
}

export function useRestaurant(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: restaurantKeys.detail(id),
    queryFn: () => restaurantsApi.getById(id),
    enabled: options?.enabled !== false && !!id,
  });
}

export function useSearchRestaurants(params: SearchParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: restaurantKeys.search(params),
    queryFn: () => restaurantsApi.search(params),
    enabled: options?.enabled !== false && (!!params.name || !!params.cuisine || !!params.location),
  });
}

export function useCreateRestaurant() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (restaurantData: CreateRestaurantDto) => restaurantsApi.create(restaurantData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.lists() });
    },
  });
}

export function useUpdateRestaurant() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, restaurantData }: { id: number; restaurantData: UpdateRestaurantDto }) => 
      restaurantsApi.update(id, restaurantData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: restaurantKeys.lists() });
    },
  });
}

// Dish hooks
export function useRestaurantDishes(restaurantId: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: restaurantKeys.dishes(restaurantId),
    queryFn: () => restaurantsApi.dishes.getAll(restaurantId),
    enabled: options?.enabled !== false && !!restaurantId,
  });
}

export function useRestaurantDish(restaurantId: number, dishId: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: restaurantKeys.dish(restaurantId, dishId),
    queryFn: () => restaurantsApi.dishes.getById(restaurantId, dishId),
    enabled: options?.enabled !== false && !!restaurantId && !!dishId,
  });
}

export function useSearchDishes(restaurantId: number, query: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...restaurantKeys.dishes(restaurantId), 'search', query],
    queryFn: () => restaurantsApi.dishes.search(restaurantId, query),
    enabled: options?.enabled !== false && !!restaurantId && !!query,
  });
}

export function useCreateDish() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ restaurantId, dishData }: { restaurantId: number; dishData: CreateDishDto }) => 
      restaurantsApi.dishes.create(restaurantId, dishData),
    onSuccess: (_, { restaurantId }) => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.dishes(restaurantId) });
    },
  });
}

export function useUpdateDish() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ restaurantId, dishId, dishData }: { 
      restaurantId: number; 
      dishId: number;
      dishData: UpdateDishDto 
    }) => restaurantsApi.dishes.update(restaurantId, dishId, dishData),
    onSuccess: (_, { restaurantId, dishId }) => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.dish(restaurantId, dishId) });
      queryClient.invalidateQueries({ queryKey: restaurantKeys.dishes(restaurantId) });
    },
  });
}

export function useDeleteDish() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ restaurantId, dishId }: { restaurantId: number; dishId: number }) => 
      restaurantsApi.dishes.delete(restaurantId, dishId),
    onSuccess: (_, { restaurantId, dishId }) => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.dish(restaurantId, dishId) });
      queryClient.invalidateQueries({ queryKey: restaurantKeys.dishes(restaurantId) });
    },
  });
}

// Menu hooks
export function useRestaurantMenus(restaurantId: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: restaurantKeys.menus(restaurantId),
    queryFn: () => restaurantsApi.menus.getAll(restaurantId),
    enabled: options?.enabled !== false && !!restaurantId,
  });
}

export function useRestaurantMenu(restaurantId: number, menuId: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: restaurantKeys.menu(restaurantId, menuId),
    queryFn: () => restaurantsApi.menus.getById(restaurantId, menuId),
    enabled: options?.enabled !== false && !!restaurantId && !!menuId,
  });
}

export function useSearchMenus(restaurantId: number, query: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...restaurantKeys.menus(restaurantId), 'search', query],
    queryFn: () => restaurantsApi.menus.search(restaurantId, query),
    enabled: options?.enabled !== false && !!restaurantId && !!query,
  });
}

export function useCreateMenu() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ restaurantId, menuData }: { restaurantId: number; menuData: CreateMenuDto }) => 
      restaurantsApi.menus.create(restaurantId, menuData),
    onSuccess: (_, { restaurantId }) => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.menus(restaurantId) });
    },
  });
}

export function useUpdateMenu() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ restaurantId, menuId, menuData }: { 
      restaurantId: number; 
      menuId: number;
      menuData: UpdateMenuDto 
    }) => restaurantsApi.menus.update(restaurantId, menuId, menuData),
    onSuccess: (_, { restaurantId, menuId }) => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.menu(restaurantId, menuId) });
      queryClient.invalidateQueries({ queryKey: restaurantKeys.menus(restaurantId) });
    },
  });
}

export function useDeleteMenu() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ restaurantId, menuId }: { restaurantId: number; menuId: number }) => 
      restaurantsApi.menus.delete(restaurantId, menuId),
    onSuccess: (_, { restaurantId, menuId }) => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.menu(restaurantId, menuId) });
      queryClient.invalidateQueries({ queryKey: restaurantKeys.menus(restaurantId) });
    },
  });
}

export function useAddDishesToMenu() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ restaurantId, menuId, dishIds }: { 
      restaurantId: number; 
      menuId: number;
      dishIds: number[] 
    }) => restaurantsApi.menus.addDishes(restaurantId, menuId, dishIds),
    onSuccess: (_, { restaurantId, menuId }) => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.menu(restaurantId, menuId) });
    },
  });
}

export function useRemoveDishFromMenu() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ restaurantId, menuId, dishId }: { 
      restaurantId: number; 
      menuId: number;
      dishId: number 
    }) => restaurantsApi.menus.removeDish(restaurantId, menuId, dishId),
    onSuccess: (_, { restaurantId, menuId }) => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.menu(restaurantId, menuId) });
    },
  });
}
