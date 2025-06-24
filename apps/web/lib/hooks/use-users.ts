/**
 * Hook for user-related API operations
 */

import { useFetch, useCreate, useUpdate, useDelete } from '@/lib/api/query-hooks';
import { z } from 'zod';

// Define user types based on your schema
export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

// Input types for mutations
export type CreateUserInput = {
  email: string;
  password: string;
  name: string;
  role: string;
};

export type UpdateUserInput = {
  id: string;
  name?: string;
  email?: string;
  role?: string;
};

/**
 * Hook for fetching users
 */
export function useUsers(options?: {
  enabled?: boolean;
  staleTime?: number;
  onSuccess?: (data: User[]) => void;
  onError?: (error: Error) => void;
}) {
  return useFetch<User[]>(
    'user',
    'users',
    ['users'],
    {
      enabled: options?.enabled,
      staleTime: options?.staleTime || 5 * 60 * 1000, // 5 minutes
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    }
  );
}

/**
 * Hook for fetching a single user
 */
export function useUser(
  userId: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    onSuccess?: (data: User) => void;
    onError?: (error: Error) => void;
  }
) {
  return useFetch<User>(
    'user',
    `users/${userId}`,
    ['users', userId],
    {
      enabled: options?.enabled !== false && !!userId,
      staleTime: options?.staleTime || 5 * 60 * 1000, // 5 minutes
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    }
  );
}

/**
 * Hook for fetching users by role
 */
export function useUsersByRole(
  role: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    onSuccess?: (data: User[]) => void;
    onError?: (error: Error) => void;
  }
) {
  return useFetch<User[]>(
    'user',
    `users/role/${role}`,
    ['users', 'role', role],
    {
      enabled: options?.enabled !== false && !!role,
      staleTime: options?.staleTime || 5 * 60 * 1000, // 5 minutes
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    }
  );
}

/**
 * Hook for creating a user
 */
export function useCreateUser(options?: {
  onSuccess?: (data: User, variables: CreateUserInput) => void;
  onError?: (error: Error, variables: CreateUserInput) => void;
}) {
  return useCreate<User, CreateUserInput>(
    'user',
    'users',
    {
      invalidateQueries: [['users']],
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    }
  );
}

/**
 * Hook for updating a user
 */
export function useUpdateUser(options?: {
  onSuccess?: (data: User, variables: UpdateUserInput) => void;
  onError?: (error: Error, variables: UpdateUserInput) => void;
}) {
  return useUpdate<User, UpdateUserInput>(
    'user',
    'users',
    {
      invalidateQueries: [['users']],
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    }
  );
}

/**
 * Hook for deleting a user
 */
export function useDeleteUser(options?: {
  onSuccess?: (data: any, variables: string) => void;
  onError?: (error: Error, variables: string) => void;
}) {
  return useDelete<any, string>(
    'user',
    'users',
    {
      invalidateQueries: [['users']],
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    }
  );
}
