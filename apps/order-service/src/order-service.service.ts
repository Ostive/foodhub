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
  //   const newOrder = this.orderRepository.create(createOrderDto);
  //   newOrder.status = OrderStatus.CREATED;
  //   return this.orderRepository.save(newOrder);
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
    order.deleveryId = deliveryId;
    order.status = OrderStatus.ACCEPTED_DELIVERY;
    return this.orderRepository.save(order);
  }

  async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    return this.orderRepository.find({ where: { status } });
  }

  async getAllOrders(restaurantId?: number): Promise<Order[]> {
    if (restaurantId) {
      return this.orderRepository.find({ where: { restaurantId } });
    }
    return this.orderRepository.find();
  }
}
