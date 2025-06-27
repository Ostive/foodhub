import { IsArray, IsNotEmpty, IsNumber, IsOptional, Min, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PersonalizationChoiceDto } from './personalization-choice.dto';

export class OrderDishDto {
  @ApiProperty({
    description: 'ID of the dish',
    example: 1
  })
  @IsNotEmpty()
  @IsNumber()
  dishId: number;

  @ApiProperty({
    description: 'Quantity of the dish',
    example: 2,
    minimum: 1
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({
    description: 'Price of the dish at the time of order',
    example: 12.99
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({
    description: 'Personalization choices for the dish',
    type: [PersonalizationChoiceDto]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PersonalizationChoiceDto)
  personalizationChoices?: PersonalizationChoiceDto[];
}
