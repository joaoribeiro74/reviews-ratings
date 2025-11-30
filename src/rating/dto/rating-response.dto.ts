import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RatingResponseDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  itemId: number;

  @Expose()
  @ApiProperty()
  userId: number;

  @Expose()
  @ApiProperty()
  value: number;

  @Exclude()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}
