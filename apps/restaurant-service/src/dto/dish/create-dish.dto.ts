import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Min, Max } from 'class-validator';

export class CreateDishDto {

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsBoolean()
  isSoldAlone: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsNotEmpty()
  @IsBoolean()
  isVegetarian: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  spicyLevel: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  cost: number;

  @IsOptional()
  @IsString()
  additionalAllergens?: string;

  @IsOptional()
  @IsUrl()
  picture?: string;

  @IsOptional()
  @IsString()
  promo?: string;


}
