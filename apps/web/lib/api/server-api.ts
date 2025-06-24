/**
 * Server-side API utilities for Next.js Server Components
 */

import { cookies } from 'next/headers';

// Service-specific API URLs from environment variables
const SERVICE_URLS = {
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3004',
  user: process.env.USER_SERVICE_URL || 'http://localhost:3003',
  restaurant: process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3002',
  order: process.env.ORDER_SERVICE_URL || 'http://localhost:3001',
  delivery: process.env.DELIVER_SERVICE_URL || 'http://localhost:3006',
  payment: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3007',
};

// Available services
type Service = 'auth' | 'user' | 'restaurant' | 'order' | 'delivery' | 'payment';

type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  cache?: RequestCache;
  headers?: Record<string, string>;
  next?: NextFetchRequestConfig;
};

/**
 * Server-side API request function for use in Server Components
 */
export async function serverApiRequest<T>(
  service: Service,
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  // Get the service-specific URL
  const serviceUrl = SERVICE_URLS[service];
  // Add /api prefix to the endpoint
  const url = `${serviceUrl}/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  // Set up headers
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && options.method !== 'GET' && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  // Skip auth token for now - we'll handle authentication differently
  // This avoids issues with the cookies() API which can be Promise-based in some Next.js versions

  const config: RequestInit & { next?: NextFetchRequestConfig } = {
    method: options.method || 'GET',
    headers,
    cache: options.cache || 'no-store', // Default to no-store for fresh data
    next: options.next, // Pass through revalidation options
  };

  // Add body if present
  if (options.body) {
    config.body = typeof options.body === 'string' 
      ? options.body 
      : JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      try {
        const errorData = await response.json().catch(() => ({ message: `API error: ${response.status}` }));
        throw new Error(errorData.message || `API error: ${response.status}`);
      } catch (parseError) {
        // If we can't parse the error as JSON, just throw a generic error
        throw new Error(`API error: ${response.status} - ${response.statusText}`);
      }
    }

    // Parse response based on content type
    const contentType = response.headers.get('Content-Type') || '';
    if (contentType.includes('application/json')) {
      return response.json();
    } else {
      const text = await response.text();
      return text as unknown as T;
    }
  } catch (error) {
    console.error(`Server API request failed: ${url}`, error);
    throw error;
  }
}
