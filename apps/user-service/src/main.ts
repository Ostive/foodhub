import { NestFactory } from '@nestjs/core';
import { UserServiceModule } from './user-service.module';
import { loadEnvConfig, getConfig } from 'libs/config';

async function bootstrap() {
  // Load environment configuration based on NODE_ENV
  loadEnvConfig();
  
  // Get the configuration
  const config = getConfig();
  
  const app = await NestFactory.create(UserServiceModule);
  
  // Configure CORS
  app.enableCors();
  
  // Set global prefix
  app.setGlobalPrefix('api');
  
  // Start the service on the port from config
  await app.listen(config.services.userServicePort);
  
  console.log(`User service running on ${config.api.protocol}://${config.api.host}:${config.services.userServicePort}`);
}
bootstrap();
