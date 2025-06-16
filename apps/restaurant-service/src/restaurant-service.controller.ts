import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { RestaurantServiceService } from './restaurant-service.service';
import { MenuService } from './menu/menu.service';
import { DishService } from './dish/dish.service';
import { CreateRestaurantDto, UpdateRestaurantDto } from './dto/restaurant';
import { MenuItemDto } from './dto/menu';
import { CreateDishDto, UpdateDishDto } from './dto/dish';

@Controller('restaurants')
export class RestaurantServiceController {
  constructor(
    private readonly restaurantServiceService: RestaurantServiceService,
    private readonly menuService: MenuService,
    private readonly dishService: DishService
  ) {}

  @Get()
  getHello(): string {
    return this.restaurantServiceService.getHello();
  }

  @Post()
  createRestaurant(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantServiceService.createRestaurant(createRestaurantDto);
  }

  @Put(':id')
  updateRestaurant(@Param('id') id: string, @Body() updateRestaurantDto: UpdateRestaurantDto) {
    return this.restaurantServiceService.updateRestaurant(id, updateRestaurantDto);
  }

  @Post(':id/menu')
  addMenuItem(@Param('id') id: string, @Body() menuItemDto: MenuItemDto) {
    return this.menuService.addMenuItem(id, menuItemDto);
  }

  @Get(':id')
  getRestaurantById(@Param('id') id: string) {
    return this.restaurantServiceService.getRestaurantById(id);
  }

  // Dish management endpoints
  @Post(':restaurantId/dishes')
  createDish(
    @Param('restaurantId') restaurantId: string,
    @Body() createDishDto: CreateDishDto
  ) {
    return this.dishService.createDish(restaurantId, createDishDto);
  }

  @Put(':restaurantId/dishes/:dishId')
  updateDish(
    @Param('restaurantId') restaurantId: string,
    @Param('dishId') dishId: string,
    @Body() updateDishDto: UpdateDishDto
  ) {
    return this.dishService.updateDish(restaurantId, dishId, updateDishDto);
  }

  @Delete(':restaurantId/dishes/:dishId')
  deleteDish(
    @Param('restaurantId') restaurantId: string,
    @Param('dishId') dishId: string
  ) {
    return this.dishService.deleteDish(restaurantId, dishId);
  }

  @Get(':restaurantId/dishes/:dishId')
  getDishById(
    @Param('restaurantId') restaurantId: string,
    @Param('dishId') dishId: string
  ) {
    return this.dishService.getDishById(restaurantId, dishId);
  }

  @Get(':restaurantId/dishes')
  getAllDishes(
    @Param('restaurantId') restaurantId: string,
    @Query('category') category?: string
  ) {
    if (category) {
      return this.dishService.getDishesByCategory(restaurantId, category);
    }
    return this.dishService.getAllDishes(restaurantId);
  }
}
