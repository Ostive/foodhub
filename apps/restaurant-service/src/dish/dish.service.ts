import { Injectable, ValidationPipe, UsePipes, NotFoundException } from '@nestjs/common';
import { CreateDishDto, UpdateDishDto } from '../dto/dish';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dish } from '../../../../libs/database/entities/dish.entity';

@Injectable()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class DishService {

  constructor(
    @InjectRepository(Dish)
    private dishRepository: Repository<Dish>,
  ) {}

  async createDish(createDishDto: CreateDishDto) {

    const newDish = this.dishRepository.create({...createDishDto});
    
    return { message: 'Dish created', newDish: createDishDto };
  }

  async findAllDishes() {
        const dishes = await this.dishRepository.find( );

    return { message: 'All dishes retrieved', dishes };
  }

  async findOne(dishId: number) {
    const dish = await this.dishRepository.find({ where: { dishId } });
    if (!dish) {
      throw new NotFoundException(`Dish with ID ${dishId} not found`);
    }
    return { message: 'Dish retrieved', dish, dishId };
  }

  async updateDish(dishId: number, updateDishDto: UpdateDishDto) {
    const dish = this.dishRepository.findOne({ where: { dishId }});
    
    if (!dish) {
      throw new Error(`Dish with ID ${dishId} not found`);
    }
    // Update the dish with the provided updates
    this.dishRepository.update(dishId, updateDishDto);

    return { message: 'Dish updated', dishId, updates: updateDishDto };
  }

  async deleteDish(dishId: number) {
    
    const dish = await this.dishRepository.findOne({ where: {dishId} });
    if (!dish) {
      throw new NotFoundException(`Dish with ID ${dishId} not found`);
    }
    // Delete the dish
    await this.dishRepository.delete(dishId);
    return { message: 'Dish deleted', dishId };
  }
}
