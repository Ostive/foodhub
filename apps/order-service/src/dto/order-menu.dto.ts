import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderMenuDto {
  @ApiProperty({
    description: 'ID of the menu',
    example: 1
  })
  @IsNotEmpty()
  @IsNumber()
  menuId: number;

  @ApiProperty({
    description: 'Quantity of the menu',
    example: 1,
    minimum: 1
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({
    description: 'Price of the menu at the time of order',
    example: 15.99
  })
  @IsOptional()
  @IsNumber()
  price?: number;
}
