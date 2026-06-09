import { User, Book, CartItem, Order, Review, AuthToken } from '../models/index.js';
import { UserRepository, BookRepository, CartRepository, OrderRepository, ReviewRepository, AuthTokenRepository } from './interfaces.js';
import { loadData, saveData } from '../utils/index.js';

export class JsonUserRepository implements UserRepository {
  private filename = 'users.json';

  findAll(): User[] {
    return loadData<User>(this.filename);
  }

  findById(id: string): User | undefined {
    const users = this.findAll();
    return users.find(u => u.id === id);
  }

  findByEmail(email: string): User | undefined {
    const users = this.findAll();
    return users.find(u => u.email === email);
  }

  findByUsername(username: string): User | undefined {
    const users = this.findAll();
    return users.find(u => u.username === username);
  }

  create(user: User): User {
    const users = this.findAll();
    users.push(user);
    saveData(this.filename, users);
    return user;
  }

  update(id: string, userData: Partial<User>): User | undefined {
    const users = this.findAll();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return undefined;
    users[index] = { ...users[index], ...userData, updatedAt: new Date().toISOString() };
    saveData(this.filename, users);
    return users[index];
  }

  delete(id: string): boolean {
    const users = this.findAll();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return false;
    users.splice(index, 1);
    saveData(this.filename, users);
    return true;
  }
}

export class JsonBookRepository implements BookRepository {
  private filename = 'books.json';

  findAll(): Book[] {
    return loadData<Book>(this.filename);
  }

  findById(id: string): Book | undefined {
    const books = this.findAll();
    return books.find(b => b.id === id);
  }

  findByIsbn(isbn: string): Book | undefined {
    const books = this.findAll();
    return books.find(b => b.isbn === isbn);
  }

  findByCategory(category: string): Book[] {
    const books = this.findAll();
    return books.filter(b => b.category === category);
  }

  search(query: string): Book[] {
    const books = this.findAll();
    const lowerQuery = query.toLowerCase();
    return books.filter(b => 
      b.title.toLowerCase().includes(lowerQuery) ||
      b.author.toLowerCase().includes(lowerQuery) ||
      b.isbn.toLowerCase().includes(lowerQuery)
    );
  }

  create(book: Book): Book {
    const books = this.findAll();
    books.push(book);
    saveData(this.filename, books);
    return book;
  }

  update(id: string, bookData: Partial<Book>): Book | undefined {
    const books = this.findAll();
    const index = books.findIndex(b => b.id === id);
    if (index === -1) return undefined;
    books[index] = { ...books[index], ...bookData, updatedAt: new Date().toISOString() };
    saveData(this.filename, books);
    return books[index];
  }

  delete(id: string): boolean {
    const books = this.findAll();
    const index = books.findIndex(b => b.id === id);
    if (index === -1) return false;
    books.splice(index, 1);
    saveData(this.filename, books);
    return true;
  }
}

export class JsonCartRepository implements CartRepository {
  private filename = 'cart_items.json';

  findByUserId(userId: string): CartItem[] {
    const items = loadData<CartItem>(this.filename);
    return items.filter(i => i.userId === userId);
  }

  findByUserIdAndBookId(userId: string, bookId: string): CartItem | undefined {
    const items = loadData<CartItem>(this.filename);
    return items.find(i => i.userId === userId && i.bookId === bookId);
  }

  create(item: CartItem): CartItem {
    const items = loadData<CartItem>(this.filename);
    items.push(item);
    saveData(this.filename, items);
    return item;
  }

  update(id: string, itemData: Partial<CartItem>): CartItem | undefined {
    const items = loadData<CartItem>(this.filename);
    const index = items.findIndex(i => i.id === id);
    if (index === -1) return undefined;
    items[index] = { ...items[index], ...itemData, updatedAt: new Date().toISOString() };
    saveData(this.filename, items);
    return items[index];
  }

  delete(id: string): boolean {
    const items = loadData<CartItem>(this.filename);
    const index = items.findIndex(i => i.id === id);
    if (index === -1) return false;
    items.splice(index, 1);
    saveData(this.filename, items);
    return true;
  }

