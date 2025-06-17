import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@app/database/entities/user.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CreateDeliveryPersonDto } from './dto/create-delivery_person.dto';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  private async checkEmailExists(email: string): Promise<void> {
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
  }

  async createCustomer(createCustomerDto: CreateCustomerDto): Promise<User> {
    await this.checkEmailExists(createCustomerDto.email);

    const hashedPassword = await this.hashPassword(createCustomerDto.password);
    
    const customer = this.usersRepository.create({
      ...createCustomerDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(customer);
  }

  async createDeliveryPerson(createDeliveryPersonDto: CreateDeliveryPersonDto): Promise<User> {
    await this.checkEmailExists(createDeliveryPersonDto.email);

    const hashedPassword = await this.hashPassword(createDeliveryPersonDto.password);
    
    const deliveryPerson = this.usersRepository.create({
      ...createDeliveryPersonDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(deliveryPerson);
  }

  async createRestaurant(createRestaurantDto: CreateRestaurantDto): Promise<User> {
    await this.checkEmailExists(createRestaurantDto.email);

    if (!createRestaurantDto.address) {
      throw new BadRequestException('Restaurant address is required');
    }

    const hashedPassword = await this.hashPassword(createRestaurantDto.password);
    
    const restaurant = this.usersRepository.create({
      ...createRestaurantDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(restaurant);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
}
