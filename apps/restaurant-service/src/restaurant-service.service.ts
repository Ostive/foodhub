import { Injectable, ValidationPipe, UsePipes } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import * as bcrypt from 'bcrypt';


@Injectable()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

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

  async updateRestaurant(id: number, updateRestaurantDto: UpdateRestaurantDto) {
    const restaurant = await this.restaurantRepository.findOne({ where: { id } });

    if (!restaurant) {
      throw new Error(`Restaurant with ID ${id} not found`);
    }
            
    // If password is being updated, hash it
    if ('password' in updateRestaurantDto && updateRestaurantDto.password) {
      const hashedPassword = await bcrypt.hash(updateRestaurantDto.password as string, 10);
      updateRestaurantDto = { ...updateRestaurantDto, password: hashedPassword };
    }
        
    // Update restaurant
    await this.restaurantRepository.update(id, updateRestaurantDto);
        
    // Return updated restaurant
    const updatedRestaurant = await this.restaurantRepository.findOne({ where: { id } });
    if (!updatedRestaurant) {
      throw new Error(`Restaurant with ID ${id} not found after update`);
    }
    const { password, ...restaurantWithoutPassword } = updatedRestaurant;
    return restaurantWithoutPassword as Restaurant;
  }

  getRestaurantById(id: string) {
    // Implementation will go here
    return { message: 'Restaurant retrieved', id };
  }

  getAllRestaurants() {
    // Implementation will go here
    return { message: 'All restaurants retrieved', restaurants: [] };
  }

  getRestaurantsByCategory(category: string) {
    // Implementation will go here
    return { message: 'Restaurants by category retrieved', category, restaurants: [] };
  }
}
