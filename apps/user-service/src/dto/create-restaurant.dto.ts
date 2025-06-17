import { IsString, IsEmail, IsNotEmpty, MinLength, Matches, IsOptional, Length, IsNumber, Min, Max, ValidateNested, IsEnum } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { UserRole } from './user-role.enum';

class PlanningDto {
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Time must be in HH:MM format' })
  mondayOpen: string;

  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Time must be in HH:MM format' })
  mondayClose: string;

  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Time must be in HH:MM format' })
  tuesdayOpen: string;

  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Time must be in HH:MM format' })
  tuesdayClose: string;

  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Time must be in HH:MM format' })
  wednesdayOpen: string;

  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Time must be in HH:MM format' })
  wednesdayClose: string;

  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Time must be in HH:MM format' })
  thursdayOpen: string;

  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Time must be in HH:MM format' })
  thursdayClose: string;

  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Time must be in HH:MM format' })
  fridayOpen: string;

  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Time must be in HH:MM format' })
  fridayClose: string;

  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Time must be in HH:MM format' })
  saturdayOpen: string;

  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Time must be in HH:MM format' })
  saturdayClose: string;

  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Time must be in HH:MM format' })
  sundayOpen: string;

  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Time must be in HH:MM format' })
  sundayClose: string;
}

export class CreateRestaurantDto {
  @IsNotEmpty({ message: 'Role is required' })
  @IsEnum(UserRole, { message: 'Invalid role' })
  role: UserRole = UserRole.RESTAURANT;

  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  @Length(1, 50, { message: 'First name must be between 1 and 50 characters' })
  firstName: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]+$/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;

  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  @Matches(/^\+\d{10,15}$/, { message: 'Phone must be in international format (e.g., +33612345678)' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  @Length(5, 255, { message: 'Address must be between 5 and 255 characters' })
  address?: string;

  @IsOptional()
  @IsString({ message: 'Profile picture URL must be a string' })
  @Matches(/^https?:\/\/.+/, { message: 'Profile picture must be a valid URL' })
  profilePicture?: string;

  @IsOptional()
  @IsString({ message: 'Website must be a string' })
  @Matches(/^https?:\/\/.+/, { message: 'Website must be a valid URL' })
  website?: string;

  @IsNotEmpty({ message: 'Minimum purchase amount is required' })
  @IsNumber({}, { message: 'Minimum purchase must be a number' })
  @Min(0, { message: 'Minimum purchase cannot be negative' })
  minimumPurchase: number;

  @IsNotEmpty({ message: 'Delivery radius is required' })
  @IsNumber({}, { message: 'Delivery radius must be a number' })
  @Min(0, { message: 'Delivery radius cannot be negative' })
  @Max(50, { message: 'Delivery radius cannot exceed 50km' })
  deliveryRadius: number;

  @IsNotEmpty({ message: 'Average preparation time is required' })
  @IsNumber({}, { message: 'Average preparation time must be a number' })
  @Min(0, { message: 'Average preparation time cannot be negative' })
  averagePreparationTime: number;

  @IsNotEmpty({ message: 'Planning is required' })
  @ValidateNested()
  @Type(() => PlanningDto)
  planning: PlanningDto;
}
