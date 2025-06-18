import { NestFactory } from '@nestjs/core';
import { RestaurantServiceModule } from './restaurant-service.module';
import { loadEnvConfig, getConfig } from '../../../libs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

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
  
  // Add validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  
  // Setup Swagger documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Restaurant Service API')
    .setDescription('The restaurant service API documentation')
    .setVersion('1.0')
    .addTag('restaurants')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);
  
  // Start the service on the port from config
  const httpPort = config.services.restaurantServicePort || 3002;
  await app.listen(httpPort);
  
  console.log(`Restaurant service running on ${config.api.protocol}://${config.api.host}:${httpPort}`);
  console.log(`Swagger documentation available at http://localhost:${httpPort}/api/docs`);
}
bootstrap();
