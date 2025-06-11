import { Injectable, ValidationPipe, UsePipes } from '@nestjs/common';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';

@Injectable()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class OrderServiceService {
  getHello(): string {
    return 'Hello World!';
  }

  createOrder(createOrderDto: CreateOrderDto) {
    // Implementation will go here
    return { message: 'Order created', order: createOrderDto };
  }

  updateOrder(id: string, updateOrderDto: UpdateOrderDto) {
    // Implementation will go here
    return { message: 'Order updated', id, updates: updateOrderDto };
  }

  getOrderById(id: string) {
    // Implementation will go here
    return { message: 'Order retrieved', id };
  }
}
