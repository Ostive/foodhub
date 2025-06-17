import { Injectable, ValidationPipe, UsePipes } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { User as Restaurant } from 'libs/database/entities/user.entity';
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
    const restaurant = await this.restaurantRepository.findOne({ where: { userId:id } });

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
    const updatedRestaurant = await this.restaurantRepository.findOne({ where: { userId:id } });
    if (!updatedRestaurant) {
      throw new Error(`Restaurant with ID ${id} not found after update`);
    }
    const { password, ...restaurantWithoutPassword } = updatedRestaurant;
    return restaurantWithoutPassword as Restaurant;
  }

  async findAll(): Promise<Restaurant[]> {
    const restaurants = await this.restaurantRepository.find();
    // Remove passwords from the response
    return restaurants.map(restaurant => {
      const { password, ...restaurantWithoutPassword } = restaurant;
      return restaurantWithoutPassword as Restaurant;
    });
  }

  async findOne(id: number): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({ where: { userId:id } });

    if (!restaurant) {
      throw new Error(`Restaurant with ID ${id} not found`);
    }

    // Remove password from the response
    const { password, ...restaurantWithoutPassword } = restaurant;
    return restaurantWithoutPassword as Restaurant;
  }

  async findByEmail(email: string): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({ where: { email } });

    if (!restaurant) {
      throw new Error(`Restaurant with email ${email} not found`);
    }

    return restaurant; // Return with password for auth purposes
  }

  async findById(id: number): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({ where: { userId:id } });
    if (!restaurant) {
      throw new Error(`Restaurant with ID ${id} not found`);
    }
    return restaurant; // Return with password for auth purposes
  }

    async remove(id: number): Promise<void> {
    const restaurant = await this.restaurantRepository.findOne({ where: { userId:id } });

    if (!restaurant) {
      throw new Error(`Restaurant with ID ${id} not found`);
    }

    await this.restaurantRepository.remove(restaurant);
  }
  
}
