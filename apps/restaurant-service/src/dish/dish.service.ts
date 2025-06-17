import { Injectable, ValidationPipe, UsePipes } from '@nestjs/common';
import { CreateDishDto, UpdateDishDto } from '../dto/dish';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dish } from 'libs/database/entities/dish.entity';

@Injectable()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class DishService {

  constructor(
    @InjectRepository(Dish)
    private dishRepository: Repository<Dish>,
  ) {}

  createDish(createDishDto: CreateDishDto) {
    const newDish = this.dishRepository.create({CreateDishDto});
    return { message: 'Dish created', dish: createDishDto };
  }

  updateDish(restaurantId: string, dishId: string, updateDishDto: UpdateDishDto) {
    // Implementation will go here
    return { message: 'Dish updated', restaurantId, dishId, updates: updateDishDto };
  }

  deleteDish(restaurantId: string, dishId: string) {
    // Implementation will go here
    return { message: 'Dish deleted', restaurantId, dishId };
  }

  getDishById(restaurantId: string, dishId: string) {
    // Implementation will go here
    return { message: 'Dish retrieved', restaurantId, dishId };
  }

  getAllDishes(restaurantId: string) {
    // Implementation will go here
    return { message: 'All dishes retrieved', restaurantId, dishes: [] };
  }

  getDishesByCategory(restaurantId: string, category: string) {
    // Implementation will go here
    return { message: 'Dishes by category retrieved', restaurantId, category, dishes: [] };
  }
}
