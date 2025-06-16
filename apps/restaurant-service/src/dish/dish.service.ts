import { Injectable, ValidationPipe, UsePipes } from '@nestjs/common';
import { CreateDishDto, UpdateDishDto } from '../dto/dish';

@Injectable()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class DishService {
  // constructor(private readonly dishRepository: DishRepository) {}

  createDish(restaurantId: string, createDishDto: CreateDishDto) {
    // Implementation will go here
    return { message: 'Dish created', restaurantId, dish: createDishDto };
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
