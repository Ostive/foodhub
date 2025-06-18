import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DishService } from './dish.service';
import { Dish } from '../../../../libs/database/entities/dish.entity';
import { User } from '../../../../libs/database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dish, User])],
  providers: [DishService],
  exports: [DishService],
})
export class DishModule {}
