import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { ItemResponseDto } from './dto/item-response.dto';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  async create(data) {
    const item = await this.prisma.item.create({ data });
    return plainToInstance(ItemResponseDto, item, {
      excludeExtraneousValues: true,
    });
  }

  async findAll() {
    const items = await this.prisma.item.findMany();
    return Promise.all(items.map((item) => this.attachStats(item)));
  }

  async findOne(id: number) {
    const item = await this.prisma.item.findUnique({
      where: { id },
    });

    if (!item) throw new NotFoundException('Item não encontrado.');

    return this.attachStats(item);
  }

  async getStats(id: number) {
    const item = await this.prisma.item.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Item não encontrado.');

    return this.calculateStats(id);
  }

  async update(id: number, data) {
    const existing = await this.prisma.item.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Item não encontrado.');

    const updated = await this.prisma.item.update({
      where: { id },
      data,
    });

    return this.attachStats(updated);
  }

  async remove(id: number) {
    const existing = await this.prisma.item.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Item não encontrado.');

    return this.prisma.item.delete({ where: { id } });
  }

  // -----------------------------------------------
  // Helpers
  // -----------------------------------------------
  private async calculateStats(itemId: number) {
    const totalReviews = await this.prisma.review.count({ where: { itemId } });

    const ratingsData = await this.prisma.rating.findMany({
      where: { itemId },
      select: { value: true },
    });

    const totalRatings = ratingsData.length;

    const averageRating =
      totalRatings > 0
        ? ratingsData.reduce((s, r) => s + r.value, 0) / totalRatings
        : null;

    return {
      totalReviews,
      totalRatings,
      averageRating,
    };
  }

  private async attachStats(item: any) {
    const stats = await this.calculateStats(item.id);

    return plainToInstance(
      ItemResponseDto,
      {
        ...item,
        ...stats,
      },
      { excludeExtraneousValues: true },
    );
  }
}
