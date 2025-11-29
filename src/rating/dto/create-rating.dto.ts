import { IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRatingDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  itemId: number;

  @ApiProperty({
    example: 3.5,
    description: 'Nota entre 0.5 e 5.0 em passos de 0.5.',
  })
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0.5)
  @Max(5)
  value: number;
}
