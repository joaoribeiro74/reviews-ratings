import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { RatingResponseDto } from './dto/rating-response.dto';

@Injectable()
export class RatingService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, data: CreateRatingDto) {
    if ((data.value * 10) % 5 !== 0) {
      throw new BadRequestException('A nota deve estar em passos de 0.5.');
    }

    const existing = await this.prisma.rating.findUnique({
      where: { userId_itemId: { userId, itemId: data.itemId } },
    });

    if (existing) throw new BadRequestException('Você já avaliou este item.');

    const rating = await this.prisma.rating.create({
      data: { ...data, userId },
    });

    return plainToInstance(RatingResponseDto, rating, {
      excludeExtraneousValues: true,
    });
  }

  async findAll() {
    const ratings = await this.prisma.rating.findMany();
    return plainToInstance(RatingResponseDto, ratings, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: number) {
    const rating = await this.prisma.rating.findUnique({ where: { id } });
    if (!rating) throw new NotFoundException('Rating não encontrado.');

    return plainToInstance(RatingResponseDto, rating, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: number, userId: number, data: UpdateRatingDto) {
    const rating = await this.prisma.rating.findUnique({ where: { id } });
    if (!rating) throw new NotFoundException('Rating não encontrado.');

    if ((data.value * 10) % 5 !== 0) {
      throw new BadRequestException('A nota deve estar em passos de 0.5.');
    }

    if (rating.userId !== userId)
      throw new ForbiddenException('Você não pode editar esta nota.');

    const updated = await this.prisma.rating.update({
      where: { id },
      data,
    });

    return plainToInstance(RatingResponseDto, updated, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: number, userId: number) {
    const rating = await this.prisma.rating.findUnique({ where: { id } });
    if (!rating) throw new NotFoundException('Rating não encontrado.');

    if (rating.userId !== userId)
      throw new ForbiddenException('Você não pode deletar esta nota.');

    await this.prisma.rating.delete({ where: { id } });

    return { message: 'Rating removido com sucesso.' };
  }

  async getAverageForItem(itemId: number) {
    const ratings = await this.prisma.rating.findMany({
      where: { itemId },
      select: { value: true },
    });

    if (ratings.length === 0) return { itemId, totalRatings: 0, average: null };

    const average =
      ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length;

    return {
      itemId,
      totalRatings: ratings.length,
      average,
    };
  }
}
