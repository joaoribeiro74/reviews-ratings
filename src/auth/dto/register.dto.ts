import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, MaxLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'joao@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'joao' })
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  name?: string; // nome de exibição opcional
}
