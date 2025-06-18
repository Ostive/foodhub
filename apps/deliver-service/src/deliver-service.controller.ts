import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { DeliverServiceService, CreateDeliveryDriverDto, UpdateDeliveryDriverDto } from './deliver-service.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery, ApiOkResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiConflictResponse } from '@nestjs/swagger';
import { User } from '../../../libs/database/entities/user.entity';

@ApiTags('delivery-drivers')
@Controller('delivery-drivers')
export class DeliverServiceController {
  constructor(private readonly deliverServiceService: DeliverServiceService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new delivery driver',
    description: 'Creates a new delivery driver account with the provided information. Automatically assigns the delivery_person role and generates a unique referral code.'
  })
  @ApiCreatedResponse({ 
    description: 'The delivery driver has been successfully created.',
    type: User,
    schema: {
      example: {
        userId: 123,
        firstName: 'John',
        lastName: 'Doe',
        email: 'driver@example.com',
        phone: '+33612345678',
        role: 'delivery_person',
        transport: 'bicycle',
        referralCode: 'ABC12345',
        createdAt: '2023-06-19T10:00:00.000Z',
        updatedAt: '2023-06-19T10:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data.' })
  @ApiConflictResponse({ description: 'User with this email already exists.' })
  @ApiBody({ type: CreateDeliveryDriverDto })
  @HttpCode(HttpStatus.CREATED)
  async createDeliveryDriver(@Body() createDto: CreateDeliveryDriverDto) {
    return this.deliverServiceService.createDeliveryDriver(createDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all delivery drivers',
    description: 'Retrieves a list of all delivery drivers in the system.'
  })
  @ApiOkResponse({ 
    description: 'List of all delivery drivers retrieved successfully.',
    type: [User],
    schema: {
      example: [
        {
          userId: 123,
          firstName: 'John',
          lastName: 'Doe',
          email: 'driver1@example.com',
          phone: '+33612345678',
          transport: 'bicycle',
          isActive: true
        },
        {
          userId: 124,
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'driver2@example.com',
          phone: '+33687654321',
          transport: 'scooter',
          isActive: true
        }
      ]
    }
  })
  async getAllDeliveryDrivers() {
    return this.deliverServiceService.getAllDeliveryDrivers();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get a delivery driver by ID',
    description: 'Retrieves detailed information about a specific delivery driver.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Delivery driver ID',
    type: 'number',
    example: 123
  })
  @ApiOkResponse({ 
    description: 'Delivery driver information retrieved successfully.',
    type: User,
    schema: {
      example: {
        userId: 123,
        firstName: 'John',
        lastName: 'Doe',
        email: 'driver@example.com',
        phone: '+33612345678',
        address: '123 Main St, Paris',
        transport: 'bicycle',
        profilePicture: 'https://example.com/profile.jpg',
        rib: 'FR7630001007941234567890185'
      }
    }
  })
  @ApiNotFoundResponse({ description: 'Delivery driver with the specified ID was not found.' })
  async getDeliveryDriverById(@Param('id') id: string) {
    return this.deliverServiceService.getDeliveryDriverById(+id);
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Update a delivery driver',
    description: 'Updates information for an existing delivery driver. Only provided fields will be updated.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Delivery driver ID',
    type: 'number',
    example: 123
  })
  @ApiBody({ 
    type: UpdateDeliveryDriverDto,
    description: 'Fields to update for the delivery driver'
  })
  @ApiOkResponse({ 
    description: 'The delivery driver has been successfully updated.',
    type: User,
    schema: {
      example: {
        userId: 123,
        firstName: 'John',
        lastName: 'Doe Updated',
        email: 'driver_updated@example.com',
        phone: '+33612345678',
        transport: 'car',
        updatedAt: '2023-06-19T11:30:00.000Z'
      }
    }
  })
  @ApiNotFoundResponse({ description: 'Delivery driver with the specified ID was not found.' })
  @ApiConflictResponse({ description: 'The provided email is already in use by another user.' })
  async updateDeliveryDriver(
    @Param('id') id: string,
    @Body() updateDto: UpdateDeliveryDriverDto,
  ) {
    return this.deliverServiceService.updateDeliveryDriver(+id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete a delivery driver',
    description: 'Permanently removes a delivery driver from the system.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Delivery driver ID',
    type: 'number',
    example: 123
  })
  @ApiNoContentResponse({ description: 'The delivery driver has been successfully deleted.' })
  @ApiNotFoundResponse({ description: 'Delivery driver with the specified ID was not found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDeliveryDriver(@Param('id') id: string) {
    await this.deliverServiceService.deleteDeliveryDriver(+id);
  }

  @Get(':id/orders')
  @ApiOperation({ 
    summary: 'Get orders for a delivery driver',
    description: 'Retrieves all orders assigned to a specific delivery driver.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Delivery driver ID',
    type: 'number',
    example: 123
  })
  @ApiOkResponse({ 
    description: 'Delivery driver orders retrieved successfully.',
    schema: {
      example: [
        {
          orderId: 456,
          userId: 789,
          restaurantId: 101,
          deliveryId: 123,
          status: 'in_delivery',
          deliveryLocalisation: '48.8566,2.3522',
          time: '2023-06-19T14:30:00.000Z',
          totalPrice: 25.99,
          items: [
            { name: 'Pizza Margherita', quantity: 1, price: 12.99 },
            { name: 'Tiramisu', quantity: 1, price: 6.99 },
            { name: 'Coca-Cola', quantity: 2, price: 3.00 }
          ]
        },
        {
          orderId: 457,
          userId: 790,
          restaurantId: 102,
          deliveryId: 123,
          status: 'delivered',
          deliveryLocalisation: '48.8496,2.3523',
          time: '2023-06-19T12:15:00.000Z',
          totalPrice: 18.50
        }
      ]
    }
  })
  @ApiNotFoundResponse({ description: 'Delivery driver with the specified ID was not found.' })
  async getDeliveryDriverOrders(@Param('id') id: string) {
    return this.deliverServiceService.getDeliveryDriverOrders(+id);
  }
}
