import { Body, Controller, Get, Param, Post, Put, Patch } from '@nestjs/common';
import { OrderServiceService } from './order-service.service';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';
import { OrderStatus } from 'libs/database/entities/order_status.enum';
import { Order } from 'libs/database/entities/order.entity';
import { NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';

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
  
  @Patch(':id/accept-restaurant')
  acceptByRestaurant(@Param('id') id: string) {
    return this.orderServiceService.changeStatus(id, OrderStatus.ACCEPTED_RESTAURANT);
  }

  @Patch(':id/accept-delivery')
  acceptByDelivery(@Param('id') id: string, @Body() body: { deliveryId: number }) {
    return this.orderServiceService.acceptDelivery(id, body.deliveryId); 
  }

  @Patch(':id/preparing')
  setPreparing(@Param('id') id: string) {
    return this.orderServiceService.changeStatus(id, OrderStatus.PREPARING);
  }

  @Patch(':id/out-for-delivery')
  setOutForDelivery(@Param('id') id: string) {
    return this.orderServiceService.changeStatus(id, OrderStatus.OUT_FOR_DELIVERY);
  }

  @Patch(':id/delivered')
  setDelivered(@Param('id') id: string) {
    return this.orderServiceService.changeStatus(id, OrderStatus.DELIVERED);
  }

  @Get('status/:status')
  getOrdersByStatus(@Param('status') status: OrderStatus) {
    return this.orderServiceService.getOrdersByStatus(status);
  }


}
