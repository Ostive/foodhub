import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginUserDto {

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;
  

  @IsNotEmpty()
  @IsString()
  @MinLength(1, { message: 'Password must be at least 1 character long' })
  password: string;

}
