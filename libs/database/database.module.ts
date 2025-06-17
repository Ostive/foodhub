import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configModule } from '../config';
import { User } from './entities/user.entity';
import { CreditCard } from './entities/credit_card.entity';
import { PromoAvailableUser } from './entities/promo_available_user.entity';
import { Promo } from './entities/promo.entity';
import { Restaurant } from './entities/restaurant.entity';
import { Allergen } from './entities/allergen.entity';
import { Topping } from './entities/topping.entity';
import { Dish } from './entities/dishes.entity';
import { Menu } from './entities/menu.entity';
import { ToppingAllergen } from './entities/topping_allergen.entity';
import { DishesTopping } from './entities/dishes_topping.entity';
import { DishAllergen } from './entities/dishes_allergen.entity';

@Module({
  imports: [
    configModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Log environment variables to debug
        console.log({ db_name: configService.get('POSTGRES_DB_NAME') });
        
        // Get database config from environment variables via ConfigService
        return {
          type: 'postgres',
          host: configService.get('POSTGRES_DB_HOST') || 'localhost',
          port: parseInt(configService.get('POSTGRES_DB_PORT') || '5432', 10),
          username: configService.get('POSTGRES_DB_USER') || 'postgres',
          password: configService.get('POSTGRES_DB_PASSWORD') || 'postgres',
          database: configService.get('POSTGRES_DB_NAME') || 'default_db',
          entities: [User,CreditCard,PromoAvailableUser,Promo,Restaurant,Allergen,Topping,Dish,Menu,ToppingAllergen,DishesTopping,DishAllergen],
          synchronize: configService.get('POSTGRES_DB_SYNCHRONIZE') === 'true',
          autoLoadEntities: true,
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
