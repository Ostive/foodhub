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

  async createDish(createDishDto: CreateDishDto) {
    // Verify the restaurant exists
    const restaurant = await this.userRepository.findOne({ 
      where: { 
        userId: parseInt(createDishDto.userId),
        role: 'restaurant'
      } 
    });
    
    if (!restaurant) {
      throw new BadRequestException(`Restaurant with ID ${createDishDto.userId} not found`);
    }

    // Create the dish with restaurant association
    const newDish = this.dishRepository.create({
      ...createDishDto,
      user: restaurant
    });
    
    // Save the dish to the database
    const savedDish = await this.dishRepository.save(newDish);
    
    return { 
      message: 'Dish created successfully', 
      dish: savedDish 
    };
  }

  async findAllDishes(restaurantId: string) {
    // Verify the restaurant exists
    const restaurant = await this.userRepository.findOne({ 
      where: { 
        userId: parseInt(restaurantId),
        role: 'restaurant'
      } 
    });
    
    if (!restaurant) {
      throw new BadRequestException(`Restaurant with ID ${restaurantId} not found`);
    }

    // Find all dishes for this restaurant
    const dishes = await this.dishRepository.find({
      where: { user: { userId: parseInt(restaurantId) } },
      relations: ['user']
    });

    return { 
      message: 'All dishes retrieved successfully', 
      dishes 
    };
  }

  async findOne(restaurantId: string, dishId: number) {
    // Verify the restaurant exists
    const restaurant = await this.userRepository.findOne({ 
      where: { 
        userId: parseInt(restaurantId),
        role: 'restaurant'
      } 
    });
    
    if (!restaurant) {
      throw new BadRequestException(`Restaurant with ID ${restaurantId} not found`);
    }

    // Find the dish for this restaurant
    const dish = await this.dishRepository.findOne({
      where: { 
        dishId,
        user: { userId: parseInt(restaurantId) } 
      },
      relations: ['user']
    });

    if (!dish) {
      throw new NotFoundException(`Dish with ID ${dishId} not found for restaurant ${restaurantId}`);
    }

    return { 
      message: 'Dish retrieved successfully', 
      dish 
    };
  }

  async updateDish(restaurantId: string, dishId: number, updateDishDto: UpdateDishDto) {
    // Verify the restaurant exists
    const restaurant = await this.userRepository.findOne({ 
      where: { 
        userId: parseInt(restaurantId),
        role: 'restaurant'
      } 
    });
    
    if (!restaurant) {
      throw new BadRequestException(`Restaurant with ID ${restaurantId} not found`);
    }

    // Find the dish for this restaurant
    const dish = await this.dishRepository.findOne({
      where: { 
        dishId,
        user: { userId: parseInt(restaurantId) } 
      }
    });
    
    if (!dish) {
      throw new NotFoundException(`Dish with ID ${dishId} not found for restaurant ${restaurantId}`);
    }

    // Update the dish with the provided updates
    await this.dishRepository.update(dishId, updateDishDto);
    
    // Get the updated dish
    const updatedDish = await this.dishRepository.findOne({
      where: { dishId },
      relations: ['user']
    });

    return { 
      message: 'Dish updated successfully', 
      dish: updatedDish 
    };
  }

  async deleteDish(restaurantId: string, dishId: number) {
    // Verify the restaurant exists
    const restaurant = await this.userRepository.findOne({ 
      where: { 
        userId: parseInt(restaurantId),
        role: 'restaurant'
      } 
    });
    
    if (!restaurant) {
      throw new BadRequestException(`Restaurant with ID ${restaurantId} not found`);
    }
    
    // Find the dish for this restaurant
    const dish = await this.dishRepository.findOne({
      where: { 
        dishId,
        user: { userId: parseInt(restaurantId) } 
      }
    });

    if (!dish) {
      throw new NotFoundException(`Dish with ID ${dishId} not found for restaurant ${restaurantId}`);
    }

    // Delete the dish
    await this.dishRepository.delete(dishId);
    
    return { 
      message: 'Dish deleted successfully', 
      dishId 
    };
  }
}
