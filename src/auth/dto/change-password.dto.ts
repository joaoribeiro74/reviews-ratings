import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'senhaAtual123',
    description: 'Senha atual usada como confirmação antes de alterar.',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  currentPassword: string;

  @ApiProperty({
    example: 'novaSenha456',
    description: 'Nova senha desejada.',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
