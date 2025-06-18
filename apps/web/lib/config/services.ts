/**
 * Backend Services Configuration
 * 
 * This file defines the URLs for all backend microservices used by the application.
 * Each service URL can be configured via environment variables or falls back to default localhost URLs.
 */

export const SERVICES = {
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3004',
  user: process.env.USER_SERVICE_URL || 'http://localhost:3003',
  restaurant: process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3002',
  order: process.env.ORDER_SERVICE_URL || 'http://localhost:3003',
  delivery: process.env.DELIVERY_SERVICE_URL || 'http://localhost:3005',
  payment: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3006',
};

/**
 * Get the URL for a specific service
 * @param serviceName The name of the service
 * @returns The URL for the specified service
 */
export function getServiceUrl(serviceName: keyof typeof SERVICES): string {
  return SERVICES[serviceName];
}
