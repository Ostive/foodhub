import { Injectable, ValidationPipe, UsePipes, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateDishDto, UpdateDishDto, FilterDishDto, SearchDishDto } from '../dto/dish';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like, ILike, Raw } from 'typeorm';
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

  async findAllDishes(restaurantId: string, filterDto?: FilterDishDto) {
    try {
      console.log(`Finding dishes for restaurant ID: ${restaurantId}`);
      console.log(`Filter DTO:`, JSON.stringify(filterDto));
      
      // Validate restaurantId
      if (!restaurantId || isNaN(parseInt(restaurantId))) {
        throw new BadRequestException(`Invalid restaurant ID: ${restaurantId}`);
      }

      // Check if restaurant exists
      const restaurant = await this.userRepository.findOne({
        where: { userId: parseInt(restaurantId), role: 'restaurant' },
      });
      
      if (!restaurant) {
        throw new NotFoundException(`Restaurant with ID ${restaurantId} not found`);
      }

      console.log(`Restaurant found: ${restaurant.userId}`);

      // Build query with filters
      const query = {};
      
      // Apply filters if provided
      if (filterDto) {
        // Filter by name
        if (filterDto.name) {
          query['name'] = ILike(`%${filterDto.name}%`);
        }

        // Filter by category
        if (filterDto.category) {
          query['category'] = ILike(`%${filterDto.category}%`);
        }

        // Filter by price range
        if (filterDto.minPrice !== undefined && filterDto.maxPrice !== undefined) {
          query['cost'] = Between(filterDto.minPrice, filterDto.maxPrice);
        } else if (filterDto.minPrice !== undefined) {
          query['cost'] = Raw(alias => `${alias} >= ${filterDto.minPrice}`);
        } else if (filterDto.maxPrice !== undefined) {
          query['cost'] = Raw(alias => `${alias} <= ${filterDto.maxPrice}`);
        }

        // Filter by isSoldAlone
        if (filterDto.isSoldAlone !== undefined) {
          query['isSoldAlone'] = filterDto.isSoldAlone;
        }
      }

      // Calculate pagination
      const page = filterDto?.page || 1;
      const limit = filterDto?.limit || 10;
      const skip = (page - 1) * limit;

      // Determine sort options
      // Use dishId as default sort field since createdAt doesn't exist in Dish entity
      const sortBy = filterDto?.sortBy || 'dishId';
      const sortOrder = filterDto?.sortOrder || 'DESC';
      const order: any = {};
      order[sortBy] = sortOrder;

      console.log(`Pagination: page=${page}, limit=${limit}, skip=${skip}`);
      console.log(`Sorting: ${sortBy} ${sortOrder}`);

      // Find dishes with filters, pagination, and sorting
      const [dishes, totalCount] = await this.dishRepository.findAndCount({
        where: {
          ...query,
          userId: parseInt(restaurantId)
        },
        relations: ['user'],
        skip,
        take: limit,
        order
      });
      
      console.log(`Found ${dishes.length} dishes out of ${totalCount} total`);
      
      // Format the response
      const formattedDishes = dishes.map(dish => {
        const { user, ...dishWithoutFullUser } = dish;
        return {
          ...dishWithoutFullUser,
          restaurant: {
            id: user?.userId,
            name: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
            email: user?.email
          }
        };
      });

      // Calculate pagination metadata
      const totalPages = Math.ceil(totalCount / limit);
      const hasNext = page < totalPages;
      const hasPrevious = page > 1;

      return { 
        success: true,
        message: 'Dishes retrieved successfully', 
        count: totalCount,
        page,
        limit,
        totalPages,
        hasNext,
        hasPrevious,
        dishes: formattedDishes
      };
    } catch (error) {
      console.error('Error in findAllDishes:', error);
      if (error.name === 'QueryFailedError') {
        console.error('SQL Error:', error.message);
        throw new BadRequestException('Invalid query parameters');
      }
      throw error;
    }
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

  async searchDishes(restaurantId: string, searchDto: SearchDishDto) {
    try {
      console.log(`Searching dishes for restaurant ID: ${restaurantId}`);
      console.log(`Search DTO:`, JSON.stringify(searchDto));
      
      // Validate restaurantId
      if (!restaurantId || isNaN(parseInt(restaurantId))) {
        throw new BadRequestException(`Invalid restaurant ID: ${restaurantId}`);
      }

      // Check if restaurant exists
      const restaurant = await this.userRepository.findOne({
        where: { userId: parseInt(restaurantId), role: 'restaurant' },
      });
      
      if (!restaurant) {
        throw new NotFoundException(`Restaurant with ID ${restaurantId} not found`);
      }

      console.log(`Restaurant found: ${restaurant.userId}`);

      // Build query for search
      const userId = parseInt(restaurantId);
      let whereClause: any;
      
      if (searchDto.search) {
        const searchTerm = `%${searchDto.search}%`;
        // Use direct userId instead of nested user object to avoid potential join issues
        whereClause = [
          { name: ILike(searchTerm), userId },
          { description: ILike(searchTerm), userId },
          { category: ILike(searchTerm), userId },
          { additionalAllergens: ILike(searchTerm), userId },
          { promo: ILike(searchTerm), userId }
        ];
        
        // Handle tags separately as it's an array
        try {
          whereClause.push({ 
            tags: Raw(alias => `${alias}::text ILIKE :searchTerm`, { searchTerm }), 
            userId 
          });
        } catch (e) {
          console.error('Error with tags search:', e);
          // Continue without tags search if it fails
        }
      } else {
        // If no search term, just filter by restaurant
        whereClause = { userId };
      }

      // Calculate pagination
      const page = searchDto.page || 1;
      const limit = searchDto.limit || 10;
      const skip = (page - 1) * limit;

      // Determine sort options
      // Use dishId as default sort field since createdAt doesn't exist in Dish entity
      const sortBy = searchDto.sortBy || 'dishId';
      const sortOrder = searchDto.sortOrder || 'DESC';
      const order: any = {};
      order[sortBy] = sortOrder;

      console.log(`Pagination: page=${page}, limit=${limit}, skip=${skip}`);
      console.log(`Sorting: ${sortBy} ${sortOrder}`);

      // Find dishes with search, pagination, and sorting
      const [dishes, totalCount] = await this.dishRepository.findAndCount({
        where: whereClause,
        relations: ['user'],
        skip,
        take: limit,
        order
      });
      
      console.log(`Found ${dishes.length} dishes out of ${totalCount} total`);
      
      // Format the response
      const formattedDishes = dishes.map(dish => {
        const { user, ...dishWithoutFullUser } = dish;
        return {
          ...dishWithoutFullUser,
          restaurant: {
            id: user?.userId,
            name: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
            email: user?.email
          }
        };
      });

      // Calculate pagination metadata
      const totalPages = Math.ceil(totalCount / limit);
      const hasNext = page < totalPages;
      const hasPrevious = page > 1;

      return { 
        success: true,
        message: 'Dishes search completed successfully', 
        count: totalCount,
        page,
        limit,
        totalPages,
        hasNext,
        hasPrevious,
        dishes: formattedDishes
      };
    } catch (error) {
      console.error('Error in searchDishes:', error);
      if (error.name === 'QueryFailedError') {
        console.error('SQL Error:', error.message);
        throw new BadRequestException('Invalid search parameters');
      }
      throw error;
    }
  }
}
