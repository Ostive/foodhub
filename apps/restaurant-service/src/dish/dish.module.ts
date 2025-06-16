import { Module } from '@nestjs/common';
import { DishService } from './dish.service';

@Module({
  providers: [DishService],
  exports: [DishService],
})
export class DishModule {}
