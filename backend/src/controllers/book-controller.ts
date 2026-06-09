import { BookService, CreateBookData, UpdateBookData, BookFilter } from '../services/index.js';
import { requireAuth, requireAdmin } from '../middleware/index.js';
import { parse } from 'url';

const bookService = new BookService();

export class BookController {
  async handleRequest(req: any, res: any, body: any): Promise<void> {
    const { method } = req;
    const parsedUrl = parse(req.url || '', true);
    const pathname = parsedUrl.pathname || '';
    const query = parsedUrl.query;

    if (pathname === '/api/books' && method === 'POST') {
      await this.createBook(req, res, body);
      return;
    }

    if (pathname === '/api/books' && method === 'GET') {
      await this.getBooks(req, res, query);
      return;
    }

    if (pathname.startsWith('/api/books/') && method === 'GET') {
      const id = pathname.slice('/api/books/'.length);
      await this.getBookById(req, res, id);
      return;
    }

    if (pathname.startsWith('/api/books/') && method === 'PUT') {
      const id = pathname.slice('/api/books/'.length);
      await this.updateBook(req, res, id, body);
      return;
    }

    if (pathname.startsWith('/api/books/') && method === 'DELETE') {
      const id = pathname.slice('/api/books/'.length);
      await this.deleteBook(req, res, id);
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }

  private async createBook(req: any, res: any, body: any): Promise<void> {
    try {
      const userId = await requireAuth(req, res);
      if (!userId) return;
      if (!requireAdmin(userId, res)) return;

      const data: CreateBookData = {
        title: body.title,
        author: body.author,
        isbn: body.isbn,
        price: body.price,
        stock: body.stock,
        category: body.category,
        description: body.description,
        imageUrl: body.imageUrl
      };

      const result = await bookService.createBook(data);
      if (result.error) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: result.error }));
        return;
      }

      res.writeHead(201);
      res.end(JSON.stringify(result.book));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }

  private async getBooks(req: any, res: any, query: any): Promise<void> {
    try {
      const filter: BookFilter = {
        category: query.category,
        minPrice: query.minPrice ? parseFloat(query.minPrice) : undefined,
        maxPrice: query.maxPrice ? parseFloat(query.maxPrice) : undefined,
        search: query.search
      };

      const page = parseInt(query.page) || 1;
      const limit = parseInt(query.limit) || 20;

      const result = await bookService.getBooks(filter, page, limit);

      res.writeHead(200);
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }

  private async getBookById(req: any, res: any, id: string): Promise<void> {
    try {
      const book = await bookService.getBookById(id);
      if (!book) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Book not found' }));
        return;
      }

      res.writeHead(200);
      res.end(JSON.stringify(book));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }

  private async updateBook(req: any, res: any, id: string, body: any): Promise<void> {
    try {
      const userId = await requireAuth(req, res);
      if (!userId) return;
      if (!requireAdmin(userId, res)) return;

      const data: UpdateBookData = {
        title: body.title,
        author: body.author,
        isbn: body.isbn,
        price: body.price,
        stock: body.stock,
        category: body.category,
        description: body.description,
        imageUrl: body.imageUrl
      };

      const result = await bookService.updateBook(id, data);
      if (result.error) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: result.error }));
        return;
      }

      if (!result.book) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Book not found' }));
        return;
      }

      res.writeHead(200);
      res.end(JSON.stringify(result.book));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }

  private async deleteBook(req: any, res: any, id: string): Promise<void> {
    try {
      const userId = await requireAuth(req, res);
      if (!userId) return;
      if (!requireAdmin(userId, res)) return;

      const deleted = await bookService.deleteBook(id);
      if (!deleted) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Book not found' }));
        return;
      }

      res.writeHead(200);
      res.end(JSON.stringify({ message: 'Book deleted successfully' }));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }
}