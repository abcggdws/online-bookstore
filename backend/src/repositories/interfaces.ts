import { User, Book, CartItem, Order, Review, AuthToken } from '../models/index.js';

export interface UserRepository {
  findAll(): User[];
  findById(id: string): User | undefined;
  findByEmail(email: string): User | undefined;
  findByUsername(username: string): User | undefined;
  create(user: User): User;
  update(id: string, user: Partial<User>): User | undefined;
  delete(id: string): boolean;
}

export interface BookRepository {
  findAll(): Book[];
  findById(id: string): Book | undefined;
  findByIsbn(isbn: string): Book | undefined;
  findByCategory(category: string): Book[];
  search(query: string): Book[];
  create(book: Book): Book;
  update(id: string, book: Partial<Book>): Book | undefined;
  delete(id: string): boolean;
}

export interface CartRepository {
  findByUserId(userId: string): CartItem[];
  findByUserIdAndBookId(userId: string, bookId: string): CartItem | undefined;
  create(item: CartItem): CartItem;
  update(id: string, item: Partial<CartItem>): CartItem | undefined;
  delete(id: string): boolean;
  deleteByUserId(userId: string): boolean;
}

export interface OrderRepository {
  findAll(): Order[];
  findById(id: string): Order | undefined;
  findByUserId(userId: string): Order[];
  create(order: Order): Order;
  update(id: string, order: Partial<Order>): Order | undefined;
  delete(id: string): boolean;
}

export interface ReviewRepository {
  findAll(): Review[];
  findById(id: string): Review | undefined;
  findByBookId(bookId: string): Review[];
  findByUserId(userId: string): Review[];
  findByUserIdAndBookId(userId: string, bookId: string): Review | undefined;
  create(review: Review): Review;
  update(id: string, review: Partial<Review>): Review | undefined;
  delete(id: string): boolean;
}

export interface AuthTokenRepository {
  findByToken(token: string): AuthToken | undefined;
  findByUserId(userId: string): AuthToken[];
  create(token: AuthToken): AuthToken;
  delete(token: string): boolean;
  deleteByUserId(userId: string): boolean;
}