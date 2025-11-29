import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReviewDto {
  @ApiProperty({
    example: 'Editando meu review porque mudei de opinião.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'O campo content deve ser uma string.' })
  @MinLength(3, { message: 'O review deve ter pelo menos 3 caracteres.' })
  content?: string;
}
