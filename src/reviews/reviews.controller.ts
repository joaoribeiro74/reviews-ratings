import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import type { Review } from './interfaces/review.interface';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @HttpCode(201)
  create(@Body() body: Review) {
    return this.reviewsService.create(body);
  }

  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: Partial<Review>) {
    return this.reviewsService.update(Number(id), body);
  }

  @Patch(':id')
  partialUpdate(@Param('id') id: string, @Body() body: Partial<Review>) {
    return this.reviewsService.update(Number(id), body);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(Number(id));
  }
}
