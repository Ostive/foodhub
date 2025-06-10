import { NestFactory } from '@nestjs/core';
import { OrderServiceModule } from './order-service.module';
import { loadEnvConfig, getConfig } from '../../../libs/config';

async function bootstrap() {
  // Load environment configuration based on NODE_ENV
  loadEnvConfig();
  
  // Get the configuration
  const config = getConfig();
  
  const app = await NestFactory.create(OrderServiceModule);
  
  // Configure CORS
  app.enableCors();
  
  // Set global prefix
  app.setGlobalPrefix('api');
  
  // Start the service on the configured port
  await app.listen(config.api.port);
  
  console.log(`Order service running on ${config.api.protocol}://${config.api.host}:${config.api.port}`);
}
bootstrap();
