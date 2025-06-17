import { IsString, IsEmail, IsNotEmpty, MinLength, Matches, IsOptional, Length, IsDate, IsEnum } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { UserRole } from './user-role.enum';

export class CreateCustomerDto {
  @IsNotEmpty({ message: 'Role is required' })
  @IsEnum(UserRole, { message: 'Invalid role' })
  role: UserRole = UserRole.CUSTOMER;

  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  @Length(1, 50, { message: 'First name must be between 1 and 50 characters' })
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @IsString({ message: 'Last name must be a string' })
  @Length(1, 50, { message: 'Last name must be between 1 and 50 characters' })
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
  @IsDate({ message: 'Invalid birth date' })
  @Type(() => Date)
  birthDate?: Date;

  @IsOptional()
  @IsString({ message: 'Referral code must be a string' })
  @Length(6, 10, { message: 'Referral code must be between 6 and 10 characters' })
  @Matches(/^[A-Z0-9]+$/, { message: 'Referral code can only contain uppercase letters and numbers' })
  referralCode?: string;
}
