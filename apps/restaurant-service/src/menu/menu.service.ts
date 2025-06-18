import { Injectable, ValidationPipe, UsePipes, NotFoundException, BadRequestException } from '@nestjs/common';
import { MenuItemDto } from '../dto/menu';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from '../../../../libs/database/entities/menu.entity';
import { User } from '../../../../libs/database/entities/user.entity';

@Injectable()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async addMenuItem(restaurantId: string, menuItemDto: MenuItemDto) {
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

    // Create the menu with restaurant association
    const newMenu = this.menuRepository.create({
      name: menuItemDto.name,
      description: menuItemDto.description,
      cost: menuItemDto.price,
      picture: menuItemDto.imageUrl,
      tags: menuItemDto.categories,
      user: restaurant
    });
    
    // Save the menu to the database
    const savedMenu = await this.menuRepository.save(newMenu);
    
    return { 
      message: 'Menu item added successfully', 
      menu: savedMenu 
    };
  }

  async updateMenuItem(restaurantId: string, menuItemId: string, menuItemDto: MenuItemDto) {
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

    // Find the menu for this restaurant
    const menu = await this.menuRepository.findOne({
      where: { 
        menuId: parseInt(menuItemId),
        user: { userId: parseInt(restaurantId) } 
      }
    });
    
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${menuItemId} not found for restaurant ${restaurantId}`);
    }

    // Update the menu with the provided updates
    await this.menuRepository.update(parseInt(menuItemId), {
      name: menuItemDto.name,
      description: menuItemDto.description,
      cost: menuItemDto.price,
      picture: menuItemDto.imageUrl,
      tags: menuItemDto.categories
    });
    
    // Get the updated menu
    const updatedMenu = await this.menuRepository.findOne({
      where: { menuId: parseInt(menuItemId) },
      relations: ['user']
    });

    return { 
      message: 'Menu item updated successfully', 
      menu: updatedMenu 
    };
  }

  async deleteMenuItem(restaurantId: string, menuItemId: string) {
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
    
    // Find the menu for this restaurant
    const menu = await this.menuRepository.findOne({
      where: { 
        menuId: parseInt(menuItemId),
        user: { userId: parseInt(restaurantId) } 
      }
    });

    if (!menu) {
      throw new NotFoundException(`Menu with ID ${menuItemId} not found for restaurant ${restaurantId}`);
    }

    // Delete the menu
    await this.menuRepository.delete(parseInt(menuItemId));
    
    return { 
      message: 'Menu item deleted successfully', 
      menuItemId 
    };
  }

  async getMenuItemById(restaurantId: string, menuItemId: string) {
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

    // Find the menu for this restaurant
    const menu = await this.menuRepository.findOne({
      where: { 
        menuId: parseInt(menuItemId),
        user: { userId: parseInt(restaurantId) } 
      },
      relations: ['user']
    });

    if (!menu) {
      throw new NotFoundException(`Menu with ID ${menuItemId} not found for restaurant ${restaurantId}`);
    }

    return { 
      message: 'Menu item retrieved successfully', 
      menu 
    };
  }

  async getAllMenuItems(restaurantId: string) {
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

    // Find all menus for this restaurant
    const menus = await this.menuRepository.find({
      where: { user: { userId: parseInt(restaurantId) } },
      relations: ['user']
    });

    return { 
      message: 'All menu items retrieved successfully', 
      menus 
    };
  }
}
