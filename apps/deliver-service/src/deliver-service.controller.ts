import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { DeliverServiceService } from './deliver-service.service';
import { CreateDeliveryPersonDto } from './dto/create-delivery-person.dto';
import { UpdateDeliveryPersonDto } from './dto/update-delivery-person.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery, ApiOkResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiConflictResponse } from '@nestjs/swagger';
import { User } from '../../../libs/database/entities/user.entity';

@ApiTags('delivery-person')
@Controller('delivery-person')
export class DeliverServiceController {
  constructor(private readonly deliverServiceService: DeliverServiceService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new delivery person',
    description: 'Creates a new delivery person account with the provided information. Automatically assigns the delivery_person role and generates a unique referral code.'
  })
  @ApiCreatedResponse({ 
    description: 'The delivery person has been successfully created.',
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
  @ApiBody({ type: CreateDeliveryPersonDto })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateDeliveryPersonDto) {
    return this.deliverServiceService.create(createDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all delivery persons',
    description: 'Retrieves a list of all delivery persons in the system.'
  })
  @ApiOkResponse({ 
    description: 'List of all delivery persons retrieved successfully.',
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
  async findAll() {
    return this.deliverServiceService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get a delivery person by ID',
    description: 'Retrieves detailed information about a specific delivery person.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Delivery driver ID',
    type: 'number',
    example: 123
  })
  @ApiOkResponse({ 
    description: 'Delivery person information retrieved successfully.',
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
  async findOne(@Param('id') id: string) {
    return this.deliverServiceService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Update a delivery person',
    description: 'Updates information for an existing delivery person. Only provided fields will be updated.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Delivery driver ID',
    type: 'number',
    example: 123
  })
  @ApiBody({ 
    type: UpdateDeliveryPersonDto,
    description: 'Fields to update for the delivery person'
  })
  @ApiOkResponse({ 
    description: 'The delivery person has been successfully updated.',
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
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDeliveryPersonDto,
  ) {
    return this.deliverServiceService.update(+id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete a delivery person',
    description: 'Permanently removes a delivery person from the system.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Delivery driver ID',
    type: 'number',
    example: 123
  })
  @ApiNoContentResponse({ description: 'The delivery person has been successfully deleted.' })
  @ApiNotFoundResponse({ description: 'Delivery driver with the specified ID was not found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.deliverServiceService.remove(+id);
  }

  @Get(':id/orders')
  @ApiOperation({ 
    summary: 'Get orders for a delivery person',
    description: 'Retrieves all orders assigned to a specific delivery person.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Delivery driver ID',
    type: 'number',
    example: 123
  })
  @ApiOkResponse({ 
    description: 'Delivery person orders retrieved successfully.',
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
  async findOrders(@Param('id') id: string) {
    return this.deliverServiceService.findOrders(+id);
  }
}
