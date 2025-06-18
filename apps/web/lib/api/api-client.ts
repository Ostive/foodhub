/**
 * API client for making requests to backend services
 */

// Base API URL
const API_URL = '/api';

// Available services
type Service = 'auth' | 'user' | 'restaurant' | 'order' | 'delivery' | 'payment';

/**
 * Makes a request to the API
 * @param service The service to call (auth, user, etc.)
 * @param endpoint The endpoint to call
 * @param options The fetch options
 * @returns The response data
 */
export async function apiRequest<T>(
  service: Service, 
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}/${service}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  // Set default headers
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && options.method !== 'GET' && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  // Get auth token from localStorage if available
  const token = localStorage.getItem('auth_token');
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  // Convert body to JSON string if it's an object
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    
    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
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
    console.error(`API request failed: ${url}`, error);
    throw error;
  }
}
