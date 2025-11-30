import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const user = await this.prisma.user.create({ data });
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return plainToInstance(UserResponseDto, users, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: number, data: Prisma.UserUpdateInput) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    delete data.email;
    delete data.password;
    delete data.role;

    if (data.username) {
      const now = new Date();

      if (user.lastUsernameChange) {
        const threeMonthsMs = 90 * 24 * 60 * 60 * 1000;
        const diff =
          now.getTime() - new Date(user.lastUsernameChange).getTime();

        if (diff < threeMonthsMs) {
          const daysLeft = Math.ceil(
            (threeMonthsMs - diff) / (1000 * 60 * 60 * 24),
          );
          throw new ForbiddenException(
            `Você só pode alterar seu username novamente em ${daysLeft} dias.`,
          );
        }
      }

      data.lastUsernameChange = now;

      const existing = await this.prisma.user.findUnique({
        where: { username: data.username as string },
      });

      if (existing && existing.id !== id) {
        throw new ForbiddenException('Esse username já está em uso.');
      }
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data,
    });

    return plainToInstance(UserResponseDto, updated, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    await this.prisma.user.delete({ where: { id } });
    return { message: 'Usuário removido com sucesso.' };
  }
}
