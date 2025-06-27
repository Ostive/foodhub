import { IsArray, IsOptional, IsNumber, IsString, IsEnum, ValidateNested, IsDate } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { OrderStatus } from './order-status.enum';
import { OrderDishDto } from './order-dish.dto';
import { OrderMenuDto } from './order-menu.dto';

export class UpdateOrderDto {
  @ApiPropertyOptional({
    description: 'Order status',
    enum: OrderStatus,
    example: OrderStatus.ACCEPTED_RESTAURANT
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

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

  @ApiPropertyOptional({
    description: 'Updated delivery location address',
    example: '123 Main St, Anytown, AN 12345'
  })
  @IsOptional()
  @IsString()
  deliveryLocalisation?: string;
  
  @ApiPropertyOptional({
    description: 'Updated order time',
    example: new Date().toISOString()
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  time?: Date;
  
  @ApiPropertyOptional({
    description: 'Updated total cost of the order',
    example: 25.99
  })
  @IsOptional()
  @IsNumber()
  cost?: number;

  @ApiPropertyOptional({
    description: 'Updated delivery fee',
    example: 3.99
  })
  @IsOptional()
  @IsNumber()
  deliveryFee?: number;

  @ApiPropertyOptional({
    description: 'Updated verification code for order pickup',
    example: 'A12B34'
  })
  @IsOptional()
  @IsString()
  verificationCode?: string;

  @ApiPropertyOptional({
    description: 'Updated dishes in the order',
    type: [OrderDishDto]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderDishDto)
  dishes?: OrderDishDto[];

  @ApiPropertyOptional({
    description: 'Updated menus in the order',
    type: [OrderMenuDto]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderMenuDto)
  menus?: OrderMenuDto[];
}
