import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRoleDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com'
  })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;
  
  @ApiProperty({
    description: 'User password',
    example: 'password123',
    minLength: 1
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  password: string;

  @ApiProperty({
    description: 'Expected user role',
    example: 'restaurant',
    enum: ['customer', 'restaurant', 'delivery_person']
  })
  @IsNotEmpty()
  @IsString()
  role: string;
}
