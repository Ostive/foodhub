import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables based on NODE_ENV
export function loadEnvConfig() {
  const environment = process.env.NODE_ENV || 'development';
  const envPath = path.resolve(process.cwd(), `.env.${environment}`);
  
  // Check if environment-specific file exists
  if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    
    // Set each environment variable
    for (const key in envConfig) {
      if (Object.prototype.hasOwnProperty.call(envConfig, key)) {
        process.env[key] = envConfig[key];
      }
    }
    
    console.log(`Loaded environment configuration for: ${environment}`);
  } else {
    console.warn(`No .env.${environment} file found. Using default environment variables.`);
  }
}
