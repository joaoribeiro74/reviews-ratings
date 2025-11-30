import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'John Doe',
    maxLength: 40,
    description: 'Nome do usuário (máximo 40 caracteres)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  name?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'URL do avatar',
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({
    example: 'Biografia atualizada.',
    description: 'Descrição pessoal do usuário',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    example: 'john_doe',
    description: 'Username do usuário (apenas alterável a cada 3 meses)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(30) // ou o limite que você definiu no banco
  username?: string;
}
