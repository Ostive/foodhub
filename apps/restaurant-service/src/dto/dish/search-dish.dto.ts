import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../common/pagination.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchDishDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Search term to find in dish names or descriptions',
    example: 'chicken',
    type: String
  })
  @IsOptional()
  @IsString()
  search?: string;

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
