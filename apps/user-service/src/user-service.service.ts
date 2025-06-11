import { Injectable, ValidationPipe, UsePipes, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto, LoginUserDto, UserResponseDto, UserRole } from './dto/user.dto';
import { User } from './entities/user.entity';

@Injectable()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class UserServiceService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createUser(createUserDto: CreateUserDto) {
    // Check if username or email already exists
    const existingUser = await this.userRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email }
      ]
    });
    
    if (existingUser) {
      if (existingUser.username === createUserDto.username) {
        throw new BadRequestException('Username already exists');
      } else {
        throw new BadRequestException('Email already exists');
      }
    }
    
    // Create new user
    const user = this.userRepository.create(createUserDto);
    await this.userRepository.save(user);
    
    // Return user without password
    const { password: _, ...result } = user;
    return result;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    // Update user properties
    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);
    
    return { message: 'User updated', id, user };
  }

  async login(loginUserDto: LoginUserDto) {
    const { usernameOrEmail, password } = loginUserDto;
    
    // Check if the input is an email or username
    const isEmail = usernameOrEmail.includes('@');
    
    // Find user by email or username
    const user = await this.userRepository.findOne({ 
      where: isEmail ? { email: usernameOrEmail } : { username: usernameOrEmail } 
    });
    
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    
    // Verify password
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // Update last login time
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);
    
    // Return user data without sensitive information
    const { password: _, ...userResponse } = user;
    return userResponse;
  }

  async findAll() {
    const users = await this.userRepository.find();
    return users.map(user => {
      const { password, ...result } = user;
      return result;
    });
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    // Return user without password
    const { password, ...result } = user;
    return result;
  }
}
