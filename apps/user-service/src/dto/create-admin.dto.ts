import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ example: 'Admin', description: 'First name of the admin' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'User', description: 'Last name of the admin' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'admin@example.com', description: 'Email address of the admin' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+1234567890', description: 'Phone number of the admin' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'adminPassword123', description: 'Password for the admin account' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
