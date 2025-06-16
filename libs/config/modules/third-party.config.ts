import { registerAs } from '@nestjs/config';

export interface ThirdPartyConfig {
  stripeApiKey: string;
  googleMapsApiKey: string;
}

export default registerAs('thirdParty', (): ThirdPartyConfig => ({
  stripeApiKey: process.env.STRIPE_API_KEY || '',
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
}));
