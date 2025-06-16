import { Module } from '@nestjs/common';
import { AuthController } from './auth-service.controller';
import { AuthService } from './auth-service.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { AdminController } from './controllers/admin.controller';
import { CustomerController } from './controllers/customer.controller';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      global: true,
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        // console.log('JWT_SECRET from ConfigService:', secret);
        return {
          secret: secret || 'defaultSecretKey',
          signOptions: { 
            expiresIn: configService.get<string>('JWT_EXPIRATION_TIME') || '1h' 
          },
        };
      },
    }),
  ],
  controllers: [AuthController, AdminController, CustomerController],
  providers: [AuthService, JwtStrategy, RolesGuard],
  exports: [AuthService, JwtModule],
})

export class AuthModule {}

