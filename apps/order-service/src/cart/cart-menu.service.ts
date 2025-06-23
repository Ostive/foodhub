import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { OrderMenu } from 'libs/database/entities/order_menu.entity';
import { CartItemDto, CartItemType } from '../dto/cart-item.dto';
import { Menu } from 'libs/database/entities/menu.entity';

@Injectable()
export class CartMenuService {
  constructor(
    @InjectRepository(OrderMenu)
    private readonly orderMenuRepository: Repository<OrderMenu>,
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  /**
   * Process menu items and save them to the order_menus table
   * @param orderId The order ID
   * @param menuItems Array of menu items
   */
  async processMenuItems(orderId: number, menuItems: CartItemDto[]): Promise<void> {
    if (!menuItems || menuItems.length === 0) {
      return;
    }

    // Filter only menu items
    const filteredMenuItems = menuItems.filter(item => item.type === CartItemType.MENU);
    if (filteredMenuItems.length === 0) {
      return;
    }

    // Create OrderMenu entities for each menu item
    const orderMenus: OrderMenu[] = [];

    for (const item of filteredMenuItems) {
      const orderMenu = new OrderMenu();
      orderMenu.orderId = orderId;
      orderMenu.menuId = parseInt(item.id, 10);
      orderMenu.quantity = item.quantity;
      orderMenus.push(orderMenu);
    }

    // Save all menu items
    if (orderMenus.length > 0) {
      await this.orderMenuRepository.save(orderMenus);
    }
  }

  /**
   * Get menu details for a list of menu IDs
   * @param menuIds Array of menu IDs
   * @returns Array of menu details
   */
  async getMenuDetails(menuIds: number[]): Promise<Menu[]> {
    if (!menuIds || menuIds.length === 0) {
      return [];
    }

    return this.menuRepository.findBy({ menuId: In(menuIds) });
  }

  /**
   * Clear existing menu items for an order
   * @param orderId The order ID
   */
  async clearOrderMenuItems(orderId: number): Promise<void> {
    await this.orderMenuRepository.delete({ orderId });
  }
}
