import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configModule } from '../config';
import { User } from './entities/user.entity';

@Module({
  imports: [
    configModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Log environment variables to debug
        console.log({ db_name: configService.get('POSTGRES_DB_NAME') });
        
        // Get database config from environment variables via ConfigService
        return {
          type: 'postgres',
          host: configService.get('POSTGRES_DB_HOST') || 'localhost',
          port: parseInt(configService.get('POSTGRES_DB_PORT') || '5432', 10),
          username: configService.get('POSTGRES_DB_USER') || 'postgres',
          password: configService.get('POSTGRES_DB_PASSWORD') || 'postgres',
          database: configService.get('POSTGRES_DB_NAME') || 'default_db',
          entities: [User],
          synchronize: configService.get('POSTGRES_DB_SYNCHRONIZE') === 'true',
          autoLoadEntities: true,
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
