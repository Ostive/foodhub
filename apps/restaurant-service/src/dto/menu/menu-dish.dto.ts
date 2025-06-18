import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MenuDishItemDto {
  @ApiProperty({
    description: 'ID of the dish to add to the menu',
    example: 1,
    type: Number
  })
  @IsNotEmpty()
  @IsNumber()
  dishId: number;

  @ApiPropertyOptional({
    description: 'Price difference for this dish when included in the menu (can be negative for discounts)',
    example: -2.50,
    type: Number
  })
  @IsOptional()
  @IsNumber()
  differCost?: number;
}

export class AddDishesToMenuDto {
  @ApiProperty({
    description: 'List of dishes to add to the menu',
    type: [MenuDishItemDto],
    isArray: true
  })
  @IsNotEmpty()
  @IsArray()
  @Type(() => MenuDishItemDto)
  dishes: MenuDishItemDto[];
}
