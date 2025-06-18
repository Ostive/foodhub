import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DishService } from './dish.service';
import { Dish } from '../../../../libs/database/entities/dish.entity';
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Dish])],
  providers: [DishService],
  exports: [DishService],
})
export class DishModule {}
