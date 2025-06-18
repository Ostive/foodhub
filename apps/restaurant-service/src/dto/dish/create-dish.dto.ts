import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PersonalizationOptionDto } from './personalization-option.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDishDto {

  @ApiProperty({
    description: 'ID of the user creating the dish',
    example: 1,
    type: Number
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: 'Name of the dish',
    example: 'Margherita Pizza',
    type: String
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Description of the dish',
    example: 'Classic Italian pizza with tomato sauce, mozzarella, and fresh basil',
    type: String
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Whether the dish can be ordered individually',
    example: true,
    type: Boolean
  })
  @IsNotEmpty()
  @IsBoolean()
  isSoldAlone: boolean;

  @ApiPropertyOptional({
    description: 'Tags associated with the dish',
    example: ['Italian', 'Pizza', 'Vegetarian'],
    type: [String],
    isArray: true
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    description: 'Whether the dish is vegetarian',
    example: true,
    type: Boolean
  })
  @IsNotEmpty()
  @IsBoolean()
  isVegetarian: boolean;

  @ApiPropertyOptional({
    description: 'Spiciness level of the dish (0-5)',
    example: 2,
    type: Number,
    minimum: 0,
    maximum: 5
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  spicyLevel: number;

  @ApiProperty({
    description: 'Cost of the dish in currency units',
    example: 12.99,
    type: Number,
    minimum: 0
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  cost: number;

  @ApiPropertyOptional({
    description: 'Additional allergen information',
    example: 'Contains gluten, dairy',
    type: String
  })
  @IsOptional()
  @IsString()
  additionalAllergens?: string;

  @ApiPropertyOptional({
    description: 'URL to the dish image',
    example: 'https://example.com/images/margherita-pizza.jpg',
    type: String
  })
  @IsOptional()
  @IsUrl()
  picture?: string;

  @ApiPropertyOptional({
    description: 'Promotional text for the dish',
    example: 'Limited time offer: 20% off!',
    type: String
  })
  @IsOptional()
  @IsString()
  promo?: string;

  @ApiPropertyOptional({
    description: 'Personalization options for the dish',
    type: [PersonalizationOptionDto],
    isArray: true
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PersonalizationOptionDto)
  personalizationOptions?: PersonalizationOptionDto[];
}
