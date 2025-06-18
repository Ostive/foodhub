import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users-service.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CreateDeliveryPersonDto } from './dto/create-delivery_person.dto';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto, description: 'User data' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Create a new customer user' })
  @ApiBody({ type: CreateCustomerDto, description: 'Customer data' })
  @ApiResponse({ status: 201, description: 'Customer successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('customer')
  createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return this.usersService.createCustomer(createCustomerDto);
  }

  @ApiOperation({ summary: 'Create a new delivery person user' })
  @ApiBody({ type: CreateDeliveryPersonDto, description: 'Delivery person data' })
  @ApiResponse({ status: 201, description: 'Delivery person successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('delivery-person')
  createDeliveryPerson(@Body() createDeliveryPersonDto: CreateDeliveryPersonDto) {
    return this.usersService.createDeliveryPerson(createDeliveryPersonDto);
  }

  @ApiOperation({ summary: 'Create a new restaurant user' })
  @ApiBody({ type: CreateRestaurantDto, description: 'Restaurant user data' })
  @ApiResponse({ status: 201, description: 'Restaurant user successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('restaurant')
  createRestaurant(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.usersService.createRestaurant(createRestaurantDto);
  }

  @ApiOperation({ summary: 'Create a new developer user' })
  @ApiBody({ type: CreateDeveloperDto, description: 'Developer user data' })
  @ApiResponse({ status: 201, description: 'Developer user successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('developer')
  createDeveloper(@Body() createDeveloperDto: CreateDeveloperDto) {
    return this.usersService.createDeveloper(createDeveloperDto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Returns all users' })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Find a user by email' })
  @ApiParam({ name: 'email', description: 'User email address', example: 'user@example.com' })
  @ApiResponse({ status: 200, description: 'Returns the user with the specified email' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @ApiOperation({ summary: 'Find a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Returns the user with the specified ID' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'User ID', example: '1' })
  @ApiBody({ type: UpdateUserDto, description: 'Updated user data' })
  @ApiResponse({ status: 200, description: 'User successfully updated' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User ID', example: '1' })
  @ApiResponse({ status: 200, description: 'User successfully deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
