import { registerAs } from '@nestjs/config';

export interface ApiConfig {
  port: number;
  host: string;
  protocol: string;
}

export default registerAs('api', (): ApiConfig => ({
  port: parseInt(process.env.API_PORT || '3000', 10),
  host: process.env.API_HOST || 'localhost',
  protocol: process.env.API_PROTOCOL || 'http',
}));
