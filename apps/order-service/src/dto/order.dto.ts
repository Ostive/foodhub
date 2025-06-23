import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CartItemDto } from './cart-item.dto';

export class OrderItemDto {
  @ApiProperty({
    description: 'ID of the menu item',
    example: '123e4567-e89b-12d3-a456-426614174002',
    format: 'id'
  })
  @IsNotEmpty()
  itemId: number;

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

export class CreateOrderDto {
  @ApiProperty({
    description: 'ID of the user placing the order',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'id'
  })
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: 'ID of the restaurant the order is placed with',
    example: '123e4567-e89b-12d3-a456-426614174001',
    format: 'id'
  })
  @IsNotEmpty()
  restaurantId: number;

  @ApiProperty({
    description: 'Array of items in the order (legacy format)',
    type: [OrderItemDto],
    example: [{
      itemId: '123e4567-e89b-12d3-a456-426614174002',
      quantity: 2,
      specialInstructions: 'No onions please'
    }]
  })
  @IsOptional()
  @IsArray()
  items?: OrderItemDto[];
  
  @ApiProperty({
    description: 'Array of cart items in the order (new format supporting both dishes and menus)',
    type: [CartItemDto],
    example: [{
      id: '1',
      type: 'dish',
      quantity: 2,
      specialInstructions: 'No onions please'
    }, {
      id: '3',
      type: 'menu',
      quantity: 1
    }]
  })
  @IsOptional()
  @IsArray()
  cartItems?: CartItemDto[];

  @ApiPropertyOptional({
    description: 'Address where the order should be delivered',
    example: '123 Main St, Anytown, AN 12345'
  })
  @IsOptional()
  @IsString()
  deliveryAddress?: string;

  @ApiPropertyOptional({
    description: 'Special instructions for the entire order',
    example: 'Please ring doorbell on arrival'
  })
  @IsOptional()
  @IsString()
  specialInstructions?: string;
}

export class UpdateOrderDto {
  @ApiPropertyOptional({
    description: 'Order status',
    example: 'accepted_restaurant'
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    description: 'Updated array of items in the order (legacy format)',
    type: [OrderItemDto],
    example: [{
      itemId: '123e4567-e89b-12d3-a456-426614174002',
      quantity: 2,
      specialInstructions: 'No onions please'
    }]
  })
  @IsOptional()
  @IsArray()
  items?: OrderItemDto[];
  
  @ApiPropertyOptional({
    description: 'Updated array of cart items in the order (new format supporting both dishes and menus)',
    type: [CartItemDto],
    example: [{
      id: '1',
      type: 'dish',
      quantity: 2,
      specialInstructions: 'No onions please'
    }, {
      id: '3',
      type: 'menu',
      quantity: 1
    }]
  })
  @IsOptional()
  @IsArray()
  cartItems?: CartItemDto[];

  @ApiPropertyOptional({
    description: 'Updated delivery address',
    example: '123 Main St, Anytown, AN 12345'
  })
  @IsOptional()
  @IsString()
  deliveryAddress?: string;

  @ApiPropertyOptional({
    description: 'Updated special instructions for the entire order',
    example: 'Please ring doorbell on arrival'
  })
  @IsOptional()
  @IsString()
  specialInstructions?: string;
}
