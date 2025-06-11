import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { OrderServiceService } from './order-service.service';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';

@Controller('orders')
export class OrderServiceController {
  constructor(private readonly orderServiceService: OrderServiceService) {}

  @Get()
  getHello(): string {
    return this.orderServiceService.getHello();
  }

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderServiceService.createOrder(createOrderDto);
  }

  @Put(':id')
  updateOrder(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderServiceService.updateOrder(id, updateOrderDto);
  }

  @Get(':id')
  getOrderById(@Param('id') id: string) {
    return this.orderServiceService.getOrderById(id);
  }
}
