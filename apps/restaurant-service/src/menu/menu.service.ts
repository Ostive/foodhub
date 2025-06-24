import { Injectable, ValidationPipe, UsePipes, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Between, ILike, Like, Raw } from 'typeorm';
import { Menu } from '../../../../libs/database/entities/menu.entity';
import { User } from '../../../../libs/database/entities/user.entity';
import { Dish } from '../../../../libs/database/entities/dish.entity';
import { MenuDish } from '../../../../libs/database/entities/menu_dish.entity';
import { MenuItemDto, AddDishesToMenuDto, FilterMenuDto, SearchMenuDto } from '../dto/menu';

@Injectable()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Dish)
    private dishRepository: Repository<Dish>,
    @InjectRepository(MenuDish)
    private menuDishRepository: Repository<MenuDish>
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
      throw new NotFoundException(`Restaurant with ID ${restaurantId} not found`);
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
    
    // Format the response
    const { user, ...menuWithoutFullUser } = savedMenu;
    
    return { 
      success: true,
      message: 'Menu item added successfully', 
      menu: {
        ...menuWithoutFullUser,
        restaurant: {
          id: user.userId,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email
        }
      }
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
      throw new NotFoundException(`Restaurant with ID ${restaurantId} not found`);
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

    // Update menu properties
    if (menuItemDto.name) menu.name = menuItemDto.name;
    if (menuItemDto.description) menu.description = menuItemDto.description;
    if (menuItemDto.price) menu.cost = menuItemDto.price;
    if (menuItemDto.imageUrl) menu.picture = menuItemDto.imageUrl;
    if (menuItemDto.categories) menu.tags = menuItemDto.categories;
    
    // Save updated menu
    const updatedMenu = await this.menuRepository.save(menu);
    
    // Format the response
    const { user, ...menuWithoutFullUser } = updatedMenu;
    
    return { 
      success: true,
      message: 'Menu item updated successfully', 
      menu: {
        ...menuWithoutFullUser,
        restaurant: {
          id: user.userId,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email
        }
      }
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
      throw new NotFoundException(`Restaurant with ID ${restaurantId} not found`);
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
    
    // Store menu info before deletion for response
    const menuInfo = {
      id: menu.menuId,
      name: menu.name,
      restaurant: {
        id: menu.user.userId,
        name: `${menu.user.firstName} ${menu.user.lastName}`
      }
    };

    // Delete the menu
    await this.menuRepository.remove(menu);
    
    return { 
      success: true,
      message: 'Menu item deleted successfully',
      menu: menuInfo
    };
  }

  async findOneMenuItem(restaurantId: string, menuItemId: string) {
    // Verify the restaurant exists
    const restaurant = await this.userRepository.findOne({ 
      where: { 
        userId: parseInt(restaurantId),
        role: 'restaurant'
      } 
    });
    
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${restaurantId} not found`);
    }

    // Find the menu for this restaurant
    const menu = await this.menuRepository.findOne({
      where: { 
        menuId: parseInt(menuItemId),
        user: { userId: parseInt(restaurantId) } 
      },
      relations: ['user', 'menuDishes', 'menuDishes.dish']
    });

    if (!menu) {
      throw new NotFoundException(`Menu with ID ${menuItemId} not found for restaurant ${restaurantId}`);
    }
    
    // Format the response
    const { user, menuDishes, ...menuWithoutFullUser } = menu;
    
    // Format dishes in the menu
    const dishes = menuDishes?.map(md => ({
      dishId: md.dish.dishId,
      name: md.dish.name,
      description: md.dish.description,
      cost: md.dish.cost,
      differCost: md.differCost || 0
    })) || [];

    return { 
      success: true,
      message: 'Menu item retrieved successfully', 
      menu: {
        ...menuWithoutFullUser,
        dishes,
        restaurant: {
          id: user.userId,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email
        }
      }
    };
  }

  async getAllMenuItems(restaurantId: string, filterDto?: FilterMenuDto) {
    // Verify the restaurant exists
    const restaurant = await this.userRepository.findOne({ 
      where: { 
        userId: parseInt(restaurantId),
        role: 'restaurant'
      } 
    });
    
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${restaurantId} not found`);
    }

    // Build query with filters
    const query: any = {
      user: { userId: parseInt(restaurantId) }
    };

    // Apply filters if provided
    if (filterDto) {
      // Filter by name
      if (filterDto.name) {
        query.name = ILike(`%${filterDto.name}%`);
      }

      // Filter by tag
      if (filterDto.tag) {
        query.tags = ILike(`%${filterDto.tag}%`);
      }

      // Filter by price range
      if (filterDto.minPrice !== undefined && filterDto.maxPrice !== undefined) {
        query.cost = Between(filterDto.minPrice, filterDto.maxPrice);
      } else if (filterDto.minPrice !== undefined) {
        query.cost = filterDto.minPrice;
      } else if (filterDto.maxPrice !== undefined) {
        query.cost = filterDto.maxPrice;
      }
    }

    // Calculate pagination
    const page = filterDto?.page || 1;
    const limit = filterDto?.limit || 10;
    const skip = (page - 1) * limit;

    // Determine sort options
    const sortBy = filterDto?.sortBy || 'createdAt';
    const sortOrder = filterDto?.sortOrder || 'DESC';
    const order: any = {};
    order[sortBy] = sortOrder;

    console.log('Executing query with parameters:', { query, relations: ['user', 'menuDishes', 'menuDishes.dish'], skip, limit, order });

    // Find menus with filters, pagination, and sorting
    const [menus, totalCount] = await this.menuRepository.findAndCount({
      where: query,
      relations: ['user', 'menuDishes', 'menuDishes.dish'],
      skip,
      take: limit,
      order
    });
    
    // Format the response
    const formattedMenus = menus.map(menu => {
      const { user, menuDishes, ...menuWithoutFullUser } = menu;
      
      // Format dishes in the menu
      const dishes = menuDishes?.map(md => ({
        dishId: md.dish.dishId,
        name: md.dish.name,
        description: md.dish.description,
        cost: md.dish.cost,
        differCost: md.differCost || 0
      })) || [];
      
      return {
        ...menuWithoutFullUser,
        dishes,
        restaurant: {
          id: user.userId,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email
        }
      };
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    return { 
      success: true,
      message: 'All menu items retrieved successfully', 
      count: totalCount,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrevious,
      menus: formattedMenus
    };
  }

  async addDishesToMenu(restaurantId: string, menuId: string, addDishesDto: AddDishesToMenuDto) {
    // Verify the restaurant exists
    const restaurant = await this.userRepository.findOne({ 
      where: { 
        userId: parseInt(restaurantId),
        role: 'restaurant'
      } 
    });
    
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${restaurantId} not found`);
    }

    // Find the menu for this restaurant
    const menu = await this.menuRepository.findOne({
      where: { 
        menuId: parseInt(menuId),
        user: { userId: parseInt(restaurantId) } 
      },
      relations: ['user']
    });

    if (!menu) {
      throw new NotFoundException(`Menu with ID ${menuId} not found for restaurant ${restaurantId}`);
    }

    // Verify all dishes exist and belong to this restaurant
    const dishIds = addDishesDto.dishes.map(d => d.dishId);
    const dishes = await this.dishRepository.find({
      where: { 
        dishId: In(dishIds), 
        user: { userId: parseInt(restaurantId) } 
      }
    });

    if (dishes.length !== dishIds.length) {
      throw new BadRequestException('One or more dishes do not exist or do not belong to this restaurant');
    }

    // Create menu-dish relationships
    const menuDishes: MenuDish[] = [];
    for (const dishItem of addDishesDto.dishes) {
      // Check if relationship already exists
      const existingRelation = await this.menuDishRepository.findOne({
        where: { menuId: parseInt(menuId), dishId: dishItem.dishId }
      });

      if (!existingRelation) {
        const menuDish = this.menuDishRepository.create({
          menuId: parseInt(menuId),
          dishId: dishItem.dishId,
          differCost: dishItem.differCost || 0
        });
        menuDishes.push(await this.menuDishRepository.save(menuDish));
      } else {
        // Update existing relation if differCost has changed
        if (existingRelation.differCost !== dishItem.differCost) {
          existingRelation.differCost = dishItem.differCost || 0;
          menuDishes.push(await this.menuDishRepository.save(existingRelation));
        } else {
          menuDishes.push(existingRelation);
        }
      }
    }

    // Get the updated menu with dishes
    const updatedMenu = await this.menuRepository.findOne({
      where: { menuId: parseInt(menuId) },
      relations: ['user', 'menuDishes', 'menuDishes.dish']
    });

    if (!updatedMenu) {
      throw new NotFoundException(`Menu with ID ${menuId} not found after update`);
    }

    // Format the response
    const { user, menuDishes: updatedMenuDishes, ...menuWithoutFullUser } = updatedMenu;
    
    // Format dishes in the menu
    const formattedDishes = updatedMenuDishes?.map(md => ({
      dishId: md.dish.dishId,
      name: md.dish.name,
      description: md.dish.description,
      cost: md.dish.cost,
      differCost: md.differCost || 0
    })) || [];

    return { 
      success: true,
      message: 'Dishes added to menu successfully', 
      menu: {
        ...menuWithoutFullUser,
        dishes: formattedDishes,
        restaurant: {
          id: user.userId,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email
        }
      }
    };
  }

  async removeDishFromMenu(restaurantId: string, menuId: string, dishId: string) {
    // Verify the restaurant exists
    const restaurant = await this.userRepository.findOne({ 
      where: { 
        userId: parseInt(restaurantId),
        role: 'restaurant'
      } 
    });
    
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${restaurantId} not found`);
    }

    // Find the menu for this restaurant
    const menu = await this.menuRepository.findOne({
      where: { 
        menuId: parseInt(menuId),
        user: { userId: parseInt(restaurantId) } 
      }
    });

    if (!menu) {
      throw new NotFoundException(`Menu with ID ${menuId} not found for restaurant ${restaurantId}`);
    }

    // Find the menu-dish relationship
    const menuDish = await this.menuDishRepository.findOne({
      where: { menuId: parseInt(menuId), dishId: parseInt(dishId) },
      relations: ['dish']
    });

    if (!menuDish) {
      throw new NotFoundException(`Dish with ID ${dishId} not found in menu ${menuId}`);
    }

    // Store dish info before deletion for response
    const dishInfo = {
      dishId: menuDish.dish.dishId,
      name: menuDish.dish.name
    };

    // Remove the dish from the menu
    await this.menuDishRepository.remove(menuDish);

    return { 
      success: true,
      message: 'Dish removed from menu successfully',
      dish: dishInfo,
      menuId: parseInt(menuId)
    };
  }

  /**
   * Find dishes for a specific menu
   */
  async findMenuDishes(restaurantId: string, menuId: string) {
    // Verify the restaurant exists
    const restaurant = await this.userRepository.findOne({ 
      where: { 
        userId: parseInt(restaurantId),
        role: 'restaurant'
      } 
    });
    
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${restaurantId} not found`);
    }

    // Find the menu for this restaurant
    const menu = await this.menuRepository.findOne({
      where: { 
        menuId: parseInt(menuId),
        user: { userId: parseInt(restaurantId) } 
      },
      relations: ['user', 'menuDishes', 'menuDishes.dish']
    });

    if (!menu) {
      throw new NotFoundException(`Menu with ID ${menuId} not found for restaurant ${restaurantId}`);
    }
    
    // Extract dishes from the menu
    const dishes = menu.menuDishes?.map(md => ({
      dishId: md.dish.dishId,
      name: md.dish.name,
      description: md.dish.description || '',
      cost: md.dish.cost,
      picture: md.dish.picture || '',
      isVegetarian: md.dish.isVegetarian,
      spicyLevel: md.dish.spicyLevel || 0,
      tags: md.dish.tags || [],
      additionalAllergens: md.dish.additionalAllergens || '',
      userId: md.dish.userId,
      restaurantId: parseInt(restaurantId)
    })) || [];

    // Return paginated response format
    return { 
      success: true,
      message: 'Menu dishes retrieved successfully',
      count: dishes.length,
      page: 1,
      limit: 100,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
      dishes
    };
  }

  async searchMenus(restaurantId: string, searchDto: SearchMenuDto) {
    // Verify the restaurant exists
    const restaurant = await this.userRepository.findOne({ 
      where: { 
        userId: parseInt(restaurantId),
        role: 'restaurant'
      } 
    });
    
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${restaurantId} not found`);
    }

    // Build query for search
    const userId = parseInt(restaurantId);
    let whereClause: any;
    
    if (searchDto.search) {
      const searchTerm = `%${searchDto.search}%`;
      whereClause = [
        { name: ILike(searchTerm), user: { userId } },
        { description: ILike(searchTerm), user: { userId } },
        { tags: Raw(alias => `${alias} ILIKE :searchTerm`, { searchTerm }), user: { userId } }
      ];
    } else {
      // If no search term, just filter by restaurant
      whereClause = { user: { userId } };
    }

    // Calculate pagination
    const page = searchDto.page || 1;
    const limit = searchDto.limit || 10;
    const skip = (page - 1) * limit;

    // Determine sort options
    const sortBy = searchDto.sortBy || 'createdAt';
    const sortOrder = searchDto.sortOrder || 'DESC';
    const order: any = {};
    order[sortBy] = sortOrder;

    // Find menus with search, pagination, and sorting
    const [menus, totalCount] = await this.menuRepository.findAndCount({
      where: whereClause,
      relations: ['user', 'menuDishes', 'menuDishes.dish'],
      skip,
      take: limit,
      order
    });
    
    // Format the response
    const formattedMenus = menus.map(menu => {
      const { user, menuDishes, ...menuWithoutFullUser } = menu;
      
      // Format dishes in the menu
      const dishes = menuDishes?.map(md => ({
        dishId: md.dish.dishId,
        name: md.dish.name,
        description: md.dish.description,
        cost: md.dish.cost,
        differCost: md.differCost || 0
      })) || [];
      
      return {
        ...menuWithoutFullUser,
        dishes,
        restaurant: {
          id: user.userId,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email
        }
      };
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    return { 
      success: true,
      message: 'Menu search completed successfully', 
      count: totalCount,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrevious,
      menus: formattedMenus
    };
  }
}
