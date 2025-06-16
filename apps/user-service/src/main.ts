import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users-service.module';
import { loadEnvConfig, getConfig } from 'libs/config';

async function bootstrap() {
  // Load environment configuration based on NODE_ENV
  loadEnvConfig();
  
  // Get the configuration
  const config = getConfig();
  
  // Create the HTTP application
  const app = await NestFactory.create(UsersModule);
  
  // Configure CORS
  app.enableCors();
  
  // Set global prefix
  app.setGlobalPrefix('api');
  
  // Start the HTTP server
  await app.listen(config.services.userServicePort);
  
  console.log(`User service HTTP running on ${config.api.protocol}://${config.api.host}:${config.services.userServicePort}`);
}
bootstrap();
