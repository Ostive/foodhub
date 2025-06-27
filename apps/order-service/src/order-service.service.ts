import { Injectable, ValidationPipe, UsePipes } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from 'libs/database/entities/order_status.enum';
import { Order } from 'libs/database/entities/order.entity';
import { OrderDish } from 'libs/database/entities/order_dish.entity';
import { OrderMenu } from 'libs/database/entities/order_menu.entity';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItemService, OrderItemsService } from './cart';
import { CartItemType } from './dto/cart-item.dto';


@Injectable()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class OrderServiceService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderDish)
    private readonly orderDishRepository: Repository<OrderDish>,
    @InjectRepository(OrderMenu)
    private readonly orderMenuRepository: Repository<OrderMenu>,
    private readonly cartItemService: CartItemService,
    private readonly orderItemsService: OrderItemsService,
  ) {}


  async createOrder(createOrderDto: CreateOrderDto) {
    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Create a new order with proper typing
    const newOrder = new Order();
    newOrder.customerId = createOrderDto.customerId;
    newOrder.restaurantId = createOrderDto.restaurantId;
    newOrder.deliveryLocalisation = createOrderDto.deliveryLocalisation || '';
    newOrder.time = createOrderDto.time || new Date();
    newOrder.cost = createOrderDto.cost || 0; // Use provided cost or calculate after items are processed
    newOrder.deliveryFee = createOrderDto.deliveryFee || 0;
    newOrder.status = createOrderDto.status || OrderStatus.CREATED;
    newOrder.verificationCode = verificationCode;
    
    // Save the order first to get the order ID
    const savedOrder = await this.orderRepository.save(newOrder);
    
    // Process dishes if they exist
    if (createOrderDto.dishes && createOrderDto.dishes.length > 0) {
      await this.orderItemsService.processDishes(savedOrder, createOrderDto.dishes);
    }
    
    // Process menus if they exist
    if (createOrderDto.menus && createOrderDto.menus.length > 0) {
      await this.orderItemsService.processMenus(savedOrder, createOrderDto.menus);
    }
    
    // For backward compatibility - process cart items if they exist (old format)
    if (createOrderDto['cartItems'] && createOrderDto['cartItems'].length > 0) {
      await this.cartItemService.processCartItems(savedOrder, createOrderDto['cartItems']);
    }
    // For backward compatibility - process legacy items if they exist and no other items were provided
    else if (createOrderDto['items'] && createOrderDto['items'].length > 0) {
      // Convert legacy items to cart items format
      const cartItems = createOrderDto['items'].map(item => ({
        id: item.itemId.toString(),
        type: CartItemType.DISH, // Legacy items are always dishes
        quantity: item.quantity,
        specialInstructions: item.specialInstructions
      }));
      
      await this.cartItemService.processCartItems(savedOrder, cartItems);
    }
    
    // Calculate the total cost of the order based on the items
    const totalCost = await this.calculateOrderTotal(savedOrder.orderId);
    savedOrder.cost = totalCost;
    await this.orderRepository.save(savedOrder);
    
    return savedOrder;
  }
  

  async updateOrder(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.findOneBy({ orderId: +id });
    if (!order) throw new NotFoundException('Order not found');
    
    // Update order properties
    const { dishes, menus, ...orderProps } = updateOrderDto;
    Object.assign(order, orderProps);
    
    // Save the updated order
    const updatedOrder = await this.orderRepository.save(order);
    
    // Process dishes if they exist
    if (dishes && dishes.length > 0) {
      // Delete existing dishes for this order
      await this.orderDishRepository.delete({ orderId: order.orderId });
      // Add new dishes
      await this.orderItemsService.processDishes(order, dishes);
    }
    
    // Process menus if they exist
    if (menus && menus.length > 0) {
      // Delete existing menus for this order
      await this.orderMenuRepository.delete({ orderId: order.orderId });
      // Add new menus
      await this.orderItemsService.processMenus(order, menus);
    }
    
    // For backward compatibility - process cart items if they exist
    if (updateOrderDto['cartItems'] && updateOrderDto['cartItems'].length > 0) {
      // Clear existing items
      await this.cartItemService.clearOrderItems(order.orderId);
      // Add new items
      await this.cartItemService.processCartItems(updatedOrder, updateOrderDto['cartItems']);
    }
    // For backward compatibility - process legacy items if they exist
    else if (updateOrderDto['items'] && updateOrderDto['items'].length > 0) {
      // Clear existing items
      await this.cartItemService.clearOrderItems(order.orderId);
      
      // Convert legacy items to cart items format
      const cartItemsFromLegacy = updateOrderDto['items'].map(item => ({
        id: item.itemId.toString(),
        type: CartItemType.DISH, // Legacy items are always dishes
        quantity: item.quantity,
        specialInstructions: item.specialInstructions || ''
      }));
      
      await this.cartItemService.processCartItems(updatedOrder, cartItemsFromLegacy);
    }
    
    // Recalculate the total cost after updating items
    const totalCost = await this.calculateOrderTotal(updatedOrder.orderId);
    updatedOrder.cost = totalCost;
    await this.orderRepository.save(updatedOrder);
    
    return updatedOrder;
  }

  async getOrderById(id: number) {
    const order = await this.orderRepository.findOneBy({ orderId: +id });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  // Général pour changer de statut
  async changeStatus(orderId: number, status: OrderStatus) {
    const order = await this.orderRepository.findOneBy({ orderId: +orderId });
    if (!order) throw new NotFoundException('Order not found');
    order.status = status;
    return this.orderRepository.save(order);
  }

  // Spécifique pour acceptation par le livreur
  async acceptDelivery(orderId: number, deliveryId: number) {
    const order = await this.orderRepository.findOneBy({ orderId: +orderId });
    if (!order) throw new NotFoundException('Order not found');
    
    // Check if the order is in a valid state to be accepted by delivery person
    if (order.status !== OrderStatus.ACCEPTED_RESTAURANT) {
      throw new Error('Order must be accepted by restaurant before being accepted by delivery person');
    }
    
    order.deliveryId = deliveryId;
    return this.orderRepository.save(order);
  }

  async findByStatus(status: OrderStatus): Promise<Order[]> {
    return this.orderRepository.find({ where: { status } });
  }

  // Find all orders, optionally filtered by restaurant ID
  async findAll(restaurantId?: number): Promise<Order[]> {
    if (restaurantId) {
      return this.orderRepository.find({ 
        where: { restaurantId },
        relations: ['orderDishes', 'orderMenus'],
        order: { time: 'DESC' }
      });
    }
    return this.orderRepository.find({
      relations: ['orderDishes', 'orderMenus'],
      order: { time: 'DESC' }
    });
  }
  
  /**
   * Find all orders assigned to a specific delivery person
   */
  async findByDeliveryPerson(deliveryPersonId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { deliveryId: deliveryPersonId },
      relations: ['customer', 'restaurant']
    });
  }

  /**
   * Find all orders for a specific customer
   * @param customerId The ID of the customer
   * @returns Array of orders for the customer
   */
  async findByCustomer(customerId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { customerId },
      relations: ['orderDishes', 'orderMenus'],
      order: { time: 'DESC' }
    });
  }

  /**
   * Find all orders available for delivery (accepted by restaurant but not yet assigned to a delivery person)
   */
  async findAvailableForDelivery(): Promise<Order[]> {
    return this.orderRepository.find({
      where: { status: OrderStatus.ACCEPTED_RESTAURANT },
      relations: ['restaurant']
    });
  }

  /**
   * Update order status with validation for proper status transitions
   */
  async updateOrderStatus(orderId: number, newStatus: OrderStatus, deliveryPersonId?: number): Promise<Order> {
    const order = await this.orderRepository.findOneBy({ orderId: +orderId });
    if (!order) throw new NotFoundException(`Order with ID ${orderId} not found`);
    
    // Validate status transition
    const validTransitions = this.getValidStatusTransitions(order.status);
    if (!validTransitions.includes(newStatus)) {
      throw new Error(`Invalid status transition from ${order.status} to ${newStatus}`);
    }
    
    
    order.status = newStatus;
    return this.orderRepository.save(order);
  }

  /**
   * Helper method to determine valid status transitions
   */
  private getValidStatusTransitions(currentStatus: OrderStatus): OrderStatus[] {
    const transitions = {
      [OrderStatus.CREATED]: [OrderStatus.ACCEPTED_RESTAURANT],
      [OrderStatus.ACCEPTED_RESTAURANT]: [OrderStatus.PREPARING],
      [OrderStatus.PREPARING]: [OrderStatus.OUT_FOR_DELIVERY],
      [OrderStatus.OUT_FOR_DELIVERY]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: []
    };
    
    return transitions[currentStatus] || [];
  }
  
  /**
   * Verify the delivery code provided by the customer
   */
  async verifyDeliveryCode(orderId: string, code: string): Promise<{ valid: boolean }> {
    const order = await this.orderRepository.findOneBy({ orderId: +orderId });
    
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    
    // Check if the verification code matches
    const isValid = order.verificationCode === code;
    
    return { valid: isValid };
  }

  async findOne(orderId: number) {
    const order = await this.orderRepository.findOne({ where: { orderId } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    return order;
  }
  
  /**
   * Find an order by ID and include its associated dishes and menus
   * @param orderId The order ID
   * @returns Order with dishes and menus
   */
  async findOneWithItems(orderId: number) {
    const order = await this.findOne(orderId);
    const orderItems = await this.orderItemsService.getOrderItems(orderId);
    
    return {
      ...order,
      items: orderItems
    };
  }
  
  /**
   * Calculate the total cost of an order based on the prices of its dishes and menus
   * @param orderId The order ID
   * @returns The total cost of the order
   */
  async calculateOrderTotal(orderId: number): Promise<number> {
    // Get all dishes and menus for this order
    const { dishes, menus } = await this.orderItemsService.getOrderItems(orderId);
    
    // Calculate total from dishes
    const dishesTotal = dishes.reduce((total, item) => {
      const dishPrice = item.dish.cost || 0;
      return total + (dishPrice * item.quantity);
    }, 0);
    
    // Calculate total from menus
    const menusTotal = menus.reduce((total, item) => {
      const menuPrice = item.menu.cost || 0;
      return total + (menuPrice * item.quantity);
    }, 0);
    
    // Return the sum of both totals
    return dishesTotal + menusTotal;
  }
}
