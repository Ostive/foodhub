import { Module } from '@nestjs/common';
import { UsersMicroserviceClient } from './users-microservice.client';
import { UsersService } from './users.service';

@Module({
  providers: [UsersMicroserviceClient, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
