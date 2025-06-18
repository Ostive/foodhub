import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MenuItemDto {
  @ApiProperty({
    description: 'Name of the menu item',
    example: 'Family Feast',
    type: String
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of the menu item',
    example: 'A complete meal for 4 people with appetizers, main courses, and desserts',
    type: String
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Price of the menu item in currency units',
    example: 39.99,
    type: Number,
    minimum: 0
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    description: 'URL to the menu item image',
    example: 'https://example.com/images/family-feast.jpg',
    type: String
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Categories this menu item belongs to',
    example: ['Family Meals', 'Special Offers', 'Dinner'],
    type: [String],
    isArray: true
  })
  @IsOptional()
  @IsArray()
  categories?: string[];
}
