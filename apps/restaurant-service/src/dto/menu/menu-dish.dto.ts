import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class MenuDishItemDto {
  @IsNotEmpty()
  @IsNumber()
  dishId: number;

  @IsOptional()
  @IsNumber()
  differCost?: number;
}

export class AddDishesToMenuDto {
  @IsNotEmpty()
  @IsArray()
  @Type(() => MenuDishItemDto)
  dishes: MenuDishItemDto[];
}
