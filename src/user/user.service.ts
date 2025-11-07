import { Injectable, NotFoundException } from '@nestjs/common';
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
    return plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true });
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return plainToInstance(UserResponseDto, users, { excludeExtraneousValues: true });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    return plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true });
  }

  async update(id: number, data: Prisma.UserUpdateInput) {
    // Impede updates sensíveis por rota genérica
    delete data.password;
    delete data.email;
    delete data.role;

    const updated = await this.prisma.user.update({ where: { id }, data });
    return plainToInstance(UserResponseDto, updated, { excludeExtraneousValues: true });
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    await this.prisma.user.delete({ where: { id } });
    return { message: 'Usuário removido com sucesso.' };
  }
}
