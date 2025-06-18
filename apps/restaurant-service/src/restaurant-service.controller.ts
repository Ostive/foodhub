import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { RestaurantService } from './restaurant-service.service';
import { DishService } from './dish/dish.service';
import { MenuService } from './menu/menu.service';
import { CreateDishDto, UpdateDishDto, FilterDishDto, SearchDishDto } from './dto/dish';
import { MenuItemDto, AddDishesToMenuDto, FilterMenuDto, SearchMenuDto } from './dto/menu';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

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

  @Get(':id')
  getRestaurantById(
    @Param('id') id: number
  ) {
    return this.restaurantServiceService.findOne(id);
  }


  @Get(':restaurantId/dishes')
  getAllDishes(
    @Param('restaurantId') restaurantId: string,
    @Query() filterDto: FilterDishDto
  ) {
    return this.dishService.findAllDishes(restaurantId, filterDto);
  }


  @Get(':restaurantId/dishes/search')
  searchDishes(
    @Param('restaurantId') restaurantId: string,
    @Query() searchDto: SearchDishDto
  ) {
    return this.dishService.searchDishes(restaurantId, searchDto);
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
    return this.dishService.findOneDish(restaurantId, dishId);
  }
  
 
  // Menu management endpoints
  @Post(':restaurantId/menu')
  createMenuItem(
    @Param('restaurantId') restaurantId: string,
    @Body() menuItemDto: MenuItemDto
  ) {
    return this.menuService.addMenuItem(restaurantId, menuItemDto);
  }

  @Put(':restaurantId/menu/:menuId')
  updateMenuItem(
    @Param('restaurantId') restaurantId: string,
    @Param('menuId') menuId: string,
    @Body() menuItemDto: MenuItemDto
  ) {
    return this.menuService.updateMenuItem(restaurantId, menuId, menuItemDto);
  }

  @Delete(':restaurantId/menu/:menuId')
  deleteMenuItem(
    @Param('restaurantId') restaurantId: string,
    @Param('menuId') menuId: string
  ) {
    return this.menuService.deleteMenuItem(restaurantId, menuId);
  }

  @Get(':restaurantId/menu/:menuId')
  getMenuItemById(
    @Param('restaurantId') restaurantId: string,
    @Param('menuId') menuId: string
  ) {
    return this.menuService.getMenuItemById(restaurantId, menuId);
  }

  @Get(':restaurantId/menu/search')
  searchMenus(
    @Param('restaurantId') restaurantId: string,
    @Query() searchDto: SearchMenuDto
  ) {
    return this.menuService.searchMenus(restaurantId, searchDto);
  }
  
  @Get(':restaurantId/menu')
  getAllMenuItems(
    @Param('restaurantId') restaurantId: string,
    @Query() filterDto: FilterMenuDto
  ) {
    return this.menuService.getAllMenuItems(restaurantId, filterDto);
  }
  
  // Menu-Dish relationship endpoints
  @Post(':restaurantId/menu/:menuId/dishes')
  addDishesToMenu(
    @Param('restaurantId') restaurantId: string,
    @Param('menuId') menuId: string,
    @Body() addDishesDto: AddDishesToMenuDto
  ) {
    return this.menuService.addDishesToMenu(restaurantId, menuId, addDishesDto);
  }

  @Delete(':restaurantId/menu/:menuId/dishes/:dishId')
  removeDishFromMenu(
    @Param('restaurantId') restaurantId: string,
    @Param('menuId') menuId: string,
    @Param('dishId') dishId: string
  ) {
    return this.menuService.removeDishFromMenu(restaurantId, menuId, dishId);
  }
}
