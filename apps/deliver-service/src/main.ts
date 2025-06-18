import { NestFactory } from '@nestjs/core';
import { loadEnvConfig, getConfig } from '../../../libs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { DeliversModule } from './deliver-service.module';


async function bootstrap() {
  // Load environment configuration based on NODE_ENV
  loadEnvConfig();
  
  // Get the configuration
  const config = getConfig();
  
  // Create the HTTP application
  const app = await NestFactory.create(DeliversModule);
  
  // Configure CORS
  app.enableCors();
  
  // Set global prefix
  app.setGlobalPrefix('api');
  
  // Add validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  
  // Setup Swagger documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('User Service API')
    .setDescription('The user service API documentation')
    .setVersion('1.0')
    .addTag('users')
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
  
  // Start the HTTP server
  const httpPort = config.services.deliverServicePort;
  await app.listen(httpPort);
  
  console.log(`User service HTTP running on ${config.api.protocol}://${config.api.host}:${httpPort}`);
  console.log(`Swagger documentation available at http://localhost:${httpPort}/api/docs`);
}
bootstrap();
