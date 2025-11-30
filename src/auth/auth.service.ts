import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangeEmailDto } from './dto/change-email.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, username, name } = registerDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email já está em uso.');
    }

    const existingUsername = await this.prisma.user.findUnique({
      where: { username },
    });
    if (existingUsername) {
      throw new ConflictException('Username já está em uso.');
    }

    if (password.length < 6)
      throw new BadRequestException(
        'A senha deve ter pelo menos 6 caracteres.',
      );

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: { email, username, password: hashedPassword, name },
    });

    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('E-mail não cadastrado.');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Senha incorreta.');

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      username: user.username,
    };
    const token = await this.jwtService.signAsync(payload);

    return { access_token: token };
  }

  async changeEmail(userId: number, dto: ChangeEmailDto) {
    const { newEmail, currentPassword } = dto;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('Usuário não encontrado.');

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch)
      throw new UnauthorizedException('Senha atual incorreta.');

    const emailExists = await this.prisma.user.findUnique({
      where: { email: newEmail },
    });
    if (emailExists) throw new ConflictException('E-mail já está em uso.');

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { email: newEmail },
    });

    return {
      message: 'E-mail atualizado com sucesso.',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
      },
    };
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const { currentPassword, newPassword } = dto;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('Usuário não encontrado.');

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch)
      throw new UnauthorizedException('Senha atual incorreta.');

    if (newPassword.length < 6)
      throw new BadRequestException(
        'A nova senha deve ter pelo menos 6 caracteres.',
      );

    if (await bcrypt.compare(newPassword, user.password))
      throw new BadRequestException(
        'A nova senha não pode ser igual à anterior.',
      );

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return { message: 'Senha atualizada com sucesso.' };
  }
}
