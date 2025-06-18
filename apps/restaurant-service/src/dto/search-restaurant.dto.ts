import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchRestaurantDto {
  @ApiPropertyOptional({
    description: 'Search by restaurant name',
    example: 'pizza'
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Search by cuisine type',
    example: 'italian'
  })
  @IsOptional()
  @IsString()
  cuisine?: string;

  @ApiPropertyOptional({
    description: 'Search by location or address',
    example: 'paris'
  })
  @IsOptional()
  @IsString()
  location?: string;
}
