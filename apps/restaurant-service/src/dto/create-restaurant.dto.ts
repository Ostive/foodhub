import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Matches, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// Planning DTO for restaurant hours
class PlanningDto {
  @ApiProperty({ description: 'Monday opening time', example: '09:00' })
  @IsString()
  @IsNotEmpty()
  mondayOpen: string;

  @ApiProperty({ description: 'Monday closing time', example: '22:00' })
  @IsString()
  @IsNotEmpty()
  mondayClose: string;

  @ApiProperty({ description: 'Tuesday opening time', example: '09:00' })
  @IsString()
  @IsNotEmpty()
  tuesdayOpen: string;

  @ApiProperty({ description: 'Tuesday closing time', example: '22:00' })
  @IsString()
  @IsNotEmpty()
  tuesdayClose: string;

  @ApiProperty({ description: 'Wednesday opening time', example: '09:00' })
  @IsString()
  @IsNotEmpty()
  wednesdayOpen: string;

  @ApiProperty({ description: 'Wednesday closing time', example: '22:00' })
  @IsString()
  @IsNotEmpty()
  wednesdayClose: string;

  @ApiProperty({ description: 'Thursday opening time', example: '09:00' })
  @IsString()
  @IsNotEmpty()
  thursdayOpen: string;

  @ApiProperty({ description: 'Thursday closing time', example: '22:00' })
  @IsString()
  @IsNotEmpty()
  thursdayClose: string;

  @ApiProperty({ description: 'Friday opening time', example: '09:00' })
  @IsString()
  @IsNotEmpty()
  fridayOpen: string;

  @ApiProperty({ description: 'Friday closing time', example: '22:00' })
  @IsString()
  @IsNotEmpty()
  fridayClose: string;

  @ApiProperty({ description: 'Saturday opening time', example: '10:00' })
  @IsString()
  @IsNotEmpty()
  saturdayOpen: string;

  @ApiProperty({ description: 'Saturday closing time', example: '23:00' })
  @IsString()
  @IsNotEmpty()
  saturdayClose: string;

  @ApiProperty({ description: 'Sunday opening time', example: '10:00' })
  @IsString()
  @IsNotEmpty()
  sundayOpen: string;

  @ApiProperty({ description: 'Sunday closing time', example: '22:00' })
  @IsString()
  @IsNotEmpty()
  sundayClose: string;
}

export class CreateRestaurantDto {
  @ApiProperty({
    description: 'Restaurant name',
    example: 'Pizza Palace'
  })
  @IsNotEmpty()
  @IsString()
  firstName: string; // Restaurant name

  @ApiProperty({
    description: 'Additional restaurant name info (optional)',
    example: 'Italian Cuisine',
    required: false
  })
  @IsOptional()
  @IsString()
  lastName?: string; // Additional name info if needed

  @ApiProperty({
    description: 'Restaurant email address',
    example: 'contact@pizzapalace.com'
  })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({
    description: 'Restaurant phone number',
    example: '+33123456789'
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'Restaurant physical address',
    example: '123 Food Street, Paris, 75001'
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Account password',
    example: 'Password123',
    minLength: 8
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]+$/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;

  @ApiProperty({
    description: 'User role (always "restaurant" for this DTO)',
    example: 'restaurant',
    default: 'restaurant'
  })
  @IsNotEmpty()
  @IsString()
  role: string = 'restaurant';

  @ApiProperty({
    description: 'URL to restaurant profile picture',
    example: 'https://example.com/images/restaurant.jpg'
  })
  @IsNotEmpty()
  @IsString()
  profilePicture: string;

  @ApiProperty({
    description: 'Restaurant website URL (optional)',
    example: 'https://pizzapalace.com',
    required: false
  })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({
    description: 'Restaurant bank account information',
    example: 'FR7630006000011234567890189'
  })
  @IsNotEmpty()
  @IsString()
  rib: string;

  @ApiProperty({
    description: 'Restaurant cuisine type tags',
    example: ['Italian', 'Pizza', 'Pasta']
  })
  @IsNotEmpty()
  @IsArray()
  tags: string[];

  @ApiProperty({
    description: 'Minimum order amount in euros (optional)',
    example: 15.0,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minimumPurchase?: number;

  @ApiProperty({
    description: 'Maximum delivery radius in kilometers (optional)',
    example: 5.0,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  deliveryRadius?: number;

  @ApiProperty({
    description: 'Average food preparation time range (e.g., "20-30 min")',
    example: '20-30 min',
    required: false
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d+-\d+\s*min$/, {
    message: 'Preparation time must be in format "20-30 min"',
  })
  averagePreparationTime?: string;

  @ApiProperty({
    description: 'Restaurant operating hours (optional)',
    type: PlanningDto,
    required: false
  })
  @IsOptional()
  planning?: PlanningDto;
}