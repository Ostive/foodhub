import { IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum CartItemType {
  DISH = 'dish',
  MENU = 'menu'
}

export class CartItemDto {
  @ApiProperty({
    description: 'ID of the item (dish or menu)',
    example: '1',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Type of the item (dish or menu)',
    enum: CartItemType,
    example: CartItemType.DISH
  })
  @IsNotEmpty()
  @IsEnum(CartItemType)
  type: CartItemType;

  @ApiProperty({
    description: 'Quantity of the item',
    example: 2,
    minimum: 1
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({
    description: 'Special instructions for this specific item',
    example: 'No onions please'
  })
  @IsOptional()
  @IsString()
  specialInstructions?: string;
}
