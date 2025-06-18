import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../libs/database/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

// Define DTOs for our service
export class CreateDeliveryDriverDto {
  @ApiProperty({
    description: 'Email address of the delivery driver',
    example: 'driver@example.com',
    uniqueItems: true
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'Password for the delivery driver account',
    example: 'StrongP@ssw0rd',
    minLength: 8
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty({
    description: 'First name of the delivery driver',
    example: 'John'
  })
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @ApiProperty({
    description: 'Last name of the delivery driver',
    example: 'Doe'
  })
  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @ApiProperty({
    description: 'Phone number of the delivery driver',
    example: '+33612345678'
  })
  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  phone: string;

  @ApiPropertyOptional({
    description: 'Address of the delivery driver',
    example: '123 Main St'
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    description: 'Transport method used by the delivery driver',
    example: 'bicycle',
    enum: ['bicycle', 'scooter', 'car', 'motorcycle', 'on foot']
  })
  @IsString()
  @IsOptional()
  transport?: string;

  @ApiPropertyOptional({
    description: 'Profile picture of the delivery driver',
    example: 'https://example.com/profile-picture.jpg'
  })
  @IsString()
  @IsOptional()
  profilePicture?: string;

  @ApiPropertyOptional({
    description: 'RIB of the delivery driver',
    example: 'FR12345678901234567890123456789012'
  })
  @IsString()
  @IsOptional()
  rib?: string;
}

export class UpdateDeliveryDriverDto {
  @ApiPropertyOptional({
    description: 'Email address of the delivery driver',
    example: 'driver@example.com',
    uniqueItems: true
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Password for the delivery driver account',
    example: 'NewStrongP@ssw0rd',
    minLength: 8
  })
  @IsString()
  @IsOptional()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password?: string;

  @ApiPropertyOptional({
    description: 'First name of the delivery driver',
    example: 'John'
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Last name of the delivery driver',
    example: 'Doe'
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Phone number of the delivery driver',
    example: '+33612345678'
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Address of the delivery driver',
    example: '123 Main St'
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    description: 'Transport method used by the delivery driver',
    example: 'bicycle',
    enum: ['bicycle', 'scooter', 'car', 'motorcycle', 'on foot']
  })
  @IsString()
  @IsOptional()
  transport?: string;

  @ApiPropertyOptional({
    description: 'Profile picture of the delivery driver',
    example: 'https://example.com/profile-picture.jpg'
  })
  @IsString()
  @IsOptional()
  profilePicture?: string;

  @ApiPropertyOptional({
    description: 'RIB of the delivery driver',
    example: 'FR12345678901234567890123456789012'
  })
  @IsString()
  @IsOptional()
  rib?: string;

  @ApiPropertyOptional({
    description: 'Whether the delivery driver account is active',
    example: true
  })
  @IsOptional()
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
      relations: ['deliveryOrders']
    });

    if (!driver) {
      throw new NotFoundException(`Delivery driver with ID ${id} not found`);
    }

    return driver.deliveryOrders;
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
