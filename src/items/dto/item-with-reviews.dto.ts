// item-with-reviews.dto.ts
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

class ReviewUserDto {
  @ApiProperty({
    example: 12,
    description: "ID do usuário que fez a review",
  })
  @Expose()
  id: number;

  @ApiProperty({
    example: "john_doe",
    description: "Nome de usuário do autor da review",
  })
  @Expose()
  username: string;
}

class ReviewDto {
   @ApiProperty({
    example: 5,
    description: "ID da review",
  })
  @Expose()
  id: number;

  @ApiProperty({
    example: "Ótimo item, recomendo!",
    nullable: true,
    description: "Conteúdo da review do usuário",
  })
  @Expose()
  content: string;

  @ApiProperty({
    example: "2025-01-15T12:34:56.000Z",
    description: "Data de criação da review",
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    type: ReviewUserDto,
    description: "Informações do autor da review",
  })
  @Expose()
  user: ReviewUserDto;
}

export class ItemWithReviewsDto {
  @ApiProperty({
    example: 1,
    description: "ID do item",
  })
  @Expose()
  id: number;

  @ApiProperty({
    example: "The Witcher 3: Wild Hunt",
    description: "Título do item",
  })
  @Expose()
  title: string;

   @ApiPropertyOptional({
    example: "RPG de mundo aberto com uma história envolvente.",
    required: false,
    nullable: true,
    description: "Descrição opcional do item",
  })
  @Expose()
  description?: string;

  @ApiProperty({
    example: "2025-01-10T10:00:00.000Z",
    description: "Data de criação do item",
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: "2025-01-11T11:30:00.000Z",
    description: "Data da última atualização",
  })
  @Expose()
  updatedAt: Date;

  @ApiProperty({
    type: [ReviewDto],
    description: "Lista de reviews associadas ao item",
  })
  @Expose()
  @Type(() => ReviewDto)
  reviews: ReviewDto[];
}
