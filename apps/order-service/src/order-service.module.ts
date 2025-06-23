import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderServiceController } from './order-service.controller';
import { OrderServiceService } from './order-service.service';
import { Order } from '../../../libs/database/entities/order.entity';
import { OrderDish } from '../../../libs/database/entities/order_dish.entity';
import { OrderMenu } from '../../../libs/database/entities/order_menu.entity';
import { Dish } from '../../../libs/database/entities/dish.entity';
import { Menu } from '../../../libs/database/entities/menu.entity';
import { DatabaseModule } from '../../../libs/database/database.module';
import { CartItemService, OrderItemsService } from './cart';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Order, OrderDish, OrderMenu, Dish, Menu]),
  ],
  controllers: [OrderServiceController],
  providers: [
    OrderServiceService,
    CartItemService,
    OrderItemsService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
      useFactory: () => new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
  ],
})
export class OrderServiceModule {}
