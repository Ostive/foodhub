import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users-service.service';
import { UsersController } from './users-service.controller';
import { User } from '../../../libs/database/entities/user.entity';
import { Planning } from '../../../libs/database/entities/planning.entity';
import { DatabaseModule } from '../../../libs/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([User, Planning]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
