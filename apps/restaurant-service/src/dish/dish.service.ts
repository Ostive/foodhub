import { Injectable, ValidationPipe, UsePipes, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateDishDto, UpdateDishDto } from '../dto/dish';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dish } from '../../../../libs/database/entities/dish.entity';
import { User } from '../../../../libs/database/entities/user.entity';

@Injectable()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class DishService {

  constructor(
    @InjectRepository(Dish)
    private dishRepository: Repository<Dish>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createDish(restaurantId: string, createDishDto: CreateDishDto) {
    // Check if restaurant exists
    const restaurant = await this.userRepository.findOne({
      where: { userId: parseInt(restaurantId), role: 'restaurant' },
    });
    
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${restaurantId} not found`);
    }

    // Create new dish entity
    const dish = this.dishRepository.create({
      ...createDishDto,
      user: restaurant,
    });

    // Save dish to database
    const savedDish = await this.dishRepository.save(dish);
    
    // Format the response
    const { user, ...dishWithoutFullUser } = savedDish;
    
    return { 
      success: true,
      message: 'Dish created successfully', 
      dish: {
        ...dishWithoutFullUser,
        restaurant: {
          id: user.userId,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email
        }
      }
    };
  }

  async findAllDishes(restaurantId: string) {
    // Check if restaurant exists
    const restaurant = await this.userRepository.findOne({
      where: { userId: parseInt(restaurantId), role: 'restaurant' },
    });
    
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${restaurantId} not found`);
    }

    // Find all dishes for the restaurant
    const dishes = await this.dishRepository.find({
      where: { user: { userId: parseInt(restaurantId) } },
      relations: ['user'],
    });
    
    // Format the response
    const formattedDishes = dishes.map(dish => {
      const { user, ...dishWithoutFullUser } = dish;
      return {
        ...dishWithoutFullUser,
        restaurant: {
          id: user.userId,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email
        }
      };
    });

    return { 
      success: true,
      message: 'Dishes retrieved successfully', 
      count: dishes.length,
      dishes: formattedDishes
    };
  }

  async findOneDish(restaurantId: string, dishId: string) {
    // Check if restaurant exists
    const restaurant = await this.userRepository.findOne({
      where: { userId: parseInt(restaurantId), role: 'restaurant' },
    });
    
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${restaurantId} not found`);
    }

    // Find the specific dish for the restaurant
    const dish = await this.dishRepository.findOne({
      where: { dishId: parseInt(dishId), user: { userId: parseInt(restaurantId) } },
      relations: ['user'],
    });

    if (!dish) {
      throw new NotFoundException(`Dish with ID ${dishId} not found for restaurant ${restaurantId}`);
    }
    
    // Format the response
    const { user, ...dishWithoutFullUser } = dish;

    return { 
      success: true,
      message: 'Dish retrieved successfully', 
      dish: {
        ...dishWithoutFullUser,
        restaurant: {
          id: user.userId,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email
        }
      }
    };
  }

  async updateDish(restaurantId: string, dishId: string, updateDishDto: UpdateDishDto) {
    // Check if restaurant exists
    const restaurant = await this.userRepository.findOne({
      where: { userId: parseInt(restaurantId), role: 'restaurant' },
    });
    
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${restaurantId} not found`);
    }

    // Check if dish exists and belongs to the restaurant
    const dish = await this.dishRepository.findOne({
      where: { dishId: parseInt(dishId), user: { userId: parseInt(restaurantId) } },
      relations: ['user'],
    });

    if (!dish) {
      throw new NotFoundException(`Dish with ID ${dishId} not found for restaurant ${restaurantId}`);
    }

    // Update dish properties
    Object.assign(dish, updateDishDto);

    // Save updated dish
    const updatedDish = await this.dishRepository.save(dish);
    
    // Format the response
    const { user, ...dishWithoutFullUser } = updatedDish;
    
    return { 
      success: true,
      message: 'Dish updated successfully', 
      dish: {
        ...dishWithoutFullUser,
        restaurant: {
          id: user.userId,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email
        }
      }
    };
  }

  async deleteDish(restaurantId: string, dishId: string) {
    // Check if restaurant exists
    const restaurant = await this.userRepository.findOne({
      where: { userId: parseInt(restaurantId), role: 'restaurant' },
    });
    
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${restaurantId} not found`);
    }

    // Check if dish exists and belongs to the restaurant
    const dish = await this.dishRepository.findOne({
      where: { dishId: parseInt(dishId), user: { userId: parseInt(restaurantId) } },
      relations: ['user'],
    });

    if (!dish) {
      throw new NotFoundException(`Dish with ID ${dishId} not found for restaurant ${restaurantId}`);
    }
    
    // Store dish info before deletion for response
    const dishInfo = {
      id: dish.dishId,
      name: dish.name,
      restaurant: {
        id: dish.user.userId,
        name: `${dish.user.firstName} ${dish.user.lastName}`
      }
    };

    // Delete the dish
    await this.dishRepository.remove(dish);

    return { 
      success: true,
      message: 'Dish deleted successfully',
      dish: dishInfo
    };
  }
}
