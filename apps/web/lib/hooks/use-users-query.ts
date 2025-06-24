/**
 * React Query hooks for user-related API operations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  usersApi, 
  customersApi, 
  restaurantsUserApi, 
  deliveryPersonsApi,
  developersApi,
  managersApi,
  adminsApi,
  CreateUserDto,
  UpdateUserDto
} from '../api/users-api';
import { User, UserRole } from './use-users';

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
  role: (role: UserRole) => [...userKeys.all, 'role', role] as const,
};

// Generic user hooks
export function useUsers(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: () => usersApi.getAll(),
    enabled: options?.enabled,
  });
}

export function useUser(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => usersApi.getById(id),
    enabled: options?.enabled !== false && !!id,
  });
}

export function useUserByEmail(email: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...userKeys.all, 'email', email],
    queryFn: () => usersApi.getByEmail(email),
    enabled: options?.enabled !== false && !!email,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: CreateUserDto) => usersApi.create(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, userData }: { id: number; userData: UpdateUserDto }) => 
      usersApi.update(id, userData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(data.userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.role(data.role) });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => usersApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

export function useDeactivateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => usersApi.deactivate(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(data.userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.role(data.role) });
    },
  });
}

export function useReactivateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => usersApi.reactivate(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(data.userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.role(data.role) });
    },
  });
}

// Customer-specific hooks
export function useCustomers(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: userKeys.role('customer'),
    queryFn: () => customersApi.getAll(),
    enabled: options?.enabled,
  });
}

export function useCustomer(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...userKeys.role('customer'), id],
    queryFn: () => customersApi.getById(id),
    enabled: options?.enabled !== false && !!id,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: Omit<CreateUserDto, 'role'>) => customersApi.create(userData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.role('customer') });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, userData }: { id: number; userData: UpdateUserDto }) => 
      customersApi.update(id, userData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...userKeys.role('customer'), data.userId] });
      queryClient.invalidateQueries({ queryKey: userKeys.role('customer') });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => customersApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [...userKeys.role('customer'), id] });
      queryClient.invalidateQueries({ queryKey: userKeys.role('customer') });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

// Restaurant-specific hooks
export function useRestaurantUsers(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: userKeys.role('restaurant'),
    queryFn: () => restaurantsUserApi.getAll(),
    enabled: options?.enabled,
  });
}

export function useRestaurantUser(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...userKeys.role('restaurant'), id],
    queryFn: () => restaurantsUserApi.getById(id),
    enabled: options?.enabled !== false && !!id,
  });
}

export function useCreateRestaurantUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: Omit<CreateUserDto, 'role'> & {
      website?: string;
      tags?: string[];
      minimumPurchase?: number;
      deliveryRadius?: number;
      averagePreparationTime?: string;
    }) => restaurantsUserApi.create(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.role('restaurant') });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

export function useUpdateRestaurantUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, userData }: { 
      id: number; 
      userData: UpdateUserDto & {
        website?: string;
        tags?: string[];
        minimumPurchase?: number;
        deliveryRadius?: number;
        averagePreparationTime?: string;
      }
    }) => restaurantsUserApi.update(id, userData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...userKeys.role('restaurant'), data.userId] });
      queryClient.invalidateQueries({ queryKey: userKeys.role('restaurant') });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

// Delivery person-specific hooks
export function useDeliveryPersons(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: userKeys.role('delivery_person'),
    queryFn: () => deliveryPersonsApi.getAll(),
    enabled: options?.enabled,
  });
}

export function useDeliveryPerson(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...userKeys.role('delivery_person'), id],
    queryFn: () => deliveryPersonsApi.getById(id),
    enabled: options?.enabled !== false && !!id,
  });
}

export function useCreateDeliveryPerson() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: Omit<CreateUserDto, 'role'> & {
      transport?: string;
    }) => deliveryPersonsApi.create(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.role('delivery_person') });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

export function useUpdateDeliveryPerson() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, userData }: { 
      id: number; 
      userData: UpdateUserDto & {
        transport?: string;
      }
    }) => deliveryPersonsApi.update(id, userData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...userKeys.role('delivery_person'), data.userId] });
      queryClient.invalidateQueries({ queryKey: userKeys.role('delivery_person') });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

// Developer-specific hooks
export function useDevelopers(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: userKeys.role('developer'),
    queryFn: () => developersApi.getAll(),
    enabled: options?.enabled,
  });
}

// Manager-specific hooks
export function useManagers(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: userKeys.role('manager'),
    queryFn: () => managersApi.getAll(),
    enabled: options?.enabled,
  });
}

// Admin-specific hooks
export function useAdmins(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: userKeys.role('admin'),
    queryFn: () => adminsApi.getAll(),
    enabled: options?.enabled,
  });
}
