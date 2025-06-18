import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../common/pagination.dto';

export class SearchDishDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortBy?: 'name' | 'cost' | 'dishId' = 'dishId';

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
