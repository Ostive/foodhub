import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { RestaurantService } from './restaurant-service.service';
import { DishService } from './dish/dish.service';
import { MenuService } from './menu/menu.service';
import { CreateDishDto, UpdateDishDto, FilterDishDto, SearchDishDto } from './dto/dish';
import { MenuItemDto, AddDishesToMenuDto, FilterMenuDto, SearchMenuDto } from './dto/menu';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { SearchRestaurantDto } from './dto/search-restaurant.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantServiceController {
  constructor(
    private readonly restaurantServiceService: RestaurantService,
    private readonly menuService: MenuService,
    private readonly dishService: DishService
  ) {}

  @ApiOperation({ summary: 'Get all restaurants' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns all restaurants',
    schema: {
      type: 'array',
      items: {
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'Pizza Palace' },
          address: { type: 'string', example: '123 Food Street, Paris' },
          email: { type: 'string', example: 'contact@pizzapalace.com' }
        }
      }
    }
  })
  @Get()
  findAll() {
    return this.restaurantServiceService.findAll();
  }
  
  @ApiOperation({ summary: 'Search restaurants by name, cuisine, or location' })
  @ApiQuery({ name: 'name', required: false, description: 'Restaurant name to search for', type: String })
  @ApiQuery({ name: 'cuisine', required: false, description: 'Cuisine type to search for', type: String })
  @ApiQuery({ name: 'location', required: false, description: 'Location or address to search for', type: String })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns restaurants matching search criteria',
    schema: {
      type: 'array',
      items: {
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'Pizza Palace' },
          address: { type: 'string', example: '123 Food Street, Paris' },
          email: { type: 'string', example: 'contact@pizzapalace.com' }
        }
      }
    }
  })
  @Get('search')
  searchRestaurants(@Query() searchParams: SearchRestaurantDto) {
    return this.restaurantServiceService.searchRestaurants(searchParams);
  }

  @ApiOperation({ summary: 'Create a new restaurant' })
  @ApiBody({ type: CreateRestaurantDto })
  @ApiResponse({ status: 201, description: 'Restaurant successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @Post()
  createRestaurant(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantServiceService.createRestaurant(createRestaurantDto);
  }

  @ApiOperation({ summary: 'Update restaurant information' })
  @ApiParam({ name: 'id', description: 'Restaurant ID', type: 'number' })
  @ApiBody({ type: UpdateRestaurantDto })
  @ApiResponse({ status: 200, description: 'Restaurant successfully updated' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  @Put(':id')
  updateRestaurant(@Param('id') id: number, @Body() updateRestaurantDto: UpdateRestaurantDto) {
    return this.restaurantServiceService.updateRestaurant(id, updateRestaurantDto);
  }

  @ApiOperation({ summary: 'Get restaurant by ID' })
  @ApiParam({ name: 'id', description: 'Restaurant ID', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns restaurant details',
    schema: {
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Pizza Palace' },
        address: { type: 'string', example: '123 Food Street, Paris' },
        email: { type: 'string', example: 'contact@pizzapalace.com' },
        phone: { type: 'string', example: '+33123456789' },
        tags: { type: 'array', items: { type: 'string' }, example: ['Italian', 'Pizza'] }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  @Get(':id')
  getRestaurantById(
    @Param('id') id: number
  ) {
    return this.restaurantServiceService.findOne(id);
  }


  @ApiOperation({ summary: 'Get all dishes for a restaurant' })
  @ApiParam({ name: 'restaurantId', description: 'Restaurant ID', type: 'string' })
  @ApiQuery({ name: 'category', description: 'Filter by category', required: false, type: 'string' })
  @ApiQuery({ name: 'price', description: 'Filter by price', required: false, type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns all dishes for the restaurant',
    schema: {
      type: 'array',
      items: {
        properties: {
          id: { type: 'string', example: '1' },
          name: { type: 'string', example: 'Margherita Pizza' },
          description: { type: 'string', example: 'Classic Italian pizza with tomato sauce and mozzarella' },
          price: { type: 'number', example: 12.99 },
          category: { type: 'string', example: 'Pizza' }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  @Get(':restaurantId/dishes')
  getAllDishes(
    @Param('restaurantId') restaurantId: string,
    @Query() filterDto: FilterDishDto
  ) {
    return this.dishService.findAllDishes(restaurantId, filterDto);
  }

  @ApiOperation({ summary: 'Search dishes by name or description' })
  @ApiParam({ name: 'restaurantId', description: 'Restaurant ID', type: 'string' })
  @ApiQuery({ name: 'term', description: 'Search term', required: true, type: 'string' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns dishes matching search criteria',
    schema: {
      type: 'array',
      items: {
        properties: {
          id: { type: 'string', example: '1' },
          name: { type: 'string', example: 'Margherita Pizza' },
          description: { type: 'string', example: 'Classic Italian pizza with tomato sauce and mozzarella' },
          price: { type: 'number', example: 12.99 }
        }
      }
    }
  })
  @Get(':restaurantId/dishes/search')
  searchDishes(
    @Param('restaurantId') restaurantId: string,
    @Query() searchDto: SearchDishDto
  ) {
    return this.dishService.searchDishes(restaurantId, searchDto);
  }

  // Dish management endpoints
  @ApiOperation({ summary: 'Create a new dish' })
  @ApiParam({ name: 'restaurantId', description: 'Restaurant ID', type: 'string' })
  @ApiBody({ type: CreateDishDto })
  @ApiResponse({ status: 201, description: 'Dish successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  @Post(':restaurantId/dishes')
  createDish(
    @Param('restaurantId') restaurantId: string,
    @Body() createDishDto: CreateDishDto
  ) {
    return this.dishService.createDish(restaurantId, createDishDto);
  }

  @ApiOperation({ summary: 'Update an existing dish' })
  @ApiParam({ name: 'restaurantId', description: 'Restaurant ID', type: 'string' })
  @ApiParam({ name: 'dishId', description: 'Dish ID', type: 'string' })
  @ApiBody({ type: UpdateDishDto })
  @ApiResponse({ status: 200, description: 'Dish successfully updated' })
  @ApiResponse({ status: 404, description: 'Restaurant or dish not found' })
  @Put(':restaurantId/dishes/:dishId')
  updateDish(
    @Param('restaurantId') restaurantId: string,
    @Param('dishId') dishId: string,
    @Body() updateDishDto: UpdateDishDto
  ) {
    return this.dishService.updateDish(restaurantId, dishId, updateDishDto);
  }

  @ApiOperation({ summary: 'Delete a dish' })
  @ApiParam({ name: 'restaurantId', description: 'Restaurant ID', type: 'string' })
  @ApiParam({ name: 'dishId', description: 'Dish ID', type: 'string' })
  @ApiResponse({ status: 200, description: 'Dish successfully deleted' })
  @ApiResponse({ status: 404, description: 'Restaurant or dish not found' })
  @Delete(':restaurantId/dishes/:dishId')
  deleteDish(
    @Param('restaurantId') restaurantId: string,
    @Param('dishId') dishId: string
  ) {
    return this.dishService.deleteDish(restaurantId, dishId);
  }

  @ApiOperation({ summary: 'Get dish by ID' })
  @ApiParam({ name: 'restaurantId', description: 'Restaurant ID', type: 'string' })
  @ApiParam({ name: 'dishId', description: 'Dish ID', type: 'string' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns dish details',
    schema: {
      properties: {
        id: { type: 'string', example: '1' },
        name: { type: 'string', example: 'Margherita Pizza' },
        description: { type: 'string', example: 'Classic Italian pizza with tomato sauce and mozzarella' },
        price: { type: 'number', example: 12.99 },
        category: { type: 'string', example: 'Pizza' },
        ingredients: { type: 'array', items: { type: 'string' }, example: ['Tomato Sauce', 'Mozzarella', 'Basil'] }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Restaurant or dish not found' })
  @Get(':restaurantId/dishes/:dishId')
  getDishById(
    @Param('restaurantId') restaurantId: string,
    @Param('dishId') dishId: string
  ) {
    return this.dishService.findOneDish(restaurantId, dishId);
  }
  
 
  // Menu management endpoints
  @ApiOperation({ summary: 'Create a new menu item' })
  @ApiParam({ name: 'restaurantId', description: 'Restaurant ID', type: 'string' })
  @ApiBody({ type: MenuItemDto })
  @ApiResponse({ status: 201, description: 'Menu item successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  @Post(':restaurantId/menu')
  createMenuItem(
    @Param('restaurantId') restaurantId: string,
    @Body() menuItemDto: MenuItemDto
  ) {
    return this.menuService.addMenuItem(restaurantId, menuItemDto);
  }

  @ApiOperation({ summary: 'Update an existing menu item' })
  @ApiParam({ name: 'restaurantId', description: 'Restaurant ID', type: 'string' })
  @ApiParam({ name: 'menuId', description: 'Menu ID', type: 'string' })
  @ApiBody({ type: MenuItemDto })
  @ApiResponse({ status: 200, description: 'Menu item successfully updated' })
  @ApiResponse({ status: 404, description: 'Restaurant or menu item not found' })
  @Put(':restaurantId/menu/:menuId')
  updateMenuItem(
    @Param('restaurantId') restaurantId: string,
    @Param('menuId') menuId: string,
    @Body() menuItemDto: MenuItemDto
  ) {
    return this.menuService.updateMenuItem(restaurantId, menuId, menuItemDto);
  }

  @ApiOperation({ summary: 'Delete a menu item' })
  @ApiParam({ name: 'restaurantId', description: 'Restaurant ID', type: 'string' })
  @ApiParam({ name: 'menuId', description: 'Menu ID', type: 'string' })
  @ApiResponse({ status: 200, description: 'Menu item successfully deleted' })
  @ApiResponse({ status: 404, description: 'Restaurant or menu item not found' })
  @Delete(':restaurantId/menu/:menuId')
  deleteMenuItem(
    @Param('restaurantId') restaurantId: string,
    @Param('menuId') menuId: string
  ) {
    return this.menuService.deleteMenuItem(restaurantId, menuId);
  }

  @ApiOperation({ summary: 'Get menu item by ID' })
  @ApiParam({ name: 'restaurantId', description: 'Restaurant ID', type: 'string' })
  @ApiParam({ name: 'menuId', description: 'Menu ID', type: 'string' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns menu item details',
    schema: {
      properties: {
        id: { type: 'string', example: '1' },
        name: { type: 'string', example: 'Lunch Special' },
        description: { type: 'string', example: 'Weekday lunch menu with special pricing' },
        price: { type: 'number', example: 15.99 },
        dishes: { 
          type: 'array', 
          items: { 
            properties: {
              id: { type: 'string' },
              name: { type: 'string' }
            }
          } 
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Restaurant or menu item not found' })
  @Get(':restaurantId/menu/:menuId')
  getMenuById(
    @Param('restaurantId') restaurantId: string,
    @Param('menuId') menuId: string
  ) {
    return this.menuService.findOneMenuItem(restaurantId, menuId);
  }

  @ApiOperation({ summary: 'Get dishes for a specific menu' })
  @ApiParam({ name: 'restaurantId', description: 'Restaurant ID', type: 'string' })
  @ApiParam({ name: 'menuId', description: 'Menu ID', type: 'string' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns dishes for the specified menu',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Dishes retrieved successfully' },
        count: { type: 'number', example: 3 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
        totalPages: { type: 'number', example: 1 },
        hasNext: { type: 'boolean', example: false },
        hasPrevious: { type: 'boolean', example: false },
        dishes: {
          type: 'array',
          items: {
            properties: {
              dishId: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Margherita Pizza' },
              description: { type: 'string', example: 'Classic Italian pizza with tomato sauce and mozzarella' },
              cost: { type: 'number', example: 12.99 },
              picture: { type: 'string', example: 'https://cdn-icons-png.flaticon.com/512/857/857681.png' },
              category: { type: 'string', example: 'Pizza' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Restaurant or menu not found' })
  @Get(':restaurantId/menu/:menuId/dishes')
  getMenuDishes(
    @Param('restaurantId') restaurantId: string,
    @Param('menuId') menuId: string
  ) {
    return this.menuService.findMenuDishes(restaurantId, menuId);
  }

  @ApiOperation({ summary: 'Search menus by name or description' })
  @ApiParam({ name: 'restaurantId', description: 'Restaurant ID', type: 'string' })
  @ApiQuery({ name: 'term', description: 'Search term', required: true, type: 'string' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns menus matching search criteria',
    schema: {
      type: 'array',
      items: {
        properties: {
          id: { type: 'string', example: '1' },
          name: { type: 'string', example: 'Lunch Special' },
          description: { type: 'string', example: 'Weekday lunch menu with special pricing' }
        }
      }
    }
  })
  @Get(':restaurantId/menu/search')
  searchMenus(
    @Param('restaurantId') restaurantId: string,
    @Query() searchDto: SearchMenuDto
  ) {
    return this.menuService.searchMenus(restaurantId, searchDto);
  }
  
  @ApiOperation({ summary: 'Get all menu items for a restaurant' })
  @ApiParam({ name: 'restaurantId', description: 'Restaurant ID', type: 'string' })
  @ApiQuery({ name: 'type', description: 'Filter by menu type', required: false, type: 'string' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns all menu items for the restaurant',
    schema: {
      type: 'array',
      items: {
        properties: {
          id: { type: 'string', example: '1' },
          name: { type: 'string', example: 'Lunch Special' },
          description: { type: 'string', example: 'Weekday lunch menu with special pricing' },
          price: { type: 'number', example: 15.99 },
          type: { type: 'string', example: 'lunch' }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  @Get(':restaurantId/menu')
  getAllMenuItems(
    @Param('restaurantId') restaurantId: string,
    @Query() filterDto: FilterMenuDto
  ) {
    return this.menuService.getAllMenuItems(restaurantId, filterDto);
  }
  
  // Menu-Dish relationship endpoints
  @ApiOperation({ summary: 'Add dishes to a menu' })
  @ApiParam({ name: 'restaurantId', description: 'Restaurant ID', type: 'string' })
  @ApiParam({ name: 'menuId', description: 'Menu ID', type: 'string' })
  @ApiBody({ type: AddDishesToMenuDto })
  @ApiResponse({ status: 200, description: 'Dishes successfully added to menu' })
  @ApiResponse({ status: 404, description: 'Restaurant, menu or dish not found' })
  @Post(':restaurantId/menu/:menuId/dishes')
  addDishesToMenu(
    @Param('restaurantId') restaurantId: string,
    @Param('menuId') menuId: string,
    @Body() addDishesDto: AddDishesToMenuDto
  ) {
    return this.menuService.addDishesToMenu(restaurantId, menuId, addDishesDto);
  }

  @ApiOperation({ summary: 'Remove a dish from a menu' })
  @ApiParam({ name: 'restaurantId', description: 'Restaurant ID', type: 'string' })
  @ApiParam({ name: 'menuId', description: 'Menu ID', type: 'string' })
  @ApiParam({ name: 'dishId', description: 'Dish ID', type: 'string' })
  @ApiResponse({ status: 200, description: 'Dish successfully removed from menu' })
  @ApiResponse({ status: 404, description: 'Restaurant, menu or dish not found' })
  @Delete(':restaurantId/menu/:menuId/dishes/:dishId')
  removeDishFromMenu(
    @Param('restaurantId') restaurantId: string,
    @Param('menuId') menuId: string,
    @Param('dishId') dishId: string
  ) {
    return this.menuService.removeDishFromMenu(restaurantId, menuId, dishId);
  }
}
