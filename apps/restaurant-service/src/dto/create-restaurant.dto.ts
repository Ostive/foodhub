import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Matches, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

// Planning DTO for restaurant hours
class PlanningDto {
  @IsString()
  @IsNotEmpty()
  mondayOpen: string;

  @IsString()
  @IsNotEmpty()
  mondayClose: string;

  @IsString()
  @IsNotEmpty()
  tuesdayOpen: string;

  @IsString()
  @IsNotEmpty()
  tuesdayClose: string;

  @IsString()
  @IsNotEmpty()
  wednesdayOpen: string;

  @IsString()
  @IsNotEmpty()
  wednesdayClose: string;

  @IsString()
  @IsNotEmpty()
  thursdayOpen: string;

  @IsString()
  @IsNotEmpty()
  thursdayClose: string;

  @IsString()
  @IsNotEmpty()
  fridayOpen: string;

  @IsString()
  @IsNotEmpty()
  fridayClose: string;

  @IsString()
  @IsNotEmpty()
  saturdayOpen: string;

  @IsString()
  @IsNotEmpty()
  saturdayClose: string;

  @IsString()
  @IsNotEmpty()
  sundayOpen: string;

  @IsString()
  @IsNotEmpty()
  sundayClose: string;
}

export class CreateRestaurantDto {
  @IsNotEmpty()
  @IsString()
  firstName: string; // Restaurant name

  @IsOptional()
  @IsString()
  lastName?: string; // Additional name info if needed

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]+$/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  role: string = 'restaurant';

  @IsNotEmpty()
  @IsString()
  profilePicture: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsNotEmpty()
  @IsString()
  rib: string;

  @IsNotEmpty()
  @IsArray()
  tags: string[];

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minimumPurchase?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  deliveryRadius?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  averagePreparationTime?: number;

  @IsOptional()
  planning?: PlanningDto;
}