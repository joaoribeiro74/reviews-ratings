import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 12, description: 'ID do item que receberá o review' })
  @IsInt({ message: 'O campo itemId deve ser um número inteiro.' })
  itemId: number;

  @ApiProperty({
    example: 'Ótimo item, recomendo!',
    required: false,
    description: 'Conteúdo opcional do review. Mínimo de 3 caracteres.',
  })
  @IsOptional()
  @IsString({ message: 'O campo content deve ser uma string.' })
  @MinLength(3, { message: 'O review deve ter pelo menos 3 caracteres.' })
  content?: string;
}
