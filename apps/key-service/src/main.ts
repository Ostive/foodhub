import { NestFactory } from '@nestjs/core';
import { KeyServiceModule } from './key-service.module';
import { loadEnvConfig, getConfig } from '../../../libs/config';

async function bootstrap() {
  // Charger la config selon NODE_ENV
  loadEnvConfig();

  // Récupérer la config
  const config = getConfig();

  const app = await NestFactory.create(KeyServiceModule);

  // Activer CORS
  app.enableCors();

  // Préfixe global (optionnel, adapte si besoin)
  app.setGlobalPrefix('api');

  const port = config.services?.keyServicePort ?? 3007; // choisis un port par défaut
  await app.listen(port);

  console.log(`Key service running on ${config.api.protocol}://${config.api.host}:${port}`);
}

bootstrap();
