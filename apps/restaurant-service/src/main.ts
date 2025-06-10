import { NestFactory } from '@nestjs/core';
import { RestaurantServiceModule } from './restaurant-service.module';
import { loadEnvConfig, getConfig } from '../../../libs/config';

async function bootstrap() {
  // Load environment configuration based on NODE_ENV
  loadEnvConfig();
  
  // Get the configuration
  const config = getConfig();
  
  const app = await NestFactory.create(RestaurantServiceModule);
  
  // Configure CORS
  app.enableCors();
  
  // Set global prefix
  app.setGlobalPrefix('api');
  
  // Start the service on the port from config
  await app.listen(config.services.restaurantServicePort);
  
  console.log(`Restaurant service running on ${config.api.protocol}://${config.api.host}:${config.services.restaurantServicePort}`);
}
bootstrap();
