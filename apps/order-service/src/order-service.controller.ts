import { Body, Controller, Get, Param, Post, Put, Patch, Query, BadRequestException } from '@nestjs/common';
import { OrderServiceService } from './order-service.service';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';
import { OrderStatus } from 'libs/database/entities/order_status.enum';
import { Order } from 'libs/database/entities/order.entity';
import { NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrderServiceController {
  constructor(private readonly orderServiceService: OrderServiceService) {}

  @ApiOperation({ summary: 'Get welcome message' })
  @ApiResponse({ status: 200, description: 'Returns a welcome message' })
  @Get('hello')
  getHello(): string {
    return this.orderServiceService.getHello();
  }

  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: CreateOrderDto, description: 'Order data' })
  @ApiResponse({ status: 201, description: 'Order successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderServiceService.createOrder(createOrderDto);
  }

  @ApiOperation({ summary: 'Update an existing order' })
  @ApiParam({ name: 'id', description: 'Order ID', example: '1' })
  @ApiBody({ type: UpdateOrderDto, description: 'Updated order data' })
  @ApiResponse({ status: 200, description: 'Order successfully updated' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @Put(':id')
  updateOrder(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderServiceService.updateOrder(id, updateOrderDto);
  }

  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Returns the order with the specified ID' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @Get(':id')
  getOrderById(@Param('id') id: string) {
    return this.orderServiceService.getOrderById(id);
  }
  
  @ApiOperation({ summary: 'Accept order by restaurant' })
  @ApiParam({ name: 'id', description: 'Order ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Order accepted by restaurant' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 400, description: 'Invalid status change' })
  @Patch(':id/accept-restaurant')
  acceptByRestaurant(@Param('id') id: string) {
    return this.orderServiceService.changeStatus(id, OrderStatus.ACCEPTED_RESTAURANT);
  }

  @ApiOperation({ summary: 'Accept order by delivery person' })
  @ApiParam({ name: 'id', description: 'Order ID', example: '1' })
  @ApiBody({
    description: 'Delivery person ID',
    schema: {
      type: 'object',
      properties: {
        deliveryId: { type: 'number', example: 1 }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Order accepted by delivery person' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 400, description: 'Invalid status change or missing delivery ID' })
  @Patch(':id/accept-delivery')
  acceptByDelivery(@Param('id') id: string, @Body() body: { deliveryId: number }) {
    return this.orderServiceService.acceptDelivery(id, body.deliveryId); 
  }

  @ApiOperation({ summary: 'Set order status to preparing' })
  @ApiParam({ name: 'id', description: 'Order ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Order status updated to preparing' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 400, description: 'Invalid status change' })
  @Patch(':id/preparing')
  setPreparing(@Param('id') id: string) {
    return this.orderServiceService.changeStatus(id, OrderStatus.PREPARING);
  }

  @ApiOperation({ summary: 'Set order status to out for delivery' })
  @ApiParam({ name: 'id', description: 'Order ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Order status updated to out for delivery' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 400, description: 'Invalid status change' })
  @Patch(':id/out-for-delivery')
  setOutForDelivery(@Param('id') id: string) {
    return this.orderServiceService.changeStatus(id, OrderStatus.OUT_FOR_DELIVERY);
  }

  @ApiOperation({ summary: 'Set order status to delivered' })
  @ApiParam({ name: 'id', description: 'Order ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Order status updated to delivered' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 400, description: 'Invalid status change' })
  @Patch(':id/delivered')
  setDelivered(@Param('id') id: string) {
    return this.orderServiceService.changeStatus(id, OrderStatus.DELIVERED);
  }

  @ApiOperation({ summary: 'Get orders by status' })
  @ApiParam({
    name: 'status',
    description: 'Order status',
    enum: OrderStatus,
    example: OrderStatus.CREATED
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all orders with the specified status',
    type: [Order]
  })
  @ApiResponse({ status: 400, description: 'Invalid status' })
  @Get('status/:status')
  getOrdersByStatus(@Param('status') status: OrderStatus) {
    return this.orderServiceService.getOrdersByStatus(status);
  }

    @ApiOperation({ summary: 'Get all orders' })
    @Get()
    async getOrders(@Query('restaurantId') restaurantId: number) {
      if (!restaurantId) {
        throw new BadRequestException('restaurantId is required');
      }
      return this.orderServiceService.getAllOrders(restaurantId);
    }

}
