import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { RestaurantService } from './restaurant-service.service';
import { MenuService } from './menu/menu.service';
import { DishService } from './dish/dish.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { MenuItemDto } from './dto/menu';
import { CreateDishDto, UpdateDishDto } from './dto/dish';

@Controller('restaurants')
export class RestaurantServiceController {
  constructor(
    private readonly restaurantServiceService: RestaurantService,
    private readonly menuService: MenuService,
    private readonly dishService: DishService
  ) {}

  @Get()
  findAll() {
    return this.restaurantServiceService.findAll();
  }

  @Post()
  createRestaurant(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantServiceService.createRestaurant(createRestaurantDto);
  }

  @Put(':id')
  updateRestaurant(@Param('id') id: number, @Body() updateRestaurantDto: UpdateRestaurantDto) {
    return this.restaurantServiceService.updateRestaurant(id, updateRestaurantDto);
  }

  @Post(':id/menu')
  addMenuItem(@Param('id') id: string, @Body() menuItemDto: MenuItemDto) {
    return this.menuService.addMenuItem(id, menuItemDto);
  }

  @Get(':id')
  getRestaurantById(
    @Param('id') id: number
  ) {
    return this.restaurantServiceService.findOne(id);
  }

  // Dish management endpoints
  @Post(':restaurantId/dishes')
  createDish(
    @Body() createDishDto: CreateDishDto
  ) {
    return this.dishService.createDish( createDishDto);
  }

  @Put(':restaurantId/dishes/:dishId')
  updateDish(
    @Param('dishId') dishId: number,
    @Body() updateDishDto: UpdateDishDto
  ) {
    return this.dishService.updateDish(dishId, updateDishDto);
  }

  @Delete(':restaurantId/dishes/:dishId')
  deleteDish(
    @Param('dishId') dishId: number
  ) {
    return this.dishService.deleteDish(dishId);
  }

  @Get(':restaurantId/dishes/:dishId')
  getDishById(
    @Param('dishId') dishId: number
  ) {
    return this.dishService.findOne(dishId);
  }

  @Get(':restaurantId/dishes')
  getAllDishes(  ) {
    return this.dishService.findAllDishes();
  }
}
