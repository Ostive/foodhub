// Main configuration index file
import { ConfigModule } from '@nestjs/config';

// Import all configuration modules
import { loadEnvConfig } from './modules/env.config';
import databaseConfig, { DatabaseConfig, PostgresConfig, MongoConfig } from './modules/database.config';
import apiConfig, { ApiConfig } from './modules/api.config';
import jwtConfig, { JwtConfig } from './modules/jwt.config';
import servicesConfig, { ServicesConfig } from './modules/services.config';
import thirdPartyConfig, { ThirdPartyConfig } from './modules/third-party.config';
import loggingConfig, { LoggingConfig } from './modules/logging.config';

// Re-export all configuration modules
export { loadEnvConfig } from './modules/env.config';
export { DatabaseConfig, PostgresConfig, MongoConfig } from './modules/database.config';
export { ApiConfig } from './modules/api.config';
export { JwtConfig } from './modules/jwt.config';
export { ServicesConfig } from './modules/services.config';
export { ThirdPartyConfig } from './modules/third-party.config';
export { LoggingConfig } from './modules/logging.config';

// Unified AppConfig interface
export interface AppConfig {
  database: DatabaseConfig;
  api: ApiConfig;
  jwt: JwtConfig;
  services: ServicesConfig;
  thirdParty: ThirdPartyConfig;
  logging: LoggingConfig;
}

// Get configuration based on environment variables
export function getConfig(): AppConfig {
  return {
    database: databaseConfig(),
    api: apiConfig(),
    jwt: jwtConfig(),
    services: servicesConfig(),
    thirdParty: thirdPartyConfig(),
    logging: loggingConfig(),
  };
}

// Configuration module for NestJS
export const configModule = ConfigModule.forRoot({
  isGlobal: true,
  load: [
    databaseConfig,
    apiConfig,
    jwtConfig,
    servicesConfig,
    thirdPartyConfig,
    loggingConfig,
  ],
});
