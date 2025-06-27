import { BadRequestException, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CreateDeliveryPersonDto } from './dto/create-delivery_person.dto';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { CreateManagerDto } from './dto/create-manager.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { User } from '../../../libs/database/entities/user.entity';
import { CreditCard } from '../../../libs/database/entities/credit_card.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Planning } from '../../../libs/database/entities/planning.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Planning)
    private readonly planningRepository: Repository<Planning>,
    private readonly dataSource: DataSource
  ) {}

  private async checkEmailExists(email: string): Promise<void> {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
  }
  
  async findCustomerByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ 
      where: { 
        email, 
        role: 'customer',
        isActive: true 
      },
      relations: ['creditCards'] // Include credit cards in the response
    });
    
    if (!user) {
      throw new NotFoundException(`Customer with email ${email} not found`);
    }
    
    // Remove password from the response
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async findCustomerById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ 
      where: { 
        userId: id, 
        role: 'customer',
        isActive: true 
      },
      relations: ['creditCards'] // Include credit cards in the response
    });
    
    if (!user) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    
    // Remove password from the response
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
  
  async updateCustomerByEmail(email: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Find the customer first with credit cards
    const user = await this.userRepository.findOne({ 
      where: { 
        email, 
        role: 'customer',
        isActive: true 
      },
      relations: ['creditCards'] // Include credit cards when finding the user
    });
    
    if (!user) {
      throw new NotFoundException(`Customer with email ${email} not found`);
    }
    
    // If password is provided, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    }
    
    // Update the user
    Object.assign(user, updateUserDto);
    
    // Save the updated user
    const updatedUser = await this.userRepository.save(user);
    
    // Fetch the updated user with credit cards
    const userWithRelations = await this.userRepository.findOne({
      where: { userId: updatedUser.userId },
      relations: ['creditCards']
    });
    
    if (!userWithRelations) {
      throw new NotFoundException(`User not found after update`);
    }
    
    // Remove password from the response
    const { password, ...userWithoutPassword } = userWithRelations;
    return userWithoutPassword as User;
  }
  
  async addCreditCardByEmail(email: string, creditCardData: { creditCardNumber: string; expiryDate: string; name: string }): Promise<User> {
    // Find the customer with credit cards
    const user = await this.userRepository.findOne({ 
      where: { 
        email, 
        role: 'customer',
        isActive: true 
      },
      relations: ['creditCards']
    });
    
    if (!user) {
      throw new NotFoundException(`Customer with email ${email} not found`);
    }
    
    // Create a new credit card entity
    const creditCard = new CreditCard();
    creditCard.creditCardNumber = creditCardData.creditCardNumber;
    creditCard.expiryDate = creditCardData.expiryDate;
    creditCard.name = creditCardData.name;
    creditCard.userId = user.userId;
    
    // First save the credit card directly using the repository
    const creditCardRepository = this.dataSource.getRepository(CreditCard);
    const savedCreditCard = await creditCardRepository.save(creditCard);
    
    // Add the credit card to the user's credit cards
    if (!user.creditCards) {
      user.creditCards = [];
    }
    user.creditCards.push(savedCreditCard);
    
    // Save the updated user
    await this.userRepository.save(user);
    
    // Fetch the updated user with credit cards
    const updatedUser = await this.userRepository.findOne({
      where: { userId: user.userId },
      relations: ['creditCards']
    });
    
    if (!updatedUser) {
      throw new NotFoundException(`User not found after adding credit card`);
    }
    
    // Remove password from the response
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword as User;
  }
  
  async deleteCreditCardByEmail(email: string, creditCardId: number): Promise<void> {
    // Use a transaction to ensure atomicity
    await this.dataSource.transaction(async transactionalEntityManager => {
      // Find the customer with credit cards
      const user = await transactionalEntityManager.findOne(User, { 
        where: { 
          email, 
          role: 'customer',
          isActive: true 
        },
        relations: ['creditCards']
      });
      
      if (!user) {
        throw new NotFoundException(`Customer with email ${email} not found`);
      }
      
      // Check if the credit card exists and belongs to the user
      const creditCardIndex = user.creditCards.findIndex(card => card.creditCardId === creditCardId);
      if (creditCardIndex === -1) {
        throw new NotFoundException(`Credit card with ID ${creditCardId} not found for this user`);
      }
      
      // Execute a direct SQL DELETE query
      // This bypasses TypeORM's entity lifecycle hooks that might be causing the issue
      await transactionalEntityManager.query(
        `DELETE FROM credit_cards WHERE "creditCardId" = $1`,
        [creditCardId]
      );
      
      // Update the user's credit cards array in memory
      user.creditCards.splice(creditCardIndex, 1);
      
      // Save the updated user with the modified credit cards array
      // This ensures the in-memory representation matches the database
      await transactionalEntityManager.save(user);
    });
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
    const users = await this.userRepository.find({ where: { isActive: true } });
    // Remove passwords from the response
    return users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    });
  }

  async findAllByRole(role: 'customer' | 'delivery_person' | 'restaurant' | 'developer' | 'manager' | 'admin'): Promise<User[]> {
    const users = await this.userRepository.find({ where: { role, isActive: true } });
    // Remove passwords from the response
    return users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { userId: id, isActive: true } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    // Remove password from the response
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
  
  async findOneByRole(id: number, role: 'customer' | 'delivery_person' | 'restaurant' | 'developer' | 'manager' | 'admin'): Promise<User> {
    const user = await this.userRepository.findOne({ where: { userId: id, isActive: true } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    if (user.role !== role) {
      throw new BadRequestException(`User with ID ${id} is not a ${role}`);
    }
    
    // Remove password from the response
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email, isActive: true } });
    
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
  
  async updateByRole(id: number, role: 'customer' | 'delivery_person' | 'restaurant' | 'developer' | 'manager' | 'admin', updateUserDto: UpdateUserDto): Promise<User> {
    // Check if user exists and has the correct role
    const user = await this.userRepository.findOne({ where: { userId: id } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    if (user.role !== role) {
      throw new BadRequestException(`User with ID ${id} is not a ${role}`);
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

  async removeByRole(id: number, role: 'customer' | 'delivery_person' | 'restaurant' | 'developer' | 'manager' | 'admin'): Promise<void> {
    // Check if user exists and has the correct role
    const user = await this.userRepository.findOne({ where: { userId: id } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    if (user.role !== role) {
      throw new BadRequestException(`User with ID ${id} is not a ${role}`);
    }
    
    // Delete the user
    const result = await this.userRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found after verification`);
    }
  }

  async softDelete(id: number): Promise<void> {
    // Check if user exists
    const user = await this.userRepository.findOne({ where: { userId: id } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    // Soft delete by setting isActive to false
    await this.userRepository.update(id, { isActive: false });
  }

  async softDeleteByRole(id: number, role: 'customer' | 'delivery_person' | 'restaurant' | 'developer' | 'manager' | 'admin'): Promise<void> {
    // Check if user exists and has the correct role
    const user = await this.userRepository.findOne({ where: { userId: id } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    if (user.role !== role) {
      throw new BadRequestException(`User with ID ${id} is not a ${role}`);
    }
    
    // Soft delete by setting isActive to false
    await this.userRepository.update(id, { isActive: false });
  }

  async reactivate(id: number): Promise<void> {
    // Check if user exists
    const user = await this.userRepository.findOne({ where: { userId: id } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    // Reactivate by setting isActive to true
    await this.userRepository.update(id, { isActive: true });
  }

  async reactivateByRole(id: number, role: 'customer' | 'delivery_person' | 'restaurant' | 'developer' | 'manager' | 'admin'): Promise<void> {
    // Check if user exists and has the correct role
    const user = await this.userRepository.findOne({ where: { userId: id } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    if (user.role !== role) {
      throw new BadRequestException(`User with ID ${id} is not a ${role}`);
    }
    
    // Reactivate by setting isActive to true
    await this.userRepository.update(id, { isActive: true });
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

  async createManager(createManagerDto: CreateManagerDto): Promise<User> {
    await this.checkEmailExists(createManagerDto.email);

    const hashedPassword = await this.hashPassword(createManagerDto.password);
    
    const manager = this.userRepository.create({
      ...createManagerDto,
      role: 'manager',
      referralCode: this.generateReferralCode(),
      password: hashedPassword,
    } as any);

    const savedUser = await this.userRepository.save(manager);
    // Using type assertion to handle the password removal correctly
    const { password, ...userWithoutPassword } = savedUser as any;
    return userWithoutPassword as unknown as User;
  }

  async createAdmin(createAdminDto: CreateAdminDto): Promise<User> {
    await this.checkEmailExists(createAdminDto.email);

    const hashedPassword = await this.hashPassword(createAdminDto.password);
    
    const admin = this.userRepository.create({
      ...createAdminDto,
      role: 'admin',
      referralCode: this.generateReferralCode(),
      password: hashedPassword,
    } as any);

    const savedUser = await this.userRepository.save(admin);
    // Using type assertion to handle the password removal correctly
    const { password, ...userWithoutPassword } = savedUser as any;
    return userWithoutPassword as unknown as User;
  }
}
