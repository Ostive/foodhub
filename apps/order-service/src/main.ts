import { NestFactory } from '@nestjs/core';
import { OrderServiceModule } from './order-service.module';
import { loadEnvConfig, getConfig } from '../../../libs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

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
  
  // Add validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  
  // Setup Swagger documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Order Service API')
    .setDescription('The order service API documentation')
    .setVersion('1.0')
    .addTag('orders')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      defaultModelsExpandDepth: 1,
      defaultModelExpandDepth: 1,
    },
  });
  
  // Start the service on the port from config
  const httpPort = config.services.orderServicePort;
  await app.listen(httpPort);
  
  console.log(`Order service running on ${config.api.protocol}://${config.api.host}:${httpPort}`);
  console.log(`Swagger documentation available at http://localhost:${httpPort}/api/docs`);
}
bootstrap();
