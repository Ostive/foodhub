import { registerAs } from '@nestjs/config';

// PostgreSQL database configuration interface
export interface PostgresConfig {
  url: string;
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean;
}

// MongoDB database configuration interface
export interface MongoConfig {
  url: string;
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  authSource: string;
  useNewUrlParser: boolean;
  useUnifiedTopology: boolean;
}

// Combined database configuration interface
export interface DatabaseConfig {
  postgres: PostgresConfig;
  mongo: MongoConfig;
  default: string; // Which database to use as default ('postgres' or 'mongo')
}

export default registerAs('database', (): DatabaseConfig => ({
  postgres: {
    url: process.env.POSTGRES_URL || process.env.DATABASE_URL || 'postgres://localhost:5432/foodhub',
    type: 'postgres',
    host: process.env.POSTGRES_HOST || process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || process.env.DATABASE_PORT || '5432', 10),
    username: process.env.POSTGRES_USERNAME || process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.POSTGRES_PASSWORD || process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DATABASE || process.env.DATABASE_NAME || 'foodhub',
    synchronize: process.env.POSTGRES_SYNCHRONIZE === 'true' || process.env.DATABASE_SYNCHRONIZE === 'true',
    logging: process.env.POSTGRES_LOGGING === 'true' || process.env.DATABASE_LOGGING === 'true',
  },
  mongo: {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017/foodhub',
    type: 'mongodb',
    host: process.env.MONGO_HOST || 'localhost',
    port: parseInt(process.env.MONGO_PORT || '27017', 10),
    username: process.env.MONGO_USERNAME || '',
    password: process.env.MONGO_PASSWORD || '',
    database: process.env.MONGO_DATABASE || 'foodhub',
    authSource: process.env.MONGO_AUTH_SOURCE || 'admin',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  default: process.env.DEFAULT_DATABASE || 'postgres', // Default to postgres if not specified
}));
