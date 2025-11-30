import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: 1,
    description: 'ID do usuário',
  })
  @Expose()
  id: number;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email do usuário',
  })
  @Expose()
  email: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'Username do usuário',
  })
  @Expose()
  username: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Nome do usuário',
    required: false,
  })
  @Expose()
  name?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'Avatar do usuário',
    required: false,
  })
  @Expose()
  @Transform(({ value }) => value ?? undefined)
  avatar?: string;

  @ApiPropertyOptional({
    example: 'Biografia do usuário',
    description: 'Bio do perfil',
    required: false,
  })
  @Expose()
  @Transform(({ value }) => value ?? undefined)
  bio?: string;

  @Exclude()
  role: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  password: string;
}