  deleteByUserId(userId: string): boolean {
    const items = loadData<CartItem>(this.filename);
    const filtered = items.filter(i => i.userId !== userId);
    saveData(this.filename, filtered);
    return true;
  }
}

export class JsonOrderRepository implements OrderRepository {
  private filename = 'orders.json';

  findAll(): Order[] {
    return loadData<Order>(this.filename);
  }

  findById(id: string): Order | undefined {
    const orders = this.findAll();
    return orders.find(o => o.id === id);
  }

  findByUserId(userId: string): Order[] {
    const orders = this.findAll();
    return orders.filter(o => o.userId === userId);
  }

  create(order: Order): Order {
    const orders = this.findAll();
    orders.push(order);
    saveData(this.filename, orders);
    return order;
  }

  update(id: string, orderData: Partial<Order>): Order | undefined {
    const orders = this.findAll();
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) return undefined;
    orders[index] = { ...orders[index], ...orderData, updatedAt: new Date().toISOString() };
    saveData(this.filename, orders);
    return orders[index];
  }

  delete(id: string): boolean {
    const orders = this.findAll();
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) return false;
    orders.splice(index, 1);
    saveData(this.filename, orders);
    return true;
  }
}

export class JsonReviewRepository implements ReviewRepository {
  private filename = 'reviews.json';

  findAll(): Review[] {
    return loadData<Review>(this.filename);
  }

  findById(id: string): Review | undefined {
    const reviews = this.findAll();
    return reviews.find(r => r.id === id);
  }

  findByBookId(bookId: string): Review[] {
    const reviews = this.findAll();
    return reviews.filter(r => r.bookId === bookId);
  }

  findByUserId(userId: string): Review[] {
    const reviews = this.findAll();
    return reviews.filter(r => r.userId === userId);
  }

  findByUserIdAndBookId(userId: string, bookId: string): Review | undefined {
    const reviews = this.findAll();
    return reviews.find(r => r.userId === userId && r.bookId === bookId);
  }

  create(review: Review): Review {
    const reviews = this.findAll();
    reviews.push(review);
    saveData(this.filename, reviews);
    return review;
  }

  update(id: string, reviewData: Partial<Review>): Review | undefined {
    const reviews = this.findAll();
    const index = reviews.findIndex(r => r.id === id);
    if (index === -1) return undefined;
    reviews[index] = { ...reviews[index], ...reviewData, updatedAt: new Date().toISOString() };
    saveData(this.filename, reviews);
    return reviews[index];
  }

  delete(id: string): boolean {
    const reviews = this.findAll();
    const index = reviews.findIndex(r => r.id === id);
    if (index === -1) return false;
    reviews.splice(index, 1);
    saveData(this.filename, reviews);
    return true;
  }
}

export class JsonAuthTokenRepository implements AuthTokenRepository {
  private filename = 'auth_tokens.json';

  findByToken(token: string): AuthToken | undefined {
    const tokens = loadData<AuthToken>(this.filename);
    return tokens.find(t => t.token === token);
  }

  findByUserId(userId: string): AuthToken[] {
    const tokens = loadData<AuthToken>(this.filename);
    return tokens.filter(t => t.userId === userId);
  }

  create(token: AuthToken): AuthToken {
    const tokens = loadData<AuthToken>(this.filename);
    tokens.push(token);
    saveData(this.filename, tokens);
    return token;
  }

  delete(token: string): boolean {
    const tokens = loadData<AuthToken>(this.filename);
    const index = tokens.findIndex(t => t.token === token);
    if (index === -1) return false;
    tokens.splice(index, 1);
    saveData(this.filename, tokens);
    return true;
  }

  deleteByUserId(userId: string): boolean {
    const tokens = loadData<AuthToken>(this.filename);
    const filtered = tokens.filter(t => t.userId !== userId);
    saveData(this.filename, filtered);
    return true;
  }
}