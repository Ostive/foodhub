import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth-service.module';
import { loadEnvConfig, getConfig } from 'libs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

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
  
  // Add validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  
  // Setup Swagger documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Auth Service API')
    .setDescription('The authentication service API documentation')
    .setVersion('1.0')
    .addTag('auth')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);
  
  // Start the HTTP server
  const httpPort = config.services.authServicePort || 3004;
  await app.listen(httpPort);
  
  console.log(`Auth service HTTP running on port ${httpPort}`);
  console.log(`Swagger documentation available at http://localhost:${httpPort}/api/docs`);
}

bootstrap();
