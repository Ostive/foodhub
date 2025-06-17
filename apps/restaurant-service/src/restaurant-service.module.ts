import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { RestaurantServiceController } from './restaurant-service.controller';
import { RestaurantService } from './restaurant-service.service';
import { MenuModule } from './menu/menu.module';
import { DishModule } from './dish/dish.module';

@Module({
  imports: [MenuModule, DishModule],
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
