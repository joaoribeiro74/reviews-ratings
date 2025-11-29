import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateItemDto {
  @ApiProperty({ example: 'Produto X' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({ example: 'Descrição do item', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
