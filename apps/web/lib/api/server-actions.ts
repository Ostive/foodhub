/**
 * Server actions for data fetching in Next.js Server Components
 */

import { serverApiRequest } from './server-api';

// Available services
type Service = 'auth' | 'user' | 'restaurant' | 'order' | 'delivery' | 'payment';

/**
 * Fetch data from API using server component
 */
export async function fetchData<T>(
  service: Service,
  endpoint: string,
  options?: {
    cache?: RequestCache;
    next?: NextFetchRequestConfig;
    headers?: Record<string, string>;
  }
): Promise<T> {
  return serverApiRequest<T>(service, endpoint, {
    method: 'GET',
    cache: options?.cache,
    next: options?.next,
    headers: options?.headers,
  });
}

/**
 * Create data using server action
 */
export async function createData<T, D>(
  service: Service,
  endpoint: string,
  data: D,
  options?: {
    headers?: Record<string, string>;
  }
): Promise<T> {
  return serverApiRequest<T>(service, endpoint, {
    method: 'POST',
    body: data,
    headers: options?.headers,
  });
}

/**
 * Update data using server action
 */
export async function updateData<T, D>(
  service: Service,
  endpoint: string,
  data: D,
  options?: {
    headers?: Record<string, string>;
  }
): Promise<T> {
  return serverApiRequest<T>(service, endpoint, {
    method: 'PUT',
    body: data,
    headers: options?.headers,
  });
}

/**
 * Delete data using server action
 */
export async function deleteData<T>(
  service: Service,
  endpoint: string,
  options?: {
    body?: any;
    headers?: Record<string, string>;
  }
): Promise<T> {
  return serverApiRequest<T>(service, endpoint, {
    method: 'DELETE',
    body: options?.body,
    headers: options?.headers,
  });
}
