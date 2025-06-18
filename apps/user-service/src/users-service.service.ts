import { BadRequestException, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CreateDeliveryPersonDto } from './dto/create-delivery_person.dto';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { User } from '../../../libs/database/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Planning } from '../../../libs/database/entities/planning.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Planning)
    private readonly planningRepository: Repository<Planning>,
  ) {}

  private async checkEmailExists(email: string): Promise<void> {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user with this email already exists
    await this.checkEmailExists(createUserDto.email);
    
    // Hash the password
    const hashedPassword = await this.hashPassword(createUserDto.password);
    
    // Create new user with hashed password
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    
    // Save and return the user (without the password)
    const savedUser = await this.userRepository.save(newUser);
    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword as User;
  }

  private generateReferralCode(): string {
    // Generate a random 8-character code with uppercase letters and numbers
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  async createCustomer(createCustomerDto: CreateCustomerDto): Promise<User> {
    await this.checkEmailExists(createCustomerDto.email);

    const hashedPassword = await this.hashPassword(createCustomerDto.password);
    
    // If no referral code is provided, generate one
    if (!createCustomerDto.referralCode) {
      createCustomerDto.referralCode = this.generateReferralCode();
    }
    
    const customer = this.userRepository.create({
      ...createCustomerDto,
      password: hashedPassword,
    } as any);

    const savedUser = await this.userRepository.save(customer);
    // Using type assertion to handle the password removal correctly
    const { password, ...userWithoutPassword } = savedUser as any;
    return userWithoutPassword as unknown as User;
  }

  async createDeliveryPerson(createDeliveryPersonDto: CreateDeliveryPersonDto): Promise<User> {
    await this.checkEmailExists(createDeliveryPersonDto.email);

    const hashedPassword = await this.hashPassword(createDeliveryPersonDto.password);
    
    const deliveryPerson = this.userRepository.create({
      ...createDeliveryPersonDto,
      password: hashedPassword,
    } as any);

    const savedUser = await this.userRepository.save(deliveryPerson);
    // Using type assertion to handle the password removal correctly
    const { password, ...userWithoutPassword } = savedUser as any;
    return userWithoutPassword as unknown as User;
  }

  async createRestaurant(createRestaurantDto: CreateRestaurantDto): Promise<User> {
    await this.checkEmailExists(createRestaurantDto.email);

    if (!createRestaurantDto.address) {
      throw new BadRequestException('Restaurant address is required');
    }

    const hashedPassword = await this.hashPassword(createRestaurantDto.password);
    
    // Extract planning data
    const { planning, ...restaurantData } = createRestaurantDto;
    
    // Create restaurant user with proper type casting to match entity structure
    const restaurant = this.userRepository.create({
      ...restaurantData,
      password: hashedPassword,
    } as any);

    // Save restaurant to get ID
    const savedRestaurant = await this.userRepository.save(restaurant);
    
    // Create planning with restaurant ID
    if (planning) {
      const planningData = {
        user: savedRestaurant,
        monday: `${planning.mondayOpen}-${planning.mondayClose}`,
        tuesday: `${planning.tuesdayOpen}-${planning.tuesdayClose}`,
        wednesday: `${planning.wednesdayOpen}-${planning.wednesdayClose}`,
        thursday: `${planning.thursdayOpen}-${planning.thursdayClose}`,
        friday: `${planning.fridayOpen}-${planning.fridayClose}`,
        saturday: `${planning.saturdayOpen}-${planning.saturdayClose}`,
        sunday: `${planning.sundayOpen}-${planning.sundayClose}`,
      };
      
      // Fix the planning creation with proper typing
      const newPlanning = this.planningRepository.create(planningData as any);
      await this.planningRepository.save(newPlanning);
    }

    // Return user without password
    const { password, ...userWithoutPassword } = savedRestaurant as any;
    return userWithoutPassword as unknown as User;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    // Remove passwords from the response
    return users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { userId: id } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    // Remove password from the response
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    
    return user; // Return with password for auth purposes
  }
  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { userId: id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user; // Return with password for auth purposes
  }



  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    // Check if user exists
    const user = await this.userRepository.findOne({ where: {userId: id } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    // If password is being updated, hash it
    if ('password' in updateUserDto && updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password as string, 10);
      updateUserDto = { ...updateUserDto, password: hashedPassword };
    }
    
    // Update user
    await this.userRepository.update(id, updateUserDto);
    
    // Return updated user
    const updatedUser = await this.userRepository.findOne({ where: { userId: id } });
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found after update`);
    }
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword as User;
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async createDeveloper(createDeveloperDto: any): Promise<User> {
    await this.checkEmailExists(createDeveloperDto.email);

    const hashedPassword = await this.hashPassword(createDeveloperDto.password);
    
    const developer = this.userRepository.create({
      ...createDeveloperDto,
      role: 'developer',
      referralCode: this.generateReferralCode(),
      password: hashedPassword,
    } as any);

    const savedUser = await this.userRepository.save(developer);
    // Using type assertion to handle the password removal correctly
    const { password, ...userWithoutPassword } = savedUser as any;
    return userWithoutPassword as unknown as User;
  }
}
