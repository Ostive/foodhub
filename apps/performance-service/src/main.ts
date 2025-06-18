import { NestFactory } from '@nestjs/core';
import { PerformanceServiceModule } from './performance-service.module';
import { loadEnvConfig, getConfig } from '../../../libs/config';

async function bootstrap() {
  // Charger la config selon NODE_ENV
  loadEnvConfig();

  // Récupérer la config
  const config = getConfig();

  const app = await NestFactory.create(PerformanceServiceModule);

  // Activer CORS
  app.enableCors();

  // Préfixe global (optionnel, adapte si besoin)
  app.setGlobalPrefix('api');

  const port = config.services?.performanceServicePort ?? 3005;
  await app.listen(port);

  console.log(`Performance service running on ${config.api.protocol}://${config.api.host}:${port}`);
}

bootstrap();
