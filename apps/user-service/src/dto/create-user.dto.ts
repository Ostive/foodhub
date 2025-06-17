import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length, Matches, MaxLength, MinLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  @Length(1, 50, { message: 'First name must be between 1 and 50 characters' })
  @Matches(/^[a-zA-ZÀ-ÿ\s-']+$/, { message: 'First name can only contain letters and hyphens' })
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @IsString({ message: 'Last name must be a string' })
  @Length(1, 50, { message: 'Last name must be between 1 and 50 characters' })
  @Matches(/^[a-zA-ZÀ-ÿ\s-']+$/, { message: 'Last name can only contain letters and hyphens' })
  lastName: string;

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
  @IsDate({ message: 'Invalid birth date' })
  @Type(() => Date)
  birthDate?: Date;

  @IsOptional()
  @IsString({ message: 'Home location must be a string' })
  @MaxLength(255, { message: 'Home location cannot exceed 255 characters' })
  homeLocalisation?: string;

  @IsOptional()
  @IsString({ message: 'Transport must be a string' })
  @MaxLength(50, { message: 'Transport cannot exceed 50 characters' })
  transport?: string;

  @IsOptional()
  @IsEnum(['customer', 'delivery', 'restaurateur', 'developer', 'manager', 'admin'], {
    message: 'Invalid role. Must be one of: customer, delivery, restaurateur, developer, manager, admin'
  })
  role: 'customer' | 'delivery' | 'restaurateur' | 'developer' | 'manager' | 'admin' = 'customer';
}