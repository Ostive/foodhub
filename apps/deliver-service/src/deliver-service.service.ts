import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { User } from '../../../libs/database/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateDeliveryPersonDto } from './dto/create-delivery-person.dto';
import { UpdateDeliveryPersonDto } from './dto/update-delivery-person.dto';

@Injectable()
export class DeliverServiceService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Create a new delivery person
   */
  async create(createDto: CreateDeliveryPersonDto): Promise<User> {
    // Check if user with this email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createDto.email }
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create new user with delivery_person role
    const newDriver = this.userRepository.create({
      ...createDto,
      role: 'delivery_person',
      password: await bcrypt.hash(createDto.password, 10),
      referralCode: this.generateReferralCode(),
    });

    return this.userRepository.save(newDriver);
  }

  /**
   * Get all delivery persons
   */
  async findAll(): Promise<User[]> {
    // Get users with delivery_person role
    const deliveryPersons = await this.userRepository.find({
      where: { role: 'delivery_person' },
      select: ['userId', 'firstName', 'lastName', 'email', 'phone', 'address', 'transport', 'profilePicture', 'rib', 'role']
    });
    
    // If we have delivery persons with the correct role, return them
    if (deliveryPersons.length > 0) {
      return deliveryPersons;
    }
    
    // Otherwise, find users by email pattern (temporary solution until data is fixed)
    return this.userRepository.find({
      where: [
        { email: ILike('%delivery_person%') }
      ],
      select: ['userId', 'firstName', 'lastName', 'email', 'phone', 'address', 'transport', 'profilePicture', 'rib', 'role']
    });
  }

  /**
   * Get delivery person by ID
   */
  async findOne(id: number): Promise<User> {
    // Try to find by ID and role first
    const deliveryPerson = await this.userRepository.findOne({
      where: { userId: id, role: 'delivery_person' },
      select: ['userId', 'firstName', 'lastName', 'email', 'phone', 'address', 'transport', 'profilePicture', 'rib', 'role']
    });

    if (deliveryPerson) {
      return deliveryPerson;
    }
    
    // If not found, try to find by ID and email pattern
    const userByEmail = await this.userRepository.findOne({
      where: { 
        userId: id,
        email: ILike('%delivery_person%')
      },
      select: ['userId', 'firstName', 'lastName', 'email', 'phone', 'address', 'transport', 'profilePicture', 'rib', 'role']
    });

    if (userByEmail) {
      return userByEmail;
    }

    throw new NotFoundException(`Delivery person with ID ${id} not found`);
  }

  /**
   * Update delivery person
   */
  async update(id: number, updateDto: UpdateDeliveryPersonDto): Promise<User> {
    // Try to find by ID and role first
    let deliveryPerson = await this.userRepository.findOne({
      where: { userId: id, role: 'delivery_person' }
    });

    // If not found, try to find by ID and email pattern
    if (!deliveryPerson) {
      deliveryPerson = await this.userRepository.findOne({
        where: { 
          userId: id,
          email: ILike('%delivery_person%')
        }
      });
      
      // If found by email, update the role to be correct
      if (deliveryPerson) {
        deliveryPerson.role = 'delivery_person';
      }
    }

    if (!deliveryPerson) {
      throw new NotFoundException(`Delivery person with ID ${id} not found`);
    }

    // If updating email, check if it's already taken by another user
    if (updateDto.email && updateDto.email !== deliveryPerson.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateDto.email }
      });

      if (existingUser) {
        throw new ConflictException('Email is already in use');
      }
    }

    // If updating password, hash it
    if (updateDto.password) {
      updateDto.password = await bcrypt.hash(updateDto.password, 10);
    }

    // Update delivery person
    Object.assign(deliveryPerson, updateDto);
    return this.userRepository.save(deliveryPerson);
  }

  /**
   * Delete delivery person
   */
  async remove(id: number): Promise<void> {
    // Try to find by ID and role first
    let deliveryPerson = await this.userRepository.findOne({
      where: { userId: id, role: 'delivery_person' }
    });

    // If not found, try to find by ID and email pattern
    if (!deliveryPerson) {
      deliveryPerson = await this.userRepository.findOne({
        where: { 
          userId: id,
          email: ILike('%delivery_person%')
        }
      });
    }

    if (!deliveryPerson) {
      throw new NotFoundException(`Delivery person with ID ${id} not found`);
    }

    await this.userRepository.remove(deliveryPerson);
  }

  /**
   * Get delivery person's orders
   */
  async findOrders(id: number): Promise<any[]> {
    // Try to find by ID and role first
    let deliveryPerson = await this.userRepository.findOne({
      where: { userId: id, role: 'delivery_person' },
      relations: ['deliveryOrders']
    });

    // If not found, try to find by ID and email pattern
    if (!deliveryPerson) {
      deliveryPerson = await this.userRepository.findOne({
        where: { 
          userId: id,
          email: ILike('%delivery_person%')
        },
        relations: ['deliveryOrders']
      });
    }

    if (!deliveryPerson) {
      throw new NotFoundException(`Delivery person with ID ${id} not found`);
    }

    return deliveryPerson.deliveryOrders;
  }

  /**
   * Generate a unique referral code
   */
  private generateReferralCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
}
