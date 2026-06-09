import { ReviewService, CreateReviewData, UpdateReviewData } from '../services/index.js';
import { requireAuth } from '../middleware/index.js';
import { parse } from 'url';

const reviewService = new ReviewService();

export class ReviewController {
  async handleRequest(req: any, res: any, body: any): Promise<void> {
    const { method } = req;
    const parsedUrl = parse(req.url || '', true);
    const pathname = parsedUrl.pathname || '';

    if (pathname === '/api/reviews' && method === 'POST') {
      await this.createReview(req, res, body);
      return;
    }

    if (pathname === '/api/reviews' && method === 'GET') {
      await this.getReviewsByBook(req, res, parsedUrl.query);
      return;
    }

    if (pathname === '/api/reviews/my' && method === 'GET') {
      await this.getMyReviews(req, res);
      return;
    }

    if (pathname.startsWith('/api/reviews/') && method === 'PUT') {
      const id = pathname.slice('/api/reviews/'.length);
      await this.updateReview(req, res, id, body);
      return;
    }

    if (pathname.startsWith('/api/reviews/') && method === 'DELETE') {
      const id = pathname.slice('/api/reviews/'.length);
      await this.deleteReview(req, res, id);
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }

  private async createReview(req: any, res: any, body: any): Promise<void> {
    try {
      const userId = await requireAuth(req, res);
      if (!userId) return;

      const data: CreateReviewData = {
        userId,
        bookId: body.bookId,
        rating: body.rating,
        comment: body.comment
      };

      const result = await reviewService.createReview(data);
      if (result.error) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: result.error }));
        return;
      }

      res.writeHead(201);
      res.end(JSON.stringify(result.review));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }

  private async getReviewsByBook(req: any, res: any, query: any): Promise<void> {
    try {
      const bookId = query.bookId;
      if (!bookId) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'bookId is required' }));
        return;
      }

      const reviews = await reviewService.getReviewsByBook(bookId);
      const avgRating = await reviewService.getAverageRating(bookId);

      res.writeHead(200);
      res.end(JSON.stringify({ reviews, averageRating: avgRating }));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }

  private async getMyReviews(req: any, res: any): Promise<void> {
    try {
      const userId = await requireAuth(req, res);
      if (!userId) return;

      const reviews = await reviewService.getReviewsByUser(userId);

      res.writeHead(200);
      res.end(JSON.stringify({ reviews }));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }

  private async updateReview(req: any, res: any, id: string, body: any): Promise<void> {
    try {
      const userId = await requireAuth(req, res);
      if (!userId) return;

      const data: UpdateReviewData = {
        rating: body.rating,
        comment: body.comment
      };

      const result = await reviewService.updateReview(id, userId, data);
      if (result.error) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: result.error }));
        return;
      }

      if (!result.review) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Review not found' }));
        return;
      }

      res.writeHead(200);
      res.end(JSON.stringify(result.review));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }

  private async deleteReview(req: any, res: any, id: string): Promise<void> {
    try {
      const userId = await requireAuth(req, res);
      if (!userId) return;

      const deleted = await reviewService.deleteReview(id, userId);
      if (!deleted) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Review not found or not authorized' }));
        return;
      }

      res.writeHead(200);
      res.end(JSON.stringify({ message: 'Review deleted successfully' }));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }
}