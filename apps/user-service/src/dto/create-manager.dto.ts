import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateManagerDto {
  @ApiProperty({ example: 'John', description: 'First name of the manager' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the manager' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'manager@example.com', description: 'Email address of the manager' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+1234567890', description: 'Phone number of the manager' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'password123', description: 'Password for the manager account' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
