import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    return this.userRepository.find({
      where: { role: 'delivery_person' },
      select: ['userId', 'firstName', 'lastName', 'email', 'phone', 'address', 'transport', 'profilePicture', 'rib']
    });
  }

  /**
   * Get delivery person by ID
   */
  async findOne(id: number): Promise<User> {
    const driver = await this.userRepository.findOne({
      where: { userId: id, role: 'delivery_person' },
      select: ['userId', 'firstName', 'lastName', 'email', 'phone', 'address', 'transport', 'profilePicture', 'rib']
    });

    if (!driver) {
      throw new NotFoundException(`Delivery driver with ID ${id} not found`);
    }

    return driver;
  }

  /**
   * Update delivery person
   */
  async update(id: number, updateDto: UpdateDeliveryPersonDto): Promise<User> {
    const deliveryPerson = await this.userRepository.findOne({
      where: { userId: id, role: 'delivery_person' }
    });

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
    const deliveryPerson = await this.userRepository.findOne({
      where: { userId: id, role: 'delivery_person' }
    });

    if (!deliveryPerson) {
      throw new NotFoundException(`Delivery person with ID ${id} not found`);
    }

    await this.userRepository.remove(deliveryPerson);
  }

  /**
   * Get delivery person's orders
   */
  async findOrders(id: number): Promise<any[]> {
    const deliveryPerson = await this.userRepository.findOne({
      where: { userId: id, role: 'delivery_person' },
      relations: ['deliveryOrders']
    });

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
