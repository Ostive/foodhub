import { Injectable, ValidationPipe, UsePipes } from '@nestjs/common';
import { MenuItemDto } from '../dto/menu';

@Injectable()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class MenuService {
  // constructor(private readonly menuItemRepository: MenuItemRepository) {}

  addMenuItem(restaurantId: string, menuItemDto: MenuItemDto) {
    // Implementation will go here
    return { message: 'Menu item added', restaurantId, item: menuItemDto };
  }

  updateMenuItem(restaurantId: string, menuItemId: string, menuItemDto: MenuItemDto) {
    // Implementation will go here
    return { message: 'Menu item updated', restaurantId, menuItemId, updates: menuItemDto };
  }

  deleteMenuItem(restaurantId: string, menuItemId: string) {
    // Implementation will go here
    return { message: 'Menu item deleted', restaurantId, menuItemId };
  }

  getMenuItemById(restaurantId: string, menuItemId: string) {
    // Implementation will go here
    return { message: 'Menu item retrieved', restaurantId, menuItemId };
  }

  getAllMenuItems(restaurantId: string) {
    // Implementation will go here
    return { message: 'All menu items retrieved', restaurantId, items: [] };
  }
}
