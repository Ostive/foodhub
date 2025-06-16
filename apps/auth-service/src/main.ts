import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth-service.module';
import { loadEnvConfig, getConfig } from 'libs/config';

async function bootstrap() {
  // Load environment configuration
  loadEnvConfig();
  
  // Get the configuration
  const config = getConfig();
  
  // Create the HTTP application
  const app = await NestFactory.create(AuthModule);
  
  // Configure CORS
  app.enableCors();
  
  // Set global prefix
  app.setGlobalPrefix('api');
  
  // Start the HTTP server
  const httpPort = config.services.authServicePort || 3004;
  await app.listen(httpPort);
  
  console.log(`Auth service HTTP running on port ${httpPort}`);
}

bootstrap();
