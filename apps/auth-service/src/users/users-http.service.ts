import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { getConfig } from 'libs/config';

@Injectable()
export class UsersHttpService {
  private readonly userServiceUrl: string;

  constructor(private readonly httpService: HttpService) {
    const config = getConfig();
    this.userServiceUrl = config.services.userService;
  }

  async findByEmail(email: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.userServiceUrl}/api/users/email/${email}`)
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Error communicating with user service', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findById(id: number): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.userServiceUrl}/api/users/${id}`)
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Error communicating with user service', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
