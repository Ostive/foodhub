import { Injectable, ValidationPipe, UsePipes } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import * as bcrypt from 'bcrypt';


@Injectable()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {

  }
  getHello(): string {
    return 'Hello World!';
  }

async createRestaurant(createRestaurantDto: CreateRestaurantDto) {
    const hashedPassword = await bcrypt.hash(createRestaurantDto.password, 10);
        
        // Create new user with hashed password
        const newUser = this.restaurantRepository.create({
          ...createRestaurantDto,
          password: hashedPassword,
        });
        
        // Save and return the user (without the password)
        const savedUser = await this.restaurantRepository.save(newUser);
        const { password, ...userWithoutPassword } = savedUser;
        return userWithoutPassword as Restaurant;
  }

  updateRestaurant(id: string, updateRestaurantDto: UpdateRestaurantDto) {
    // Implementation will go here
    return { message: 'Restaurant updated', id, updates: updateRestaurantDto };
  }

  addMenuItem(restaurantId: string, menuItemDto: MenuItemDto) {
    // Implementation will go here
    return { message: 'Menu item added', restaurantId, item: menuItemDto };
  }

  getRestaurantById(id: string) {
    // Implementation will go here
    return { message: 'Restaurant retrieved', id };
  }
}
