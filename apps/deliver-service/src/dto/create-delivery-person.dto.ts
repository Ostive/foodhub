import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateDeliveryPersonDto {
  @ApiProperty({
    description: 'Email address of the delivery person',
    example: 'driver@example.com',
    required: true
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password for the delivery person account',
    example: 'securePassword123',
    required: true,
    minLength: 8
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'First name of the delivery person',
    example: 'John',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the delivery person',
    example: 'Doe',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Phone number of the delivery person',
    example: '+33612345678',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'Address of the delivery person',
    example: '123 Delivery St, Paris',
    required: false
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'Type of transport used by the delivery person',
    example: 'bicycle',
    required: false
  })
  @IsString()
  @IsOptional()
  transport?: string;

  @ApiProperty({
    description: 'Bank account information (RIB) for the delivery person',
    example: 'FR7630006000011234567890189',
    required: false
  })
  @IsString()
  @IsOptional()
  rib?: string;
}
