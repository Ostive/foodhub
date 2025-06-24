/**
 * React Query hooks for API operations
 */

import { useQuery, useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import { apiRequest } from './api-client';

// Available services
type Service = 'auth' | 'user' | 'restaurant' | 'order' | 'delivery' | 'payment';

/**
 * Hook for fetching data from the API
 */
export function useFetch<TData = unknown, TError = Error>(
  service: Service,
  endpoint: string,
  queryKey: QueryKey,
  options: {
    enabled?: boolean;
    staleTime?: number;
    refetchInterval?: number | false;
    refetchOnWindowFocus?: boolean;
    onSuccess?: (data: TData) => void;
    onError?: (error: TError) => void;
    select?: (data: any) => TData;
    fetchOptions?: RequestInit;
  } = {}
) {
  return useQuery<TData, TError>({
    queryKey,
    queryFn: async () => apiRequest<TData>(service, endpoint, options.fetchOptions),
    enabled: options.enabled,
    staleTime: options.staleTime,
    refetchInterval: options.refetchInterval,
    refetchOnWindowFocus: options.refetchOnWindowFocus,
    select: options.select,
    onSuccess: options.onSuccess,
    onError: options.onError,
  });
}

/**
 * Hook for creating data via API
 */
export function useCreate<TData = unknown, TInput = unknown, TError = Error>(
  service: Service,
  endpoint: string,
  options: {
    onSuccess?: (data: TData, variables: TInput) => void;
    onError?: (error: TError, variables: TInput) => void;
    invalidateQueries?: QueryKey[];
    fetchOptions?: Omit<RequestInit, 'body' | 'method'>;
  } = {}
) {
  const queryClient = useQueryClient();
  
  return useMutation<TData, TError, TInput>({
    mutationFn: async (data: TInput) => {
      return apiRequest<TData>(service, endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
        ...options.fetchOptions,
      });
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      if (options.invalidateQueries) {
        options.invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      
      if (options.onSuccess) {
        options.onSuccess(data, variables);
      }
    },
    onError: options.onError,
  });
}

/**
 * Hook for updating data via API
 */
export function useUpdate<TData = unknown, TInput = unknown, TError = Error>(
  service: Service,
  endpoint: string,
  options: {
    onSuccess?: (data: TData, variables: TInput) => void;
    onError?: (error: TError, variables: TInput) => void;
    invalidateQueries?: QueryKey[];
    fetchOptions?: Omit<RequestInit, 'body' | 'method'>;
  } = {}
) {
  const queryClient = useQueryClient();
  
  return useMutation<TData, TError, TInput>({
    mutationFn: async (data: TInput) => {
      return apiRequest<TData>(service, endpoint, {
        method: 'PUT',
        body: JSON.stringify(data),
        ...options.fetchOptions,
      });
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      if (options.invalidateQueries) {
        options.invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      
      if (options.onSuccess) {
        options.onSuccess(data, variables);
      }
    },
    onError: options.onError,
  });
}

/**
 * Hook for deleting data via API
 */
export function useDelete<TData = unknown, TInput = unknown, TError = Error>(
  service: Service,
  endpoint: string,
  options: {
    onSuccess?: (data: TData, variables: TInput) => void;
    onError?: (error: TError, variables: TInput) => void;
    invalidateQueries?: QueryKey[];
    fetchOptions?: Omit<RequestInit, 'method'>;
  } = {}
) {
  const queryClient = useQueryClient();
  
  return useMutation<TData, TError, TInput>({
    mutationFn: async (data: TInput) => {
      const config: RequestInit = {
        method: 'DELETE',
        ...options.fetchOptions,
      };
      
      // For DELETE requests with a body
      if (data) {
        config.body = JSON.stringify(data);
      }
      
      return apiRequest<TData>(service, endpoint, config);
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      if (options.invalidateQueries) {
        options.invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      
      if (options.onSuccess) {
        options.onSuccess(data, variables);
      }
    },
    onError: options.onError,
  });
}

/**
 * Hook for infinite query (pagination)
 */
export function useInfiniteQuery<TData = unknown, TError = Error>(
  service: Service,
  endpoint: string,
  queryKey: QueryKey,
  getNextPageParam: (lastPage: any) => any,
  options: {
    enabled?: boolean;
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
    onSuccess?: (data: TData) => void;
    onError?: (error: TError) => void;
    fetchOptions?: RequestInit;
  } = {}
) {
  return useQuery<TData, TError>({
    queryKey,
    queryFn: async () => apiRequest<TData>(service, endpoint, options.fetchOptions),
    enabled: options.enabled,
    staleTime: options.staleTime,
    refetchOnWindowFocus: options.refetchOnWindowFocus,
    onSuccess: options.onSuccess,
    onError: options.onError,
  });
}
