import { Review } from '../models/index.js';
import { JsonReviewRepository, JsonBookRepository } from '../repositories/index.js';
import { generateId, formatDate } from '../utils/index.js';

const reviewRepo = new JsonReviewRepository();
const bookRepo = new JsonBookRepository();

export interface CreateReviewData {
  userId: string;
  bookId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewData {
  rating?: number;
  comment?: string;
}

export class ReviewService {
  async createReview(data: CreateReviewData): Promise<{ review: Review | null; error?: string }> {
    const book = bookRepo.findById(data.bookId);
    if (!book) {
      return { review: null, error: 'Book not found' };
    }

    if (data.rating < 1 || data.rating > 5) {
      return { review: null, error: 'Rating must be between 1 and 5' };
    }

    const existing = reviewRepo.findByUserIdAndBookId(data.userId, data.bookId);
    if (existing) {
      return { review: null, error: 'You have already reviewed this book' };
    }

    const now = formatDate(new Date());
    const review: Review = {
      id: generateId(),
      userId: data.userId,
      bookId: data.bookId,
      rating: data.rating,
      comment: data.comment,
      createdAt: now,
      updatedAt: now
    };

    reviewRepo.create(review);
    return { review };
  }

  async getReviewsByBook(bookId: string): Promise<Review[]> {
    return reviewRepo.findByBookId(bookId);
  }

  async getReviewsByUser(userId: string): Promise<Review[]> {
    return reviewRepo.findByUserId(userId);
  }

  async updateReview(id: string, userId: string, data: UpdateReviewData): Promise<{ review: Review | null; error?: string }> {
    const review = reviewRepo.findById(id);
    if (!review) {
      return { review: null, error: 'Review not found' };
    }

    if (review.userId !== userId) {
      return { review: null, error: 'Not authorized to update this review' };
    }

    if (data.rating && (data.rating < 1 || data.rating > 5)) {
      return { review: null, error: 'Rating must be between 1 and 5' };
    }

    const updated = reviewRepo.update(id, data);
    return { review: updated || null };
  }

  async deleteReview(id: string, userId: string): Promise<boolean> {
    const review = reviewRepo.findById(id);
    if (!review || review.userId !== userId) return false;
    return reviewRepo.delete(id);
  }

  async getAverageRating(bookId: string): Promise<number> {
    const reviews = reviewRepo.findByBookId(bookId);
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / reviews.length;
  }
}