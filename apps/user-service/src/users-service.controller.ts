import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { UsersService } from './users-service.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CreateDeliveryPersonDto } from './dto/create-delivery_person.dto';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { CreateManagerDto } from './dto/create-manager.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
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
  @Post('customers')
  createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return this.usersService.createCustomer(createCustomerDto);
  }

  @ApiOperation({ summary: 'Create a new delivery person user' })
  @ApiBody({ type: CreateDeliveryPersonDto, description: 'Delivery person data' })
  @ApiResponse({ status: 201, description: 'Delivery person successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('delivery-persons')
  createDeliveryPerson(@Body() createDeliveryPersonDto: CreateDeliveryPersonDto) {
    return this.usersService.createDeliveryPerson(createDeliveryPersonDto);
  }

  @ApiOperation({ summary: 'Create a new restaurant user' })
  @ApiBody({ type: CreateRestaurantDto, description: 'Restaurant user data' })
  @ApiResponse({ status: 201, description: 'Restaurant user successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('restaurants')
  createRestaurant(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.usersService.createRestaurant(createRestaurantDto);
  }

  @ApiOperation({ summary: 'Create a new developer user' })
  @ApiBody({ type: CreateDeveloperDto, description: 'Developer user data' })
  @ApiResponse({ status: 201, description: 'Developer user successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('developers')
  createDeveloper(@Body() createDeveloperDto: CreateDeveloperDto) {
    return this.usersService.createDeveloper(createDeveloperDto);
  }

  @ApiOperation({ summary: 'Create a new manager user' })
  @ApiBody({ type: CreateManagerDto, description: 'Manager user data' })
  @ApiResponse({ status: 201, description: 'Manager user successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('managers')
  createManager(@Body() createManagerDto: CreateManagerDto) {
    return this.usersService.createManager(createManagerDto);
  }

  @ApiOperation({ summary: 'Create a new admin user' })
  @ApiBody({ type: CreateAdminDto, description: 'Admin user data' })
  @ApiResponse({ status: 201, description: 'Admin user successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('admins')
  createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.usersService.createAdmin(createAdminDto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Returns all users' })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({ status: 200, description: 'Returns all customers' })
  @Get('customers')
  findAllCustomers() {
    return this.usersService.findAllByRole('customer');
  }
  
  @ApiOperation({ summary: 'Get all delivery persons' })
  @ApiResponse({ status: 200, description: 'Returns all delivery persons' })
  @Get('delivery-persons')
  findAllDeliveryPersons() {
    return this.usersService.findAllByRole('delivery_person');
  }
  
  @ApiOperation({ summary: 'Get all restaurants' })
  @ApiResponse({ status: 200, description: 'Returns all restaurants' })
  @Get('restaurants')
  findAllRestaurants() {
    return this.usersService.findAllByRole('restaurant');
  }
  
  @ApiOperation({ summary: 'Get all developers' })
  @ApiResponse({ status: 200, description: 'Returns all developers' })
  @Get('developers')
  findAllDevelopers() {
    return this.usersService.findAllByRole('developer');
  }
  
  @ApiOperation({ summary: 'Get all managers' })
  @ApiResponse({ status: 200, description: 'Returns all managers' })
  @Get('managers')
  findAllManagers() {
    return this.usersService.findAllByRole('manager');
  }
  
  @ApiOperation({ summary: 'Get all admins' })
  @ApiResponse({ status: 200, description: 'Returns all admins' })
  @Get('admins')
  findAllAdmins() {
    return this.usersService.findAllByRole('admin');
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
  @ApiResponse({ status: 400, description: 'Invalid ID format' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID format. Must be a number.');
    }
    return this.usersService.findOne(userId);
  }
  
  @ApiOperation({ summary: 'Find a customer by ID' })
  @ApiParam({ name: 'id', description: 'Customer ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Returns the customer with the specified ID' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiResponse({ status: 400, description: 'Invalid ID format or user is not a customer' })
  @Get('customers/:id')
  findCustomer(@Param('id') id: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID format. Must be a number.');
    }
    return this.usersService.findOneByRole(userId, 'customer');
  }
  
  @ApiOperation({ summary: 'Find a restaurant by ID' })
  @ApiParam({ name: 'id', description: 'Restaurant ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Returns the restaurant with the specified ID' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  @ApiResponse({ status: 400, description: 'Invalid ID format or user is not a restaurant' })
  @Get('restaurants/:id')
  findRestaurant(@Param('id') id: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID format. Must be a number.');
    }
    return this.usersService.findOneByRole(userId, 'restaurant');
  }
  
  @ApiOperation({ summary: 'Find a delivery person by ID' })
  @ApiParam({ name: 'id', description: 'Delivery person ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Returns the delivery person with the specified ID' })
  @ApiResponse({ status: 404, description: 'Delivery person not found' })
  @ApiResponse({ status: 400, description: 'Invalid ID format or user is not a delivery person' })
  @Get('delivery-persons/:id')
  findDeliveryPerson(@Param('id') id: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID format. Must be a number.');
    }
    return this.usersService.findOneByRole(userId, 'delivery_person');
  }
  
  @ApiOperation({ summary: 'Find a developer by ID' })
  @ApiParam({ name: 'id', description: 'Developer ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Returns the developer with the specified ID' })
  @ApiResponse({ status: 404, description: 'Developer not found' })
  @ApiResponse({ status: 400, description: 'Invalid ID format or user is not a developer' })
  @Get('developers/:id')
  findDeveloper(@Param('id') id: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID format. Must be a number.');
    }
    return this.usersService.findOneByRole(userId, 'developer');
  }
  
  @ApiOperation({ summary: 'Find a manager by ID' })
  @ApiParam({ name: 'id', description: 'Manager ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Returns the manager with the specified ID' })
  @ApiResponse({ status: 404, description: 'Manager not found' })
  @ApiResponse({ status: 400, description: 'Invalid ID format or user is not a manager' })
  @Get('managers/:id')
  findManager(@Param('id') id: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID format. Must be a number.');
    }
    return this.usersService.findOneByRole(userId, 'manager');
  }
  
  @ApiOperation({ summary: 'Find an admin by ID' })
  @ApiParam({ name: 'id', description: 'Admin ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Returns the admin with the specified ID' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  @ApiResponse({ status: 400, description: 'Invalid ID format or user is not an admin' })
  @Get('admins/:id')
  findAdmin(@Param('id') id: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID format. Must be a number.');
    }
    return this.usersService.findOneByRole(userId, 'admin');
  }

  @ApiOperation({ summary: 'Update a user (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID', example: '1' })
  @ApiBody({ type: UpdateUserDto, description: 'Updated user data' })
  @ApiResponse({ status: 200, description: 'User successfully updated' })
  @ApiResponse({ status: 400, description: 'Bad request or invalid ID format' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID format. Must be a number.');
    }
    return this.usersService.update(userId, updateUserDto);
  }
  
  @ApiOperation({ summary: 'Update a customer' })
  @ApiParam({ name: 'id', description: 'Customer ID', example: '1' })
  @ApiBody({ type: UpdateUserDto, description: 'Updated customer data' })
  @ApiResponse({ status: 200, description: 'Customer successfully updated' })
  @ApiResponse({ status: 400, description: 'Bad request or invalid ID format' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @Patch('customers/:id')
  updateCustomer(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID format. Must be a number.');
    }
    return this.usersService.updateByRole(userId, 'customer', updateUserDto);
  }
  
  @ApiOperation({ summary: 'Update a restaurant' })
  @ApiParam({ name: 'id', description: 'Restaurant ID', example: '1' })
  @ApiBody({ type: UpdateUserDto, description: 'Updated restaurant data' })
  @ApiResponse({ status: 200, description: 'Restaurant successfully updated' })
  @ApiResponse({ status: 400, description: 'Bad request or invalid ID format' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  @Patch('restaurants/:id')
  updateRestaurant(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID format. Must be a number.');
    }
    return this.usersService.updateByRole(userId, 'restaurant', updateUserDto);
  }
  
  @ApiOperation({ summary: 'Update a delivery person' })
  @ApiParam({ name: 'id', description: 'Delivery person ID', example: '1' })
  @ApiBody({ type: UpdateUserDto, description: 'Updated delivery person data' })
  @ApiResponse({ status: 200, description: 'Delivery person successfully updated' })
  @ApiResponse({ status: 400, description: 'Bad request or invalid ID format' })
  @ApiResponse({ status: 404, description: 'Delivery person not found' })
  @Patch('delivery-persons/:id')
  updateDeliveryPerson(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID format. Must be a number.');
    }
    return this.usersService.updateByRole(userId, 'delivery_person', updateUserDto);
  }

  @ApiOperation({ summary: 'Update a developer' })
  @ApiParam({ name: 'id', description: 'Developer ID', example: '1' })
  @ApiBody({ type: UpdateUserDto, description: 'Updated developer data' })
  @ApiResponse({ status: 200, description: 'Developer successfully updated' })
  @ApiResponse({ status: 400, description: 'Bad request or invalid ID format' })
  @ApiResponse({ status: 404, description: 'Developer not found' })
  @Patch('developers/:id')
  updateDeveloper(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID format. Must be a number.');
    }
    return this.usersService.updateByRole(userId, 'developer', updateUserDto);
  }

  @ApiOperation({ summary: 'Update a manager' })
  @ApiParam({ name: 'id', description: 'Manager ID', example: '1' })
  @ApiBody({ type: UpdateUserDto, description: 'Updated manager data' })
  @ApiResponse({ status: 200, description: 'Manager successfully updated' })
  @ApiResponse({ status: 400, description: 'Bad request or invalid ID format' })
  @ApiResponse({ status: 404, description: 'Manager not found' })
  @Patch('managers/:id')
  updateManager(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID format. Must be a number.');
    }
    return this.usersService.updateByRole(userId, 'manager', updateUserDto);
  }

  @ApiOperation({ summary: 'Update an admin' })
  @ApiParam({ name: 'id', description: 'Admin ID', example: '1' })
  @ApiBody({ type: UpdateUserDto, description: 'Updated admin data' })
  @ApiResponse({ status: 200, description: 'Admin successfully updated' })
  @ApiResponse({ status: 400, description: 'Bad request or invalid ID format' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  @Patch('admins/:id')
  updateAdmin(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID format. Must be a number.');
    }
    return this.usersService.updateByRole(userId, 'admin', updateUserDto);
  }

  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User ID', example: '1' })
  @ApiResponse({ status: 200, description: 'User successfully deleted' })
  @ApiResponse({ status: 400, description: 'Invalid ID format' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID format. Must be a number.');
    }
    return this.usersService.remove(userId);
  }

  @ApiOperation({ summary: 'Delete a customer' })
  @ApiParam({ name: 'id', description: 'Customer ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Customer successfully deleted' })
  @ApiResponse({ status: 400, description: 'Invalid ID format or user is not a customer' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @Delete('customers/:id')
  removeCustomer(@Param('id') id: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID format. Must be a number.');
    }
    return this.usersService.removeByRole(userId, 'customer');
  }

  @ApiOperation({ summary: 'Delete a restaurant' })
  @ApiParam({ name: 'id', description: 'Restaurant ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Restaurant successfully deleted' })
  @ApiResponse({ status: 400, description: 'Invalid ID format or user is not a restaurant' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  @Delete('restaurants/:id')
  removeRestaurant(@Param('id') id: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID format. Must be a number.');
    }
    return this.usersService.removeByRole(userId, 'restaurant');
  }

  @ApiOperation({ summary: 'Delete a delivery person' })
  @ApiParam({ name: 'id', description: 'Delivery person ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Delivery person successfully deleted' })
  @ApiResponse({ status: 400, description: 'Invalid ID format or user is not a delivery person' })
  @ApiResponse({ status: 404, description: 'Delivery person not found' })
  @Delete('delivery-persons/:id')
  removeDeliveryPerson(@Param('id') id: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID format. Must be a number.');
    }
    return this.usersService.removeByRole(userId, 'delivery_person');
  }

  @ApiOperation({ summary: 'Delete a developer' })
  @ApiParam({ name: 'id', description: 'Developer ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Developer successfully deleted' })
  @ApiResponse({ status: 400, description: 'Invalid ID format or user is not a developer' })
  @ApiResponse({ status: 404, description: 'Developer not found' })
  @Delete('developers/:id')
  removeDeveloper(@Param('id') id: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID format. Must be a number.');
    }
    return this.usersService.removeByRole(userId, 'developer');
  }

  @ApiOperation({ summary: 'Delete a manager' })
  @ApiParam({ name: 'id', description: 'Manager ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Manager successfully deleted' })
  @ApiResponse({ status: 400, description: 'Invalid ID format or user is not a manager' })
  @ApiResponse({ status: 404, description: 'Manager not found' })
  @Delete('managers/:id')
  removeManager(@Param('id') id: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID format. Must be a number.');
    }
    return this.usersService.removeByRole(userId, 'manager');
  }

  @ApiOperation({ summary: 'Delete an admin' })
  @ApiParam({ name: 'id', description: 'Admin ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Admin successfully deleted' })
  @ApiResponse({ status: 400, description: 'Invalid ID format or user is not an admin' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  @Delete('admins/:id')
  removeAdmin(@Param('id') id: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID format. Must be a number.');
    }
    return this.usersService.removeByRole(userId, 'admin');
  }

  // Soft Delete Endpoints
  @ApiOperation({ summary: 'Soft delete a user' })
  @ApiParam({ name: 'id', description: 'User ID', example: '1' })
  @ApiResponse({ status: 200, description: 'User successfully deactivated' })
  @ApiResponse({ status: 400, description: 'Invalid ID format' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Patch(':id/deactivate')
  softDelete(@Param('id') id: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID format. Must be a number.');
    }
    return this.usersService.softDelete(userId);
  }

  @ApiOperation({ summary: 'Soft delete a customer' })
  @ApiParam({ name: 'id', description: 'Customer ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Customer successfully deactivated' })
  @ApiResponse({ status: 400, description: 'Invalid ID format or user is not a customer' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @Patch('customers/:id/deactivate')
  softDeleteCustomer(@Param('id') id: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID format. Must be a number.');
    }
    return this.usersService.softDeleteByRole(userId, 'customer');
  }

  @ApiOperation({ summary: 'Soft delete a restaurant' })
  @ApiParam({ name: 'id', description: 'Restaurant ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Restaurant successfully deactivated' })
  @ApiResponse({ status: 400, description: 'Invalid ID format or user is not a restaurant' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  @Patch('restaurants/:id/deactivate')
  softDeleteRestaurant(@Param('id') id: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID format. Must be a number.');
    }
    return this.usersService.softDeleteByRole(userId, 'restaurant');
  }

  @ApiOperation({ summary: 'Soft delete a delivery person' })
  @ApiParam({ name: 'id', description: 'Delivery person ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Delivery person successfully deactivated' })
  @ApiResponse({ status: 400, description: 'Invalid ID format or user is not a delivery person' })
  @ApiResponse({ status: 404, description: 'Delivery person not found' })
  @Patch('delivery-persons/:id/deactivate')
  softDeleteDeliveryPerson(@Param('id') id: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID format. Must be a number.');
    }
    return this.usersService.softDeleteByRole(userId, 'delivery_person');
  }

  @ApiOperation({ summary: 'Soft delete a developer' })
  @ApiParam({ name: 'id', description: 'Developer ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Developer successfully deactivated' })
  @ApiResponse({ status: 400, description: 'Invalid ID format or user is not a developer' })
  @ApiResponse({ status: 404, description: 'Developer not found' })
  @Patch('developers/:id/deactivate')
  softDeleteDeveloper(@Param('id') id: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID format. Must be a number.');
    }
    return this.usersService.softDeleteByRole(userId, 'developer');
  }

  @ApiOperation({ summary: 'Soft delete a manager' })
  @ApiParam({ name: 'id', description: 'Manager ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Manager successfully deactivated' })
  @ApiResponse({ status: 400, description: 'Invalid ID format or user is not a manager' })
  @ApiResponse({ status: 404, description: 'Manager not found' })
  @Patch('managers/:id/deactivate')
  softDeleteManager(@Param('id') id: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID format. Must be a number.');
    }
    return this.usersService.softDeleteByRole(userId, 'manager');
  }

  @ApiOperation({ summary: 'Soft delete an admin' })
  @ApiParam({ name: 'id', description: 'Admin ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Admin successfully deactivated' })
  @ApiResponse({ status: 400, description: 'Invalid ID format or user is not an admin' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  @Patch('admins/:id/deactivate')
  softDeleteAdmin(@Param('id') id: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID format. Must be a number.');
    }
    return this.usersService.softDeleteByRole(userId, 'admin');
  }

  // Reactivation Endpoints
  @ApiOperation({ summary: 'Reactivate a user' })
  @ApiParam({ name: 'id', description: 'User ID', example: '1' })
  @ApiResponse({ status: 200, description: 'User successfully reactivated' })
  @ApiResponse({ status: 400, description: 'Invalid ID format' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Patch(':id/reactivate')
  reactivate(@Param('id') id: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID format. Must be a number.');
    }
    return this.usersService.reactivate(userId);
  }

  @ApiOperation({ summary: 'Reactivate a customer' })
  @ApiParam({ name: 'id', description: 'Customer ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Customer successfully reactivated' })
  @ApiResponse({ status: 400, description: 'Invalid ID format or user is not a customer' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @Patch('customers/:id/reactivate')
  reactivateCustomer(@Param('id') id: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID format. Must be a number.');
    }
    return this.usersService.reactivateByRole(userId, 'customer');
  }

  @ApiOperation({ summary: 'Reactivate a restaurant' })
  @ApiParam({ name: 'id', description: 'Restaurant ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Restaurant successfully reactivated' })
  @ApiResponse({ status: 400, description: 'Invalid ID format or user is not a restaurant' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  @Patch('restaurants/:id/reactivate')
  reactivateRestaurant(@Param('id') id: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID format. Must be a number.');
    }
    return this.usersService.reactivateByRole(userId, 'restaurant');
  }

  @ApiOperation({ summary: 'Reactivate a delivery person' })
  @ApiParam({ name: 'id', description: 'Delivery person ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Delivery person successfully reactivated' })
  @ApiResponse({ status: 400, description: 'Invalid ID format or user is not a delivery person' })
  @ApiResponse({ status: 404, description: 'Delivery person not found' })
  @Patch('delivery-persons/:id/reactivate')
  reactivateDeliveryPerson(@Param('id') id: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID format. Must be a number.');
    }
    return this.usersService.reactivateByRole(userId, 'delivery_person');
  }

  @ApiOperation({ summary: 'Reactivate a developer' })
  @ApiParam({ name: 'id', description: 'Developer ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Developer successfully reactivated' })
  @ApiResponse({ status: 400, description: 'Invalid ID format or user is not a developer' })
  @ApiResponse({ status: 404, description: 'Developer not found' })
  @Patch('developers/:id/reactivate')
  reactivateDeveloper(@Param('id') id: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID format. Must be a number.');
    }
    return this.usersService.reactivateByRole(userId, 'developer');
  }

  @ApiOperation({ summary: 'Reactivate a manager' })
  @ApiParam({ name: 'id', description: 'Manager ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Manager successfully reactivated' })
  @ApiResponse({ status: 400, description: 'Invalid ID format or user is not a manager' })
  @ApiResponse({ status: 404, description: 'Manager not found' })
  @Patch('managers/:id/reactivate')
  reactivateManager(@Param('id') id: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID format. Must be a number.');
    }
    return this.usersService.reactivateByRole(userId, 'manager');
  }

  @ApiOperation({ summary: 'Reactivate an admin' })
  @ApiParam({ name: 'id', description: 'Admin ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Admin successfully reactivated' })
  @ApiResponse({ status: 400, description: 'Invalid ID format or user is not an admin' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  @Patch('admins/:id/reactivate')
  reactivateAdmin(@Param('id') id: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID format. Must be a number.');
    }
    return this.usersService.reactivateByRole(userId, 'admin');
  }
}
