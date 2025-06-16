import { registerAs } from '@nestjs/config';

export interface JwtConfig {
  secret: string;
  expiration: number;
}

export default registerAs('jwt', (): JwtConfig => ({
  secret: process.env.JWT_SECRET || 'default_secret_do_not_use_in_production',
  expiration: parseInt(process.env.JWT_EXPIRATION || '3600', 10),
}));
