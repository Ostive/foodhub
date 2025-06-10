import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
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

// Load environment variables based on NODE_ENV
export function loadEnvConfig() {
  const environment = process.env.NODE_ENV || 'development';
  const envPath = path.resolve(process.cwd(), `.env.${environment}`);
  
  // Check if environment-specific file exists
  if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    
    // Set each environment variable
    for (const key in envConfig) {
      if (Object.prototype.hasOwnProperty.call(envConfig, key)) {
        process.env[key] = envConfig[key];
      }
    }
    
    console.log(`Loaded environment configuration for: ${environment}`);
  } else {
    console.warn(`No .env.${environment} file found. Using default environment variables.`);
  }
}

// Configuration interface
export interface AppConfig {
  database: {
    url: string;
  };
  api: {
    port: number;
    host: string;
    protocol: string;
  };
  jwt: {
    secret: string;
    expiration: number;
  };
  services: {
    orderService: string;
    restaurantService: string;
    userService: string;
    orderServicePort: number;
    restaurantServicePort: number;
    userServicePort: number;
  };
  thirdParty: {
    stripeApiKey: string;
    googleMapsApiKey: string;
  };
  logging: {
    level: string;
  };
}

// Get configuration based on environment variables
export function getConfig(): AppConfig {
  return {
    database: {
      url: process.env.DATABASE_URL || 'postgres://localhost:5432/foodhub',
    },
    api: {
      port: parseInt(process.env.API_PORT || '3000', 10),
      host: process.env.API_HOST || 'localhost',
      protocol: process.env.API_PROTOCOL || 'http',
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'default_secret_do_not_use_in_production',
      expiration: parseInt(process.env.JWT_EXPIRATION || '3600', 10),
    },
    services: {
      orderService: process.env.ORDER_SERVICE_URL || 'http://localhost:3001',
      restaurantService: process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3002',
      userService: process.env.USER_SERVICE_URL || 'http://localhost:3003',
      orderServicePort: extractPortFromUrl(process.env.ORDER_SERVICE_URL || 'http://localhost:3001'),
      restaurantServicePort: extractPortFromUrl(process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3002'),
      userServicePort: extractPortFromUrl(process.env.USER_SERVICE_URL || 'http://localhost:3003'),
    },
    thirdParty: {
      stripeApiKey: process.env.STRIPE_API_KEY || '',
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
    },
    logging: {
      level: process.env.LOG_LEVEL || 'info',
    },
  };
}
