import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PersonalizationOptionChoiceDto {
  @ApiPropertyOptional({
    description: 'ID of the personalization choice',
    example: 1,
    type: Number
  })
  @IsOptional()
  @IsNumber()
  choiceId?: number;

  @ApiProperty({
    description: 'Name of the personalization choice',
    example: 'Extra Cheese',
    type: String
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Additional price for this choice',
    example: 1.50,
    type: Number,
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  additionalPrice: number;

  @ApiPropertyOptional({
    description: 'Whether this choice is selected by default',
    example: false,
    type: Boolean
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class PersonalizationOptionDto {
  @ApiPropertyOptional({
    description: 'ID of the personalization option',
    example: 1,
    type: Number
  })
  @IsOptional()
  @IsNumber()
  optionId?: number;

  @ApiProperty({
    description: 'Name of the personalization option',
    example: 'Toppings',
    type: String
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Type of selection allowed',
    example: 'multiple',
    enum: ['single', 'multiple'],
    enumName: 'PersonalizationOptionType'
  })
  @IsNotEmpty()
  @IsEnum(['single', 'multiple'], { message: 'Type must be either "single" or "multiple"' })
  type: 'single' | 'multiple';

  @ApiProperty({
    description: 'Whether this personalization is required',
    example: true,
    type: Boolean
  })
  @IsBoolean()
  required: boolean;

  @ApiProperty({
    description: 'Available choices for this personalization option',
    type: [PersonalizationOptionChoiceDto],
    isArray: true
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PersonalizationOptionChoiceDto)
  choices: PersonalizationOptionChoiceDto[];
}
