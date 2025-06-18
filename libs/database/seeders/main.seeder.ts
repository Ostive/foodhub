import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { User } from '../entities/user.entity';
import { UserSeeder } from './user.seeder';
import { DishSeeder } from './dish.seeder';
import { MenuSeeder } from './menu.seeder';
import { CreditCardSeeder } from './credit-card.seeder';
import { PlanningSeeder } from './planning.seeder';
import { CreditCard } from '../entities/credit_card.entity';
import { PromoAvailableUser } from '../entities/promo_available_user.entity';
import { Promo } from '../entities/promo.entity';
import { Allergen } from '../entities/allergen.entity';
import { Topping } from '../entities/topping.entity';
import { Dish } from '../entities/dish.entity';
import { Menu } from '../entities/menu.entity';
import { ToppingAllergen } from '../entities/topping_allergen.entity';
import { DishesTopping } from '../entities/dish_topping.entity';
import { DishAllergen } from '../entities/dish_allergen.entity';
import { Planning } from '../entities/planning.entity';
import { MenuDish } from '../entities/menu_dish.entity';
import { Order } from '../entities/order.entity';
import { OrderDish } from '../entities/order_dish.entity';
import { OrderMenu } from '../entities/order_menu.entity';
import { MenuTopping } from '../entities/menu_topping.entity';
import { Comment } from '../entities/comment.entity';
import { PersonalizationOption } from '../entities/personalization-option.entity';
import { PersonalizationOptionChoice } from '../entities/personalization-option-choice.entity';

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

async function resetDatabase(dataSource: DataSource) {
  console.log('🔥 Resetting database...');
  
  // Disable foreign key checks
  await dataSource.query('SET session_replication_role = "replica";');
  
  // Get all tables
  const tables = await dataSource.query(`
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public'
  `);
  
  // Truncate all tables
  for (const table of tables) {
    try {
      await dataSource.query(`TRUNCATE TABLE "${table.tablename}" CASCADE;`);
      console.log(`✅ Truncated table: ${table.tablename}`);
    } catch (error) {
      console.error(`❌ Error truncating table ${table.tablename}:`, error.message);
    }
  }
  
  // Re-enable foreign key checks
  await dataSource.query('SET session_replication_role = "origin";');
  console.log('✅ Database reset completed');
}

async function seed() {
  const resetFlag = process.argv.includes('--reset');
  
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
    password: process.env.POSTGRES_DB_PASSWORD || 'root',
    database: process.env.POSTGRES_DB_NAME || 'foodhub_db',
    entities: [
      User,
      CreditCard,
      PromoAvailableUser,
      Promo,
      Allergen,
      Topping,
      Dish,
      Menu,
      ToppingAllergen,
      DishesTopping,
      DishAllergen,
      Planning,
      MenuDish,
      Order,
      OrderDish,
      OrderMenu,
      MenuTopping,
      Comment,
      PersonalizationOption,
      PersonalizationOptionChoice
    ],
    synchronize: true,
    logging: true
  });

  try {
    await dataSource.initialize();
    console.log('✅ Database connection established');

    // Reset database if --reset flag is provided
    if (resetFlag) {
      await resetDatabase(dataSource);
    }
    
    console.log('🌱 Starting database seeding...');
    
    // Create an instance of UserSeeder and run it
    const userSeeder = new UserSeeder(dataSource);
    
    // Run the user seeder
    await userSeeder.run();

    // Run the dish seeder
    const dishSeeder = new DishSeeder(dataSource);
    await dishSeeder.run();

    // Run the menu seeder
    const menuSeeder = new MenuSeeder(dataSource);
    await menuSeeder.run();

    // Run the credit card seeder
    const creditCardSeeder = new CreditCardSeeder(dataSource);
    await creditCardSeeder.run();

    // Run the planning seeder
    const planningSeeder = new PlanningSeeder(dataSource);
    await planningSeeder.run();

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
