import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../libs/database/entities/user.entity';
import * as bcrypt from 'bcrypt';

// Define DTOs for our service
export class CreateDeliveryDriverDto {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  password: string;
  address?: string;
  transport?: string;
  profilePicture?: string;
  rib?: string;
}

export class UpdateDeliveryDriverDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  address?: string;
  transport?: string;
  profilePicture?: string;
  rib?: string;
  isActive?: boolean;
}

@Injectable()
export class DeliverServiceService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Create a new delivery driver
   */
  async createDeliveryDriver(createDto: CreateDeliveryDriverDto): Promise<User> {
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
   * Get all delivery drivers
   */
  async getAllDeliveryDrivers(): Promise<User[]> {
    return this.userRepository.find({
      where: { role: 'delivery_person' },
      select: ['userId', 'firstName', 'lastName', 'email', 'phone', 'address', 'transport', 'profilePicture', 'rib']
    });
  }

  /**
   * Get delivery driver by ID
   */
  async getDeliveryDriverById(id: number): Promise<User> {
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
   * Update delivery driver
   */
  async updateDeliveryDriver(id: number, updateDto: UpdateDeliveryDriverDto): Promise<User> {
    const driver = await this.userRepository.findOne({
      where: { userId: id, role: 'delivery_person' }
    });

    if (!driver) {
      throw new NotFoundException(`Delivery driver with ID ${id} not found`);
    }

    // If updating email, check if it's already taken by another user
    if (updateDto.email && updateDto.email !== driver.email) {
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

    // Update driver
    Object.assign(driver, updateDto);
    return this.userRepository.save(driver);
  }

  /**
   * Delete delivery driver
   */
  async deleteDeliveryDriver(id: number): Promise<void> {
    const driver = await this.userRepository.findOne({
      where: { userId: id, role: 'delivery_person' }
    });

    if (!driver) {
      throw new NotFoundException(`Delivery driver with ID ${id} not found`);
    }

    await this.userRepository.remove(driver);
  }

  /**
   * Get delivery driver's orders
   */
  async getDeliveryDriverOrders(id: number): Promise<any[]> {
    const driver = await this.userRepository.findOne({
      where: { userId: id, role: 'delivery_person' },
      relations: ['deleveryOrders']
    });

    if (!driver) {
      throw new NotFoundException(`Delivery driver with ID ${id} not found`);
    }

    return driver.deleveryOrders;
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
