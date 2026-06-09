import { CartItem, Book } from '../models/index.js';
import { JsonCartRepository, JsonBookRepository } from '../repositories/index.js';
import { generateId, formatDate } from '../utils/index.js';

const cartRepo = new JsonCartRepository();
const bookRepo = new JsonBookRepository();

export interface AddToCartData {
  userId: string;
  bookId: string;
  quantity: number;
}

export interface UpdateCartItemData {
  quantity: number;
}

export class CartService {
  async addToCart(data: AddToCartData): Promise<{ item: CartItem | null; error?: string }> {
    const book = bookRepo.findById(data.bookId);
    if (!book) {
      return { item: null, error: 'Book not found' };
    }

    if (book.stock < data.quantity) {
      return { item: null, error: 'Insufficient stock' };
    }

    const existingItem = cartRepo.findByUserIdAndBookId(data.userId, data.bookId);
    if (existingItem) {
      const newQuantity = existingItem.quantity + data.quantity;
      if (book.stock < newQuantity) {
        return { item: null, error: 'Insufficient stock for total quantity' };
      }
      const updated = cartRepo.update(existingItem.id, { quantity: newQuantity });
      return { item: updated || null };
    }

    const now = formatDate(new Date());
    const item: CartItem = {
      id: generateId(),
      userId: data.userId,
      bookId: data.bookId,
      quantity: data.quantity,
      createdAt: now,
      updatedAt: now
    };

    cartRepo.create(item);
    return { item };
  }

  async getCart(userId: string): Promise<{ items: (CartItem & { book: Book })[]; total: number }> {
    const cartItems = cartRepo.findByUserId(userId);
    const itemsWithBooks = cartItems.map(item => {
      const book = bookRepo.findById(item.bookId);
      return { ...item, book: book! };
    });

    const total = itemsWithBooks.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
    return { items: itemsWithBooks, total };
  }

  async updateCartItem(id: string, userId: string, data: UpdateCartItemData): Promise<{ item: CartItem | null; error?: string }> {
    const cartItems = cartRepo.findByUserId(userId);
    const item = cartItems.find(i => i.id === id);
    if (!item) {
      return { item: null, error: 'Cart item not found' };
    }

    const book = bookRepo.findById(item.bookId);
    if (!book) {
      return { item: null, error: 'Book not found' };
    }

    if (book.stock < data.quantity) {
      return { item: null, error: 'Insufficient stock' };
    }

    const updated = cartRepo.update(id, { quantity: data.quantity });
    return { item: updated || null };
  }

  async removeFromCart(id: string, userId: string): Promise<boolean> {
    const cartItems = cartRepo.findByUserId(userId);
    const item = cartItems.find(i => i.id === id);
    if (!item) return false;
    return cartRepo.delete(id);
  }

  async clearCart(userId: string): Promise<boolean> {
    return cartRepo.deleteByUserId(userId);
  }
}