import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { User } from '../entities/user.entity';
import { UserSeeder } from './user.seeder';

// Load environment variables
const environment = process.env.NODE_ENV || 'development';
const envPath = path.resolve(process.cwd(), `.env.${environment}`);

if (fs.existsSync(envPath)) {
  console.log(`Loading environment from ${envPath}`);
  dotenv.config({ path: envPath });
} else {
  console.warn(`No .env.${environment} file found. Using default environment variables.`);
  dotenv.config();
}

async function seed() {
  console.log('🔄 Initializing database connection...');
  
  // Log environment variables for debugging
  console.log('Environment variables:', {
    host: process.env.POSTGRES_DB_HOST,
    port: process.env.POSTGRES_DB_PORT,
    username: process.env.POSTGRES_DB_USER,
    database: process.env.POSTGRES_DB_NAME,
  });
  
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_DB_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_DB_PORT || '5432'),
    username: process.env.POSTGRES_DB_USER || 'postgres',
    password: process.env.POSTGRES_DB_PASSWORD || 'root', // Ensure password is a string
    database: process.env.POSTGRES_DB_NAME || 'workshop_db',
    entities: [User],
    synchronize: true,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Database connection established');

    console.log('🌱 Starting database seeding...');
    
    // Create an instance of UserSeeder and run it
    const userSeeder = new UserSeeder(dataSource);
    
    // You can customize how many users to create by passing a number
    // Default is 10 as defined in the UserSeeder class
    const userCount = process.argv[2] ? parseInt(process.argv[2]) : 10;
    await userSeeder.run(userCount);

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('🔄 Database connection closed');
    }
  }
}

seed();
