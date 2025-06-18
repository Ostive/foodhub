import { Injectable, ValidationPipe, UsePipes, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { SearchRestaurantDto } from './dto/search-restaurant.dto';
import { User } from '../../../libs/database/entities/user.entity';
import * as bcrypt from 'bcrypt';

type RestaurantRole = 'restaurant';

@Injectable()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class RestaurantService {
  constructor(
    @InjectRepository(User)
    private readonly restaurantRepository: Repository<User>,
  ) {}

  async createRestaurant(createRestaurantDto: CreateRestaurantDto): Promise<Partial<User>> {
    // Hash the password
    const hashedPassword = await bcrypt.hash(createRestaurantDto.password, 10);
    
    // Create new restaurant with hashed password
    const newRestaurant = this.restaurantRepository.create({
      ...createRestaurantDto,
      password: hashedPassword,
      role: 'restaurant' as RestaurantRole,
    } as any); // Using type assertion to bypass TypeScript's strict checking
    
    // Save and return the restaurant (without the password)
    try {
      const savedRestaurant = await this.restaurantRepository.save(newRestaurant);
      // Using destructuring to remove password from response
      const { password, ...restaurantWithoutPassword } = savedRestaurant as any;
      return restaurantWithoutPassword;
    } catch (error: any) { // Type error as any for better error handling
      // Provide better error handling
      if (error.code === '23505') { // PostgreSQL unique constraint violation
        throw new ConflictException('Restaurant with this email already exists');
      }
      throw new BadRequestException(`Failed to create restaurant: ${error.message}`);
    }
  }

  async updateRestaurant(id: number, updateRestaurantDto: UpdateRestaurantDto): Promise<Partial<User>> {
    const restaurant = await this.restaurantRepository.findOne({ where: { userId: id } });

    if (!restaurant) {
      throw new BadRequestException(`Restaurant with ID ${id} not found`);
    }

    // If password is being updated, hash it
    let updatedData = { ...updateRestaurantDto };
    if (updateRestaurantDto.password) {
      const hashedPassword = await bcrypt.hash(updateRestaurantDto.password, 10);
      updatedData = { ...updatedData, password: hashedPassword };
    }
        
    // Update restaurant - use type assertion to handle role field
    await this.restaurantRepository.update({ userId: id }, updatedData as any);
        
    // Return updated restaurant
    const updatedRestaurant = await this.restaurantRepository.findOne({ where: { userId: id } });
    if (!updatedRestaurant) {
      throw new BadRequestException(`Restaurant with ID ${id} not found after update`);
    }
    
    // Remove password from response
    const { password, ...restaurantWithoutPassword } = updatedRestaurant as any;
    return restaurantWithoutPassword;
  }

  async findAll(): Promise<Partial<User>[]> {
    // Find all restaurants
    const restaurants = await this.restaurantRepository.find({ 
      where: { role: 'restaurant' } 
    });
    
    // Remove passwords from the response
    return restaurants.map(restaurant => {
      const { password, ...restaurantWithoutPassword } = restaurant as any;
      return restaurantWithoutPassword;
    });
  }

  async findOne(id: number): Promise<Partial<User>> {
    const restaurant = await this.restaurantRepository.findOne({ 
      where: { userId: id, role: 'restaurant' } 
    });

    if (!restaurant) {
      throw new BadRequestException(`Restaurant with ID ${id} not found`);
    }

    // Remove password from the response
    const { password, ...restaurantWithoutPassword } = restaurant as any;
    return restaurantWithoutPassword;
  }

  async findByEmail(email: string): Promise<User> {
    const restaurant = await this.restaurantRepository.findOne({ 
      where: { email, role: 'restaurant' } 
    });

    if (!restaurant) {
      throw new BadRequestException(`Restaurant with email ${email} not found`);
    }

    return restaurant; // Return with password for auth purposes
  }

  async findById(id: number): Promise<User> {
    const restaurant = await this.restaurantRepository.findOne({ 
      where: { userId: id, role: 'restaurant' } 
    });
    
    if (!restaurant) {
      throw new BadRequestException(`Restaurant with ID ${id} not found`);
    }
    
    return restaurant; // Return with password for auth purposes
  }

  async remove(id: number): Promise<void> {
    const restaurant = await this.restaurantRepository.findOne({ 
      where: { userId: id, role: 'restaurant' } 
    });

    if (!restaurant) {
      throw new BadRequestException(`Restaurant with ID ${id} not found`);
    }

    await this.restaurantRepository.remove(restaurant);
  }

  async searchRestaurants(searchParams: SearchRestaurantDto): Promise<Partial<User>[]> {
    // Build where conditions based on search parameters
    const whereConditions: any = { role: 'restaurant' };
    
    if (searchParams.name) {
      whereConditions.firstName = ILike(`%${searchParams.name}%`);
    }
    
    if (searchParams.cuisine) {
      // Assuming cuisine is stored in a field like 'cuisineType' or similar
      // You might need to adjust this based on your actual data model
      whereConditions.cuisineType = ILike(`%${searchParams.cuisine}%`);
    }
    
    if (searchParams.location) {
      whereConditions.address = ILike(`%${searchParams.location}%`);
    }
    
    // Find restaurants matching the search criteria
    const restaurants = await this.restaurantRepository.find({
      where: whereConditions
    });
    
    // Remove passwords from the response
    return restaurants.map(restaurant => {
      const { password, ...restaurantWithoutPassword } = restaurant as any;
      return restaurantWithoutPassword;
    });
  }
}
