import { registerAs } from '@nestjs/config';
import { URL } from 'url';

// Helper function to extract port from URL
function extractPortFromUrl(urlString: string): number {
  try {
    const url = new URL(urlString);
    return url.port ? parseInt(url.port, 10) : url.protocol === 'https:' ? 443 : 80;
  } catch (error) {
    console.warn(`Invalid URL: ${urlString}. Using default port 3000.`);
    return 3000;
  }
}

export interface ServicesConfig {
  orderService: string;
  restaurantService: string;
  userService: string;
  authService: string;
  orderServicePort: number;
  restaurantServicePort: number;
  userServicePort: number;
  authServicePort: number;
  userMicroservicePort: number;
  authMicroservicePort: number;
}

export default registerAs('services', (): ServicesConfig => ({
  orderService: process.env.ORDER_SERVICE_URL || 'http://localhost:3001',
  restaurantService: process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3002',
  userService: process.env.USER_SERVICE_URL || 'http://localhost:3003',
  authService: process.env.AUTH_SERVICE_URL || 'http://localhost:3004',
  orderServicePort: extractPortFromUrl(process.env.ORDER_SERVICE_URL || 'http://localhost:3001'),
  restaurantServicePort: extractPortFromUrl(process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3002'),
  userServicePort: extractPortFromUrl(process.env.USER_SERVICE_URL || 'http://localhost:3003'),
  authServicePort: extractPortFromUrl(process.env.AUTH_SERVICE_URL || 'http://localhost:3004'),
  userMicroservicePort: parseInt(process.env.USER_MICROSERVICE_PORT || '3010'),
  authMicroservicePort: parseInt(process.env.AUTH_MICROSERVICE_PORT || '3012'),
}));
