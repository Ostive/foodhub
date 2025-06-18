import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {

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
  @MinLength(1, { message: 'Password must be at least 1 character long' })
  password: string;

}
