import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
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
  
  // Create the microservice
  const microservicePort = config.services.authMicroservicePort || 3012;
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: microservicePort,
    },
  });

  // Start both the HTTP server and microservice
  await app.startAllMicroservices();
  
  // Start the HTTP server
  const httpPort = config.services.authServicePort || 3004;
  await app.listen(httpPort);
  
  console.log(`Auth service HTTP running on port ${httpPort}`);
  console.log(`Auth service Microservice running on port ${microservicePort}`);
}

bootstrap();
