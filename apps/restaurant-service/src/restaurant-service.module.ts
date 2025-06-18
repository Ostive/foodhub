import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantServiceController } from './restaurant-service.controller';
import { RestaurantService } from './restaurant-service.service';
import { MenuModule } from './menu/menu.module';
import { DishModule } from './dish/dish.module';
import { User } from '../../../libs/database/entities/user.entity';
import { DatabaseModule } from '../../../libs/database/database.module';

@Module({
  imports: [
    // Use the shared database module
    DatabaseModule,
    // Register the User entity with TypeORM
    TypeOrmModule.forFeature([User]),
    MenuModule, 
    DishModule
  ],
  controllers: [RestaurantServiceController],
  providers: [
    RestaurantService,
    {
      provide: APP_PIPE,
      useFactory: () => new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
  ],
})
export class RestaurantServiceModule {}
