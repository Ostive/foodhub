import { IsString, IsEmail, IsNotEmpty, MinLength, Matches, IsOptional, Length, IsDate, IsEnum } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { UserRole } from './user-role.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    default: UserRole.CUSTOMER,
    example: UserRole.CUSTOMER
  })
  @IsNotEmpty({ message: 'Role is required' })
  @IsEnum(UserRole, { message: 'Invalid role' })
  role: UserRole = UserRole.CUSTOMER;

  @ApiProperty({
    description: 'Customer first name',
    example: 'John',
    minLength: 1,
    maxLength: 50
  })
  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  @Length(1, 50, { message: 'First name must be between 1 and 50 characters' })
  firstName: string;

  @ApiProperty({
    description: 'Customer last name',
    example: 'Doe',
    minLength: 1,
    maxLength: 50
  })
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString({ message: 'Last name must be a string' })
  @Length(1, 50, { message: 'Last name must be between 1 and 50 characters' })
  lastName: string;

  @ApiProperty({
    description: 'Customer email address',
    example: 'john.doe@example.com',
    format: 'email'
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @ApiProperty({
    description: 'Customer password',
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
    description: 'Customer phone number in international format',
    example: '+33612345678',
    pattern: '^\+\d{10,15}$'
  })
  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  @Matches(/^\+\d{10,15}$/, { message: 'Phone must be in international format (e.g., +33612345678)' })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Customer address',
    example: '123 Main Street, City, Country',
    minLength: 5,
    maxLength: 255
  })
  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  @Length(5, 255, { message: 'Address must be between 5 and 255 characters' })
  address?: string;

  @ApiPropertyOptional({
    description: 'URL to customer profile picture',
    example: 'https://example.com/profile.jpg',
    pattern: '^https?:\/\/.+'
  })
  @IsOptional()
  @IsString({ message: 'Profile picture URL must be a string' })
  @Matches(/^https?:\/\/.+/, { message: 'Profile picture must be a valid URL' })
  profilePicture?: string;

  @ApiPropertyOptional({
    description: 'Customer birth date',
    example: '1990-01-01',
    type: Date
  })
  @IsOptional()
  @IsDate({ message: 'Invalid birth date' })
  @Type(() => Date)
  birthDate?: Date;

  @ApiPropertyOptional({
    description: 'Customer referral code',
    example: 'ABC123',
    minLength: 6,
    maxLength: 10,
    pattern: '^[A-Z0-9]+$'
  })
  @IsOptional()
  @IsString({ message: 'Referral code must be a string' })
  @Length(6, 10, { message: 'Referral code must be between 6 and 10 characters' })
  @Matches(/^[A-Z0-9]+$/, { message: 'Referral code can only contain uppercase letters and numbers' })
  referralCode?: string;
}
