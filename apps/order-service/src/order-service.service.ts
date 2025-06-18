import { Injectable, ValidationPipe, UsePipes } from '@nestjs/common';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';
import { OrderStatus } from 'libs/database/entities/order_status.enum';
import { Order } from 'libs/database/entities/order.entity';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class OrderServiceService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    const newOrder = this.orderRepository.create({
      customerId: parseInt(createOrderDto.userId),
      restaurantId: parseInt(createOrderDto.restaurantId),
      deliveryLocalisation: createOrderDto.deliveryAddress || '',
      time: new Date(),
      cost: 0, // Will be calculated based on items
      status: OrderStatus.CREATED,
      // Items will be handled separately
    });
    
    return this.orderRepository.save(newOrder);
  }
  

  async updateOrder(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.findOneBy({ orderId: +id });
    if (!order) throw new NotFoundException('Order not found');
    Object.assign(order, updateOrderDto);
    return this.orderRepository.save(order);
  }

  async getOrderById(id: string) {
    const order = await this.orderRepository.findOneBy({ orderId: +id });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  // Général pour changer de statut
  async changeStatus(orderId: string, status: OrderStatus) {
    const order = await this.orderRepository.findOneBy({ orderId: +orderId });
    if (!order) throw new NotFoundException('Order not found');
    order.status = status;
    return this.orderRepository.save(order);
  }

  // Spécifique pour acceptation par le livreur
  async acceptDelivery(orderId: string, deliveryId: number) {
    const order = await this.orderRepository.findOneBy({ orderId: +orderId });
    if (!order) throw new NotFoundException('Order not found');
    
    // Check if the order is in a valid state to be accepted by delivery person
    if (order.status !== OrderStatus.ACCEPTED_RESTAURANT) {
      throw new Error('Order must be accepted by restaurant before being accepted by delivery person');
    }
    
    order.deliveryId = deliveryId;
    order.status = OrderStatus.ACCEPTED_DELIVERY;
    return this.orderRepository.save(order);
  }

  async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    return this.orderRepository.find({ where: { status } });
  }
  
  /**
   * Get all orders assigned to a specific delivery person
   */
  async getDeliveryPersonOrders(deliveryPersonId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { deliveryId: deliveryPersonId },
      relations: ['customer', 'restaurant']
    });
  }

  /**
   * Get all orders available for delivery (accepted by restaurant but not yet assigned to a delivery person)
   */
  async getOrdersAvailableForDelivery(): Promise<Order[]> {
    return this.orderRepository.find({
      where: { status: OrderStatus.ACCEPTED_RESTAURANT },
      relations: ['restaurant']
    });
  }

  /**
   * Update order status with validation for proper status transitions
   */
  async updateOrderStatus(orderId: string, newStatus: OrderStatus, deliveryPersonId?: number): Promise<Order> {
    const order = await this.orderRepository.findOneBy({ orderId: +orderId });
    if (!order) throw new NotFoundException(`Order with ID ${orderId} not found`);
    
    // Validate status transition
    const validTransitions = this.getValidStatusTransitions(order.status);
    if (!validTransitions.includes(newStatus)) {
      throw new Error(`Invalid status transition from ${order.status} to ${newStatus}`);
    }
    
    // If transitioning to ACCEPTED_DELIVERY, ensure deliveryPersonId is provided
    if (newStatus === OrderStatus.ACCEPTED_DELIVERY) {
      if (!deliveryPersonId) {
        throw new Error('Delivery person ID is required when accepting an order for delivery');
      }
      order.deliveryId = deliveryPersonId;
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
      [OrderStatus.ACCEPTED_RESTAURANT]: [OrderStatus.ACCEPTED_DELIVERY],
      [OrderStatus.ACCEPTED_DELIVERY]: [OrderStatus.PREPARING],
      [OrderStatus.PREPARING]: [OrderStatus.OUT_FOR_DELIVERY],
      [OrderStatus.OUT_FOR_DELIVERY]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: []
    };
    
    return transitions[currentStatus] || [];
  }
}
