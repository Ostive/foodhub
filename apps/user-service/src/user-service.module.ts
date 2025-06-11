import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserServiceController } from './user-service.controller';
import { UserServiceService } from './user-service.service';
import { User } from './entities/user.entity';
import { getConfig, loadEnvConfig } from 'libs/config';

// Load environment variables
loadEnvConfig();
const config = getConfig();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: config.database.type as 'postgres',
      host: config.database.host,
      port: config.database.port,
      username: config.database.username,
      password: config.database.password,
      database: config.database.database,
      entities: [User],
      synchronize: config.database.synchronize,
      logging: config.database.logging,
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserServiceController],
  providers: [
    UserServiceService,
    {
      provide: APP_PIPE,
      useFactory: () => new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
  ],
})
export class UserServiceModule {}
