import { IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PersonalizationChoiceDto {
  @ApiProperty({
    description: 'ID of the personalization option',
    example: 1
  })
  @IsNumber()
  optionId: number;

  @ApiProperty({
    description: 'IDs of the selected choices',
    example: [1, 2],
    type: [Number]
  })
  @IsArray()
  @IsNumber({}, { each: true })
  choiceIds: number[];
}
