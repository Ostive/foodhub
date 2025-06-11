import { Injectable, ValidationPipe, UsePipes } from '@nestjs/common';
import { CreateRestaurantDto, UpdateRestaurantDto, MenuItemDto } from './dto/restaurant.dto';

@Injectable()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class RestaurantServiceService {
  getHello(): string {
    return 'Hello World!';
  }

  createRestaurant(createRestaurantDto: CreateRestaurantDto) {
    // Implementation will go here
    return { message: 'Restaurant created', restaurant: createRestaurantDto };
  }

  updateRestaurant(id: string, updateRestaurantDto: UpdateRestaurantDto) {
    // Implementation will go here
    return { message: 'Restaurant updated', id, updates: updateRestaurantDto };
  }

  addMenuItem(restaurantId: string, menuItemDto: MenuItemDto) {
    // Implementation will go here
    return { message: 'Menu item added', restaurantId, item: menuItemDto };
  }

  getRestaurantById(id: string) {
    // Implementation will go here
    return { message: 'Restaurant retrieved', id };
  }
}
