/**
 * Users API client for interacting with the user service
 */

import { apiRequest } from './api-client';
import { User, UserRole } from '../hooks/use-users';

// Base service and endpoint
const SERVICE = 'user';

// Types for API requests and responses
export type CreateUserDto = {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  birthDate?: string;
  address?: string;
  role: UserRole;
  // Role-specific fields
  transport?: string;           // delivery_person
  website?: string;             // restaurant
  tags?: string[];              // restaurant
  minimumPurchase?: number;     // restaurant
  deliveryRadius?: number;      // restaurant
  averagePreparationTime?: string; // restaurant
};

export type UpdateUserDto = Partial<Omit<CreateUserDto, 'password' | 'role'>> & {
  password?: string;
};

// Generic user API functions
export const usersApi = {
  // Get all users
  getAll: () => apiRequest<User[]>(SERVICE, 'users'),
  
  // Get user by ID
  getById: (id: number) => apiRequest<User>(SERVICE, `users/${id}`),
  
  // Get user by email
  getByEmail: (email: string) => apiRequest<User>(SERVICE, `users/email/${email}`),
  
  // Create a new user
  create: (userData: CreateUserDto) => apiRequest<User>(SERVICE, 'users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  // Update a user
  update: (id: number, userData: UpdateUserDto) => apiRequest<User>(SERVICE, `users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(userData),
  }),
  
  // Delete a user
  delete: (id: number) => apiRequest<void>(SERVICE, `users/${id}`, {
    method: 'DELETE',
  }),
  
  // Deactivate a user
  deactivate: (id: number) => apiRequest<User>(SERVICE, `users/${id}/deactivate`, {
    method: 'PATCH',
  }),
  
  // Reactivate a user
  reactivate: (id: number) => apiRequest<User>(SERVICE, `users/${id}/reactivate`, {
    method: 'PATCH',
  }),
};

// Customer-specific API functions
export const customersApi = {
  // Get all customers
  getAll: () => apiRequest<User[]>(SERVICE, 'users/customers'),
  
  // Get customer by ID
  getById: (id: number) => apiRequest<User>(SERVICE, `users/customers/${id}`),
  
  // Create a new customer
  create: (userData: Omit<CreateUserDto, 'role'>) => apiRequest<User>(SERVICE, 'users/customers', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  // Update a customer
  update: (id: number, userData: UpdateUserDto) => apiRequest<User>(SERVICE, `users/customers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(userData),
  }),
  
  // Delete a customer
  delete: (id: number) => apiRequest<void>(SERVICE, `users/customers/${id}`, {
    method: 'DELETE',
  }),
  
  // Deactivate a customer
  deactivate: (id: number) => apiRequest<User>(SERVICE, `users/customers/${id}/deactivate`, {
    method: 'PATCH',
  }),
  
  // Reactivate a customer
  reactivate: (id: number) => apiRequest<User>(SERVICE, `users/customers/${id}/reactivate`, {
    method: 'PATCH',
  }),
};

// Restaurant-specific API functions
export const restaurantsUserApi = {
  // Get all restaurants
  getAll: () => apiRequest<User[]>(SERVICE, 'users/restaurants'),
  
  // Get restaurant by ID
  getById: (id: number) => apiRequest<User>(SERVICE, `users/restaurants/${id}`),
  
  // Create a new restaurant
  create: (userData: Omit<CreateUserDto, 'role'> & {
    website?: string;
    tags?: string[];
    minimumPurchase?: number;
    deliveryRadius?: number;
    averagePreparationTime?: string;
  }) => apiRequest<User>(SERVICE, 'users/restaurants', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  // Update a restaurant
  update: (id: number, userData: UpdateUserDto & {
    website?: string;
    tags?: string[];
    minimumPurchase?: number;
    deliveryRadius?: number;
    averagePreparationTime?: string;
  }) => apiRequest<User>(SERVICE, `users/restaurants/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(userData),
  }),
  
  // Delete a restaurant
  delete: (id: number) => apiRequest<void>(SERVICE, `users/restaurants/${id}`, {
    method: 'DELETE',
  }),
  
  // Deactivate a restaurant
  deactivate: (id: number) => apiRequest<User>(SERVICE, `users/restaurants/${id}/deactivate`, {
    method: 'PATCH',
  }),
  
  // Reactivate a restaurant
  reactivate: (id: number) => apiRequest<User>(SERVICE, `users/restaurants/${id}/reactivate`, {
    method: 'PATCH',
  }),
};

// Delivery person-specific API functions
export const deliveryPersonsApi = {
  // Get all delivery persons
  getAll: () => apiRequest<User[]>(SERVICE, 'users/delivery-persons'),
  
  // Get delivery person by ID
  getById: (id: number) => apiRequest<User>(SERVICE, `users/delivery-persons/${id}`),
  
  // Create a new delivery person
  create: (userData: Omit<CreateUserDto, 'role'> & {
    transport?: string;
  }) => apiRequest<User>(SERVICE, 'users/delivery-persons', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  // Update a delivery person
  update: (id: number, userData: UpdateUserDto & {
    transport?: string;
  }) => apiRequest<User>(SERVICE, `users/delivery-persons/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(userData),
  }),
  
  // Delete a delivery person
  delete: (id: number) => apiRequest<void>(SERVICE, `users/delivery-persons/${id}`, {
    method: 'DELETE',
  }),
  
  // Deactivate a delivery person
  deactivate: (id: number) => apiRequest<User>(SERVICE, `users/delivery-persons/${id}/deactivate`, {
    method: 'PATCH',
  }),
  
  // Reactivate a delivery person
  reactivate: (id: number) => apiRequest<User>(SERVICE, `users/delivery-persons/${id}/reactivate`, {
    method: 'PATCH',
  }),
};

