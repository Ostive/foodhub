import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersMicroserviceClient } from './users-microservice.client';

@Injectable()
export class UsersService {
  constructor(private readonly usersMicroserviceClient: UsersMicroserviceClient) {}

  async findByEmail(email: string): Promise<any> {
    try {
      return await this.usersMicroserviceClient.findByEmail(email);
    } catch (error) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
  }

  async findById(id: number): Promise<any> {
    try {
      return await this.usersMicroserviceClient.findById(id);
    } catch (error) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async create(createUserDto: any): Promise<any> {
    // This would call the user service's create endpoint via HTTP
    // For now, we'll leave this as a placeholder
    throw new Error('Method not implemented yet');
  }
}
