import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO for logout requests
 */
export class LogoutDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}