// Developer-specific API functions
export const developersApi = {
  // Get all developers
  getAll: () => apiRequest<User[]>(SERVICE, 'users/developers'),
  
  // Get developer by ID
  getById: (id: number) => apiRequest<User>(SERVICE, `users/developers/${id}`),
  
  // Create a new developer
  create: (userData: Omit<CreateUserDto, 'role'>) => apiRequest<User>(SERVICE, 'users/developers', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  // Update a developer
  update: (id: number, userData: UpdateUserDto) => apiRequest<User>(SERVICE, `users/developers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(userData),
  }),
  
  // Delete a developer
  delete: (id: number) => apiRequest<void>(SERVICE, `users/developers/${id}`, {
    method: 'DELETE',
  }),
  
  // Deactivate a developer
  deactivate: (id: number) => apiRequest<User>(SERVICE, `users/developers/${id}/deactivate`, {
    method: 'PATCH',
  }),
  
  // Reactivate a developer
  reactivate: (id: number) => apiRequest<User>(SERVICE, `users/developers/${id}/reactivate`, {
    method: 'PATCH',
  }),
};

// Manager-specific API functions
export const managersApi = {
  // Get all managers
  getAll: () => apiRequest<User[]>(SERVICE, 'users/managers'),
  
  // Get manager by ID
  getById: (id: number) => apiRequest<User>(SERVICE, `users/managers/${id}`),
  
  // Create a new manager
  create: (userData: Omit<CreateUserDto, 'role'>) => apiRequest<User>(SERVICE, 'users/managers', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  // Update a manager
  update: (id: number, userData: UpdateUserDto) => apiRequest<User>(SERVICE, `users/managers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(userData),
  }),
  
  // Delete a manager
  delete: (id: number) => apiRequest<void>(SERVICE, `users/managers/${id}`, {
    method: 'DELETE',
  }),
  
  // Deactivate a manager
  deactivate: (id: number) => apiRequest<User>(SERVICE, `users/managers/${id}/deactivate`, {
    method: 'PATCH',
  }),
  
  // Reactivate a manager
  reactivate: (id: number) => apiRequest<User>(SERVICE, `users/managers/${id}/reactivate`, {
    method: 'PATCH',
  }),
};

// Admin-specific API functions
export const adminsApi = {
  // Get all admins
  getAll: () => apiRequest<User[]>(SERVICE, 'users/admins'),
  
  // Get admin by ID
  getById: (id: number) => apiRequest<User>(SERVICE, `users/admins/${id}`),
  
  // Create a new admin
  create: (userData: Omit<CreateUserDto, 'role'>) => apiRequest<User>(SERVICE, 'users/admins', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  // Update an admin
  update: (id: number, userData: UpdateUserDto) => apiRequest<User>(SERVICE, `users/admins/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(userData),
  }),
  
  // Delete an admin
  delete: (id: number) => apiRequest<void>(SERVICE, `users/admins/${id}`, {
    method: 'DELETE',
  }),
  
  // Deactivate an admin
  deactivate: (id: number) => apiRequest<User>(SERVICE, `users/admins/${id}/deactivate`, {
    method: 'PATCH',
  }),
  
  // Reactivate an admin
  reactivate: (id: number) => apiRequest<User>(SERVICE, `users/admins/${id}/reactivate`, {
    method: 'PATCH',
  }),
};
