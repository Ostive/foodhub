import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { RestaurantServiceService } from './restaurant-service.service';
import { CreateRestaurantDto, MenuItemDto, UpdateRestaurantDto } from './dto/restaurant.dto';

@Controller('restaurants')
export class RestaurantServiceController {
  constructor(private readonly restaurantServiceService: RestaurantServiceService) {}

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
    return this.restaurantServiceService.addMenuItem(id, menuItemDto);
  }

  @Get(':id')
  getRestaurantById(@Param('id') id: string) {
    return this.restaurantServiceService.getRestaurantById(id);
  }
}
