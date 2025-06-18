import { IsOptional, IsString, IsBoolean, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../common/pagination.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterDishDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter dishes by name (partial match)',
    example: 'pizza',
    type: String
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter dishes by category',
    example: 'Pasta',
    type: String
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Minimum price filter',
    example: 5,
    type: Number,
    minimum: 0
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Maximum price filter',
    example: 20,
    type: Number,
    minimum: 0
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Filter dishes that can be ordered individually',
    example: true,
    type: Boolean
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isSoldAlone?: boolean;

  @ApiPropertyOptional({
    description: 'Field to sort results by',
    example: 'name',
    enum: ['name', 'cost', 'dishId'],
    default: 'dishId'
  })
  @IsOptional()
  @IsString()
  sortBy?: 'name' | 'cost' | 'dishId' = 'dishId';

  @ApiPropertyOptional({
    description: 'Sort order direction',
    example: 'ASC',
    enum: ['ASC', 'DESC'],
    default: 'DESC'
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
