import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeEmailDto {
  @ApiProperty({
    example: 'novoemail@example.com',
    description: 'Novo e-mail que substituirá o atual.',
  })
  @IsEmail()
  newEmail: string;

  @ApiProperty({
    example: 'senhaAtual123',
    description: 'Senha atual do usuário para confirmar a alteração.',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  currentPassword: string;
}
