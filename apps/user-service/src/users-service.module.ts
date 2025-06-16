import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users-service.service';
import { UsersController } from './users-service.controller';
import { User } from '../../../libs/database/entities/user.entity';
import { DatabaseModule } from '../../../libs/database/database.module';
import { UsersMicroserviceController } from './users-service.microservice';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UsersController, UsersMicroserviceController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
