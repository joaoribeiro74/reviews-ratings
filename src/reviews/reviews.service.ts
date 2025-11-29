import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewResponseDto } from './dto/review-response.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, data: CreateReviewDto) {
    const existing = await this.prisma.review.findUnique({
      where: { userId_itemId: { userId, itemId: data.itemId } },
    });

    if (existing)
      throw new BadRequestException('Você já criou um review para este item.');

    const review = await this.prisma.review.create({
      data: { ...data, userId },
    });

    return plainToInstance(ReviewResponseDto, review, {
      excludeExtraneousValues: true,
    });
  }

  async findAll() {
    const reviews = await this.prisma.review.findMany();
    return plainToInstance(ReviewResponseDto, reviews, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: number) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review não encontrado.');

    return plainToInstance(ReviewResponseDto, review, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: number, userId: number, data: UpdateReviewDto) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review não encontrado.');

    if (review.userId !== userId)
      throw new ForbiddenException('Você não pode editar este review.');

    const updated = await this.prisma.review.update({
      where: { id },
      data,
    });

    return plainToInstance(ReviewResponseDto, updated, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: number, userId: number) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review não encontrado.');

    if (review.userId !== userId)
      throw new ForbiddenException('Você não pode deletar este review.');

    await this.prisma.review.delete({ where: { id } });

    return { message: 'Review removido com sucesso.' };
  }

  async findByItemWithStats(itemId: number) {
    const reviews = await this.prisma.review.findMany({
      where: { itemId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, username: true, avatar: true },
        },
      },
    });

    const totalReviews = reviews.length;

    const ratings = await this.prisma.rating.findMany({
      where: { itemId },
      select: { value: true },
    });

    const totalRatings = ratings.length;
    const averageRating =
      totalRatings > 0
        ? ratings.reduce((sum, r) => sum + r.value, 0) / totalRatings
        : null;

    return {
      itemId,
      statistics: {
        totalReviews,
        totalRatings,
        averageRating,
      },
      reviews: reviews.map((r) =>
        plainToInstance(
          ReviewResponseDto,
          {
            ...r,
            userId: r.user.id,
          },
          { excludeExtraneousValues: true },
        ),
      ),
    };
  }
}
