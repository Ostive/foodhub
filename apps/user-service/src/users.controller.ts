import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CreateDeliveryPersonDto } from './dto/create-delivery_person.dto';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { User } from '@app/database/entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('customer')
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto): Promise<User> {
    return this.usersService.createCustomer(createCustomerDto);
  }

  @Post('delivery-person')
  async createDeliveryPerson(@Body() createDeliveryPersonDto: CreateDeliveryPersonDto): Promise<User> {
    return this.usersService.createDeliveryPerson(createDeliveryPersonDto);
  }

  @Post('restaurant')
  async createRestaurant(@Body() createRestaurantDto: CreateRestaurantDto): Promise<User> {
    return this.usersService.createRestaurant(createRestaurantDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(Number(id));
  }
}
