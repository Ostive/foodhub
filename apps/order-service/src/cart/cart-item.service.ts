import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDish } from 'libs/database/entities/order_dish.entity';
import { OrderMenu } from 'libs/database/entities/order_menu.entity';
import { CartItemDto, CartItemType } from '../dto/cart-item.dto';
import { Order } from 'libs/database/entities/order.entity';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(OrderDish)
    private readonly orderDishRepository: Repository<OrderDish>,
    @InjectRepository(OrderMenu)
    private readonly orderMenuRepository: Repository<OrderMenu>,
  ) {}

  /**
   * Process cart items and save them to the appropriate tables
   * @param order The order entity
   * @param cartItems Array of cart items (dishes and menus)
   */
  async processCartItems(order: Order, cartItems: CartItemDto[]): Promise<void> {
    if (!cartItems || cartItems.length === 0) {
      return;
    }

    // Process dishes
    const dishItems = cartItems.filter(item => item.type === CartItemType.DISH);
    await this.processDishItems(order.orderId, dishItems);

    // Process menus
    const menuItems = cartItems.filter(item => item.type === CartItemType.MENU);
    await this.processMenuItems(order.orderId, menuItems);
  }

  /**
   * Process dish items and save them to the order_dishes table
   * @param orderId The order ID
   * @param dishItems Array of dish items
   */
  private async processDishItems(orderId: number, dishItems: CartItemDto[]): Promise<void> {
    if (!dishItems || dishItems.length === 0) {
      return;
    }

    // Create OrderDish entities for each dish item
    // For simplicity, we're handling each dish with quantity > 1 as multiple entries
    const orderDishes: OrderDish[] = [];

    for (const item of dishItems) {
      for (let i = 0; i < item.quantity; i++) {
        const orderDish = new OrderDish();
        orderDish.orderId = orderId;
        orderDish.dishId = parseInt(item.id, 10);
        orderDishes.push(orderDish);
      }
    }

    // Save all dish items
    if (orderDishes.length > 0) {
      await this.orderDishRepository.save(orderDishes);
    }
  }

  /**
   * Process menu items and save them to the order_menus table
   * @param orderId The order ID
   * @param menuItems Array of menu items
   */
  private async processMenuItems(orderId: number, menuItems: CartItemDto[]): Promise<void> {
    if (!menuItems || menuItems.length === 0) {
      return;
    }

    // Create OrderMenu entities for each menu item
    // For simplicity, we're handling each menu with quantity > 1 as multiple entries
    const orderMenus: OrderMenu[] = [];

    for (const item of menuItems) {
      for (let i = 0; i < item.quantity; i++) {
        const orderMenu = new OrderMenu();
        orderMenu.orderId = orderId;
        orderMenu.menuId = parseInt(item.id, 10);
        orderMenus.push(orderMenu);
      }
    }

    // Save all menu items
    if (orderMenus.length > 0) {
      await this.orderMenuRepository.save(orderMenus);
    }
  }

  /**
   * Clear existing order items (both dishes and menus) for an order
   * @param orderId The order ID
   */
  async clearOrderItems(orderId: number): Promise<void> {
    // Delete all dish items for this order
    await this.orderDishRepository.delete({ orderId });
    
    // Delete all menu items for this order
    await this.orderMenuRepository.delete({ orderId });
  }
}
