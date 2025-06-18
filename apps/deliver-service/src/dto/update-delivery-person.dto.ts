import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateDeliveryPersonDto {
  @ApiPropertyOptional({
    description: 'Email address of the delivery person',
    example: 'driver@example.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Password for the delivery person account',
    example: 'newSecurePassword123',
    minLength: 8
  })
  @IsString()
  @IsOptional()
  @MinLength(8)
  password?: string;

  @ApiPropertyOptional({
    description: 'First name of the delivery person',
    example: 'John'
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Last name of the delivery person',
    example: 'Doe'
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Phone number of the delivery person',
    example: '+33612345678'
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Address of the delivery person',
    example: '123 Delivery St, Paris'
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    description: 'Type of transport used by the delivery person',
    example: 'bicycle'
  })
  @IsString()
  @IsOptional()
  transport?: string;

  @ApiPropertyOptional({
    description: 'Bank account information (RIB) for the delivery person',
    example: 'FR7630006000011234567890189'
  })
  @IsString()
  @IsOptional()
  rib?: string;
}
