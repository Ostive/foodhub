/**
 * Environment configuration utility for the Next.js frontend
 * 
 * This utility provides access to environment variables in a type-safe way.
 * Next.js automatically loads variables from .env.development or .env.production
 * based on the NODE_ENV, but only those prefixed with NEXT_PUBLIC_ are available
 * on the client side.
 */

export interface FrontendConfig {
  apiUrl: string;
  appName: string;
  googleMapsApiKey: string;
}

/**
 * Get the frontend configuration based on environment variables
 */
export function getFrontendConfig(): FrontendConfig {
  return {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    appName: process.env.NEXT_PUBLIC_APP_NAME || 'FoodHub',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  };
}

/**
 * Use this function to access environment variables in client components
 */
export function getClientConfig(): FrontendConfig {
  if (typeof window === 'undefined') {
    // Server-side
    return getFrontendConfig();
  }
  
  // Client-side - only NEXT_PUBLIC_ variables are available
  return {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    appName: process.env.NEXT_PUBLIC_APP_NAME || 'FoodHub',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  };
}
