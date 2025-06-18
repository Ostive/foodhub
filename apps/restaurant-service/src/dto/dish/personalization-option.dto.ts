import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PersonalizationOptionChoiceDto {
  @IsOptional()
  @IsNumber()
  choiceId?: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  additionalPrice: number;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class PersonalizationOptionDto {
  @IsOptional()
  @IsNumber()
  optionId?: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(['single', 'multiple'], { message: 'Type must be either "single" or "multiple"' })
  type: 'single' | 'multiple';

  @IsBoolean()
  required: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PersonalizationOptionChoiceDto)
  choices: PersonalizationOptionChoiceDto[];
}
