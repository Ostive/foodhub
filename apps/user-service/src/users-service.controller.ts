import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users-service.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CreateDeliveryPersonDto } from './dto/create-delivery_person.dto';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('customer')
  createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return this.usersService.createCustomer(createCustomerDto);
  }

  @Post('delivery-person')
  createDeliveryPerson(@Body() createDeliveryPersonDto: CreateDeliveryPersonDto) {
    return this.usersService.createDeliveryPerson(createDeliveryPersonDto);
  }

  @Post('restaurant')
  createRestaurant(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.usersService.createRestaurant(createRestaurantDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
