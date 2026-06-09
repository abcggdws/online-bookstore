import { Order, OrderItem, ShippingAddress } from '../models/index.js';
import { JsonOrderRepository, JsonCartRepository, JsonBookRepository } from '../repositories/index.js';
import { generateId, formatDate } from '../utils/index.js';

const orderRepo = new JsonOrderRepository();
const cartRepo = new JsonCartRepository();
const bookRepo = new JsonBookRepository();

export interface CreateOrderData {
  userId: string;
  shippingAddress: ShippingAddress;
}

export class OrderService {
  async createOrder(data: CreateOrderData): Promise<{ order: Order | null; error?: string }> {
    const cartItems = cartRepo.findByUserId(data.userId);
    if (cartItems.length === 0) {
      return { order: null, error: 'Cart is empty' };
    }

    const orderItems: OrderItem[] = [];
    let totalAmount = 0;

    for (const item of cartItems) {
      const book = bookRepo.findById(item.bookId);
      if (!book) {
        return { order: null, error: `Book ${item.bookId} not found` };
      }

      if (book.stock < item.quantity) {
        return { order: null, error: `Insufficient stock for ${book.title}` };
      }

      orderItems.push({
        bookId: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        quantity: item.quantity
      });

      totalAmount += book.price * item.quantity;
      bookRepo.update(book.id, { stock: book.stock - item.quantity });
    }

    const now = formatDate(new Date());
    const order: Order = {
      id: generateId(),
      userId: data.userId,
      items: orderItems,
      totalAmount,
      status: 'pending',
      shippingAddress: data.shippingAddress,
      createdAt: now,
      updatedAt: now
    };

    orderRepo.create(order);
    cartRepo.deleteByUserId(data.userId);

    return { order };
  }

  async getOrderById(id: string): Promise<Order | null> {
    return orderRepo.findById(id) || null;
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return orderRepo.findByUserId(userId);
  }

  async getAllOrders(): Promise<Order[]> {
    return orderRepo.findAll();
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<{ order: Order | null; error?: string }> {
    const order = orderRepo.update(id, { status });
    return { order: order || null };
  }

  async cancelOrder(id: string, userId: string): Promise<{ order: Order | null; error?: string }> {
    const order = orderRepo.findById(id);
    if (!order) {
      return { order: null, error: 'Order not found' };
    }

    if (order.userId !== userId) {
      return { order: null, error: 'Not authorized to cancel this order' };
    }

    if (order.status !== 'pending') {
      return { order: null, error: 'Only pending orders can be cancelled' };
    }

    for (const item of order.items) {
      const book = bookRepo.findById(item.bookId);
      if (book) {
        bookRepo.update(book.id, { stock: book.stock + item.quantity });
      }
    }

    const cancelled = orderRepo.update(id, { status: 'cancelled' });
    return { order: cancelled || null };
  }
}