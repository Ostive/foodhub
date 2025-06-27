import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum, IsDate, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { OrderStatus } from './order-status.enum';
import { OrderDishDto } from './order-dish.dto';
import { OrderMenuDto } from './order-menu.dto';

export class CreateOrderDto {
  @ApiProperty({
    description: 'ID of the customer placing the order',
    example: 1
  })
  @IsNotEmpty()
  @IsNumber()
  customerId: number;

  @ApiProperty({
    description: 'ID of the restaurant the order is placed with',
    example: 2
  })
  @IsNotEmpty()
  @IsNumber()
  restaurantId: number;

  @ApiPropertyOptional({
    description: 'ID of the delivery person',
    example: 3
  })
  @IsOptional()
  @IsNumber()
  deliveryId?: number;

  @ApiPropertyOptional({
    description: 'ID of the promo code applied to the order',
    example: 1
  })
  @IsOptional()
  @IsNumber()
  promoId?: number;

  @ApiProperty({
    description: 'Delivery location address',
    example: '123 Main St, Anytown, AN 12345'
  })
  @IsNotEmpty()
  @IsString()
  deliveryLocalisation: string;

  @ApiPropertyOptional({
    description: 'Order time',
    example: new Date().toISOString()
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  time?: Date;

  @ApiPropertyOptional({
    description: 'Total cost of the order',
    example: 25.99
  })
  @IsOptional()
  @IsNumber()
  cost?: number;

  @ApiPropertyOptional({
    description: 'Delivery fee',
    example: 3.99
  })
  @IsOptional()
  @IsNumber()
  deliveryFee?: number;

  @ApiPropertyOptional({
    description: 'Order status',
    enum: OrderStatus,
    example: OrderStatus.CREATED
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({
    description: 'Verification code for order pickup',
    example: 'A12B34'
  })
  @IsOptional()
  @IsString()
  verificationCode?: string;

  @ApiProperty({
    description: 'Dishes in the order',
    type: [OrderDishDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderDishDto)
  dishes: OrderDishDto[];

  @ApiPropertyOptional({
    description: 'Menus in the order',
    type: [OrderMenuDto]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderMenuDto)
  menus?: OrderMenuDto[];
}
