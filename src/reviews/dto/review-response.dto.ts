import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ReviewResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty({ required: false })
  @Expose()
  content?: string;

  @ApiProperty()
  @Expose()
  itemId: number;

  @ApiProperty()
  @Expose()
  userId: number;

  @ApiProperty()
  @Exclude()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? undefined)
  updatedAt: Date;
}
