import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class ProfileResponseDto {
  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiPropertyOptional()
  @Expose()
  @Transform(({ value }) => value ?? undefined)
  bio?: string;

  @ApiPropertyOptional()
  @Expose()
  @Transform(({ value }) => value ?? undefined)
  avatar?: string;
}
