import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { OrderDish } from 'libs/database/entities/order_dish.entity';
import { OrderMenu } from 'libs/database/entities/order_menu.entity';
import { Dish } from 'libs/database/entities/dish.entity';
import { Menu } from 'libs/database/entities/menu.entity';

/**
 * Service to retrieve order items (dishes and menus) for a specific order
 */
@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderDish)
    private readonly orderDishRepository: Repository<OrderDish>,
    @InjectRepository(OrderMenu)
    private readonly orderMenuRepository: Repository<OrderMenu>,
    @InjectRepository(Dish)
    private readonly dishRepository: Repository<Dish>,
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  /**
   * Find all dishes associated with an order
   * @param orderId The order ID
   * @returns Array of dishes with quantities
   */
  async findOrderDishes(orderId: number): Promise<{ dish: Dish; quantity: number }[]> {
    // Get all order dish entries for this order with quantity
    const orderDishes = await this.orderDishRepository.find({
      where: { orderId },
      relations: ['dish'],
    });

    // Map dishes with their quantities
    const result: { dish: Dish; quantity: number }[] = [];
    
    for (const orderDish of orderDishes) {
      // If dish is loaded via relation
      if (orderDish.dish) {
        result.push({
          dish: orderDish.dish,
          quantity: orderDish.quantity
        });
      }
    }

    // If relations didn't work, fetch dishes separately
    if (result.length === 0 && orderDishes.length > 0) {
      const dishIds = orderDishes.map(od => od.dishId);
      const dishes = await this.dishRepository.findBy({ dishId: In(dishIds) });
      
      // Create a map of dishes by id for quick lookup
      const dishMap = new Map<number, Dish>();
      dishes.forEach(dish => dishMap.set(dish.dishId, dish));
      
      // Create result with dishes and their quantities
      for (const orderDish of orderDishes) {
        const dish = dishMap.get(orderDish.dishId);
        if (dish) {
          result.push({
            dish,
            quantity: orderDish.quantity
          });
        }
      }
    }
    
    return result;
  }

  /**
   * Find all menus associated with an order
   * @param orderId The order ID
   * @returns Array of menus with quantities
   */
  async findOrderMenus(orderId: number): Promise<{ menu: Menu; quantity: number }[]> {
    // Get all order menu entries for this order with quantity
    const orderMenus = await this.orderMenuRepository.find({
      where: { orderId },
      relations: ['menu'],
    });

    // Map menus with their quantities
    const result: { menu: Menu; quantity: number }[] = [];
    
    for (const orderMenu of orderMenus) {
      // If menu is loaded via relation
      if (orderMenu.menu) {
        result.push({
          menu: orderMenu.menu,
          quantity: orderMenu.quantity
        });
      }
    }

    // If relations didn't work, fetch menus separately
    if (result.length === 0 && orderMenus.length > 0) {
      const menuIds = orderMenus.map(om => om.menuId);
      const menus = await this.menuRepository.findBy({ menuId: In(menuIds) });
      
      // Create a map of menus by id for quick lookup
      const menuMap = new Map<number, Menu>();
      menus.forEach(menu => menuMap.set(menu.menuId, menu));
      
      // Create result with menus and their quantities
      for (const orderMenu of orderMenus) {
        const menu = menuMap.get(orderMenu.menuId);
        if (menu) {
          result.push({
            menu,
            quantity: orderMenu.quantity
          });
        }
      }
    }
    
    return result;
  }

  /**
   * Find all items (dishes and menus) associated with an order
   * @param orderId The order ID
   * @returns Object containing arrays of dishes and menus with quantities
   */
  async findOrderItems(orderId: number): Promise<{
    dishes: { dish: Dish; quantity: number }[];
    menus: { menu: Menu; quantity: number }[];
  }> {
    const [dishes, menus] = await Promise.all([
      this.findOrderDishes(orderId),
      this.findOrderMenus(orderId),
    ]);

    return { dishes, menus };
  }
}
