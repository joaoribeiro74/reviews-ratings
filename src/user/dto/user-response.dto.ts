import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'Avatar do usuário',
    required: false,
  })
  @Expose()
  avatar?: string;

  @ApiProperty({
    example: 'Biografia do usuário',
    description: 'Bio do perfil',
    required: false,
  })
  @Expose()
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
