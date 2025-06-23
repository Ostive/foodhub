import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { OrderDish } from 'libs/database/entities/order_dish.entity';
import { CartItemDto, CartItemType } from '../dto/cart-item.dto';
import { Dish } from 'libs/database/entities/dish.entity';

@Injectable()
export class CartDishService {
  constructor(
    @InjectRepository(OrderDish)
    private readonly orderDishRepository: Repository<OrderDish>,
    @InjectRepository(Dish)
    private readonly dishRepository: Repository<Dish>,
  ) {}

  /**
   * Process dish items and save them to the order_dishes table
   * @param orderId The order ID
   * @param dishItems Array of dish items
   */
  async processDishItems(orderId: number, dishItems: CartItemDto[]): Promise<void> {
    if (!dishItems || dishItems.length === 0) {
      return;
    }

    // Filter only dish items
    const filteredDishItems = dishItems.filter(item => item.type === CartItemType.DISH);
    if (filteredDishItems.length === 0) {
      return;
    }

    // Create OrderDish entities for each dish item
    const orderDishes: OrderDish[] = [];

    for (const item of filteredDishItems) {
      const orderDish = new OrderDish();
      orderDish.orderId = orderId;
      orderDish.dishId = parseInt(item.id, 10);
      orderDish.quantity = item.quantity;
      orderDishes.push(orderDish);
    }

    // Save all dish items
    if (orderDishes.length > 0) {
      await this.orderDishRepository.save(orderDishes);
    }
  }

  /**
   * Get dish details for a list of dish IDs
   * @param dishIds Array of dish IDs
   * @returns Array of dish details
   */
  async getDishDetails(dishIds: number[]): Promise<Dish[]> {
    if (!dishIds || dishIds.length === 0) {
      return [];
    }

    return this.dishRepository.findBy({ dishId: In(dishIds) });
  }

  /**
   * Clear existing dish items for an order
   * @param orderId The order ID
   */
  async clearOrderDishItems(orderId: number): Promise<void> {
    await this.orderDishRepository.delete({ orderId });
  }
}
