import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../common/pagination.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchMenuDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Search term to find in menu names or descriptions',
    example: 'special',
    type: String
  })
  @IsOptional()
  @IsString()
  search?: string;

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
