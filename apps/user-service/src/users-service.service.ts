import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../../../libs/database/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user with this email already exists
    const existingUser = await this.userRepository.findOne({ 
      where: { email: createUserDto.email } 
    });
    
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
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



}
