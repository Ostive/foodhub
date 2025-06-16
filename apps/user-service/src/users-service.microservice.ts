import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UsersService } from './users-service.service';
import { User } from '../../../libs/database/entities/user.entity';

@Controller()
export class UsersMicroserviceController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'findUserByEmail' })
  async findByEmail(email: string): Promise<User> {
    return this.usersService.findByEmail(email);
  }

  @MessagePattern({ cmd: 'findUserById' })
  async findById(id: number): Promise<User> {
    return this.usersService.findById(id);
  }

  @MessagePattern({ cmd: 'validateUser' })
  async validateUser(data: { email: string; password: string }): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(data.email);
      // Password validation will be handled by auth-service
      return user;
    } catch (error) {
      return null;
    }
  }
}
