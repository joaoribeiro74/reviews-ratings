import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ItemResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty({ required: false })
  @Expose()
  description?: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  // Estatísticas
  @ApiProperty({ example: 4.2, required: false })
  @Expose()
  averageRating?: number;

  @ApiProperty({ example: 12 })
  @Expose()
  totalReviews: number;

  @ApiProperty({ example: 19 })
  @Expose()
  totalRatings: number;
}
