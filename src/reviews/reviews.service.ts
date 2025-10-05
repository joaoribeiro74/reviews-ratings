import { Injectable, NotFoundException } from '@nestjs/common';
import { Review } from './interfaces/review.interface';


@Injectable()
export class ReviewsService {
    private reviews: Review[] = [];

  create(review: Review): Review {
    this.reviews.push(review);
    return review;
  }

  findAll(): Review[] {
    return this.reviews;
  }

  findOne(id: number): Review {
    const review = this.reviews.find(r => r.id === id);
    if (!review) throw new NotFoundException('Review não encontrada');
    return review;
  }

  update(id: number, data: Partial<Review>): Review {
    const review = this.findOne(id);
    Object.assign(review, data);
    return review;
  }

  remove(id: number): void {
    const index = this.reviews.findIndex(r => r.id === id);
    if (index === -1) throw new NotFoundException('Review não encontrada');
    this.reviews.splice(index, 1);
  }
}
