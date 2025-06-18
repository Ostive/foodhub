import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../common/pagination.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterMenuDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter menus by name (partial match)',
    example: 'lunch',
    type: String
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter menus by tag',
    example: 'vegetarian',
    type: String
  })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiPropertyOptional({
    description: 'Minimum price filter',
    example: 10,
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
    example: 30,
    type: Number,
    minimum: 0
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Field to sort results by',
    example: 'name',
    enum: ['name', 'cost', 'createdAt'],
    default: 'createdAt'
  })
  @IsOptional()
  @IsString()
  sortBy?: 'name' | 'cost' | 'createdAt' = 'createdAt';

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
