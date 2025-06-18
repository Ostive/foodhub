import { IsString, IsEmail, IsNotEmpty, MinLength, Matches, IsOptional, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'User first name',
    example: 'John',
    minLength: 1,
    maxLength: 50
  })
  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  @Length(1, 50, { message: 'First name must be between 1 and 50 characters' })
  firstName: string;

  @ApiPropertyOptional({
    description: 'User last name',
    example: 'Doe',
    minLength: 1,
    maxLength: 50
  })
  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  @Length(1, 50, { message: 'Last name must be between 1 and 50 characters' })
  lastName?: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    format: 'email'
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'Password123',
    minLength: 8,
    format: 'password'
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]+$/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;

  @ApiPropertyOptional({
    description: 'User phone number in international format',
    example: '+33612345678',
    pattern: '^\+\d{10,15}$'
  })
  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  @Matches(/^\+\d{10,15}$/, { message: 'Phone must be in international format (e.g., +33612345678)' })
  phone?: string;

  @ApiPropertyOptional({
    description: 'User address',
    example: '123 Main Street, City, Country',
    minLength: 5,
    maxLength: 255
  })
  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  @Length(5, 255, { message: 'Address must be between 5 and 255 characters' })
  address?: string;

  @ApiPropertyOptional({
    description: 'URL to user profile picture',
    example: 'https://example.com/profile.jpg',
    pattern: '^https?:\/\/.+'
  })
  @IsOptional()
  @IsString({ message: 'Profile picture URL must be a string' })
  @Matches(/^https?:\/\/.+/, { message: 'Profile picture must be a valid URL' })
  profilePicture?: string;
}