import { IsArray, IsNumber, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class UpdateDishDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsArray()
  categories?: string[];

  @IsOptional()
  @IsString()
  ingredients?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  preparationTime?: number; // in minutes
}
