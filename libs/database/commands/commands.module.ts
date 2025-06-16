import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedCommand } from './seed.command';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_DB_HOST'),
        port: configService.get('POSTGRES_DB_PORT'),
        username: configService.get('POSTGRES_DB_USER'),
        password: configService.get('POSTGRES_DB_PASSWORD'),
        database: configService.get('POSTGRES_DB_NAME'),
        entities: [User],
        synchronize: configService.get('POSTGRES_DB_SYNCHRONIZE'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [SeedCommand],
  exports: [SeedCommand],
})
export class CommandsModule {}
