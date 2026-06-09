import { Book } from '../models/index.js';
import { JsonBookRepository } from '../repositories/index.js';
import { generateId, formatDate, paginate } from '../utils/index.js';

const bookRepo = new JsonBookRepository();

export interface CreateBookData {
  title: string;
  author: string;
  isbn: string;
  price: number;
  stock: number;
  category: string;
  description?: string;
  imageUrl?: string;
}

export interface UpdateBookData {
  title?: string;
  author?: string;
  isbn?: string;
  price?: number;
  stock?: number;
  category?: string;
  description?: string;
  imageUrl?: string;
}

export interface BookFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export class BookService {
  async createBook(data: CreateBookData): Promise<{ book: Book | null; error?: string }> {
    if (!data.title || !data.author || !data.isbn || !data.price || !data.stock) {
      return { book: null, error: 'Title, author, ISBN, price and stock are required' };
    }

    if (data.price < 0) {
      return { book: null, error: 'Price must be positive' };
    }

    if (data.stock < 0) {
      return { book: null, error: 'Stock must be non-negative' };
    }

    if (bookRepo.findByIsbn(data.isbn)) {
      return { book: null, error: 'ISBN already exists' };
    }

    const now = formatDate(new Date());
    const book: Book = {
      id: generateId(),
      title: data.title,
      author: data.author,
      isbn: data.isbn,
      price: data.price,
      stock: data.stock,
      category: data.category,
      description: data.description,
      imageUrl: data.imageUrl,
      createdAt: now,
      updatedAt: now
    };

    bookRepo.create(book);
    return { book };
  }

  async getBookById(id: string): Promise<Book | null> {
    return bookRepo.findById(id) || null;
  }

  async getBooks(filter: BookFilter, page: number = 1, limit: number = 20): Promise<any> {
    let books = bookRepo.findAll();

    if (filter.search) {
      books = bookRepo.search(filter.search);
    }

    if (filter.category) {
      books = books.filter(b => b.category === filter.category);
    }

    if (filter.minPrice !== undefined) {
      books = books.filter(b => b.price >= filter.minPrice!);
    }

    if (filter.maxPrice !== undefined) {
      books = books.filter(b => b.price <= filter.maxPrice!);
    }

    return paginate(books, page, limit);
  }

  async updateBook(id: string, data: UpdateBookData): Promise<{ book: Book | null; error?: string }> {
    if (data.isbn) {
      const existing = bookRepo.findByIsbn(data.isbn);
      if (existing && existing.id !== id) {
        return { book: null, error: 'ISBN already exists' };
      }
    }

    if (data.price && data.price < 0) {
      return { book: null, error: 'Price must be positive' };
    }

    if (data.stock && data.stock < 0) {
      return { book: null, error: 'Stock must be non-negative' };
    }

    const book = bookRepo.update(id, data);
    return { book: book || null };
  }

  async deleteBook(id: string): Promise<boolean> {
    return bookRepo.delete(id);
  }

  async updateStock(id: string, quantity: number): Promise<{ book: Book | null; error?: string }> {
    const book = bookRepo.findById(id);
    if (!book) {
      return { book: null, error: 'Book not found' };
    }

    const newStock = book.stock - quantity;
    if (newStock < 0) {
      return { book: null, error: 'Insufficient stock' };
    }

    const updated = bookRepo.update(id, { stock: newStock });
    return { book: updated || null };
  }
}