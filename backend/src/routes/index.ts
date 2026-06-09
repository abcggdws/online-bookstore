import { UserController, BookController, CartController, OrderController, ReviewController } from '../controllers/index.js';
import { parse } from 'url';

const userController = new UserController();
const bookController = new BookController();
const cartController = new CartController();
const orderController = new OrderController();
const reviewController = new ReviewController();

export async function handleRequest(req: any, res: any, body: any): Promise<void> {
  const { method } = req;
  const parsedUrl = parse(req.url || '', true);
  const pathname = parsedUrl.pathname || '';

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (pathname === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'healthy', uptime: process.uptime() }));
    return;
  }

  if (pathname.startsWith('/api/users')) {
    await userController.handleRequest(req, res, body);
    return;
  }

  if (pathname.startsWith('/api/books')) {
    await bookController.handleRequest(req, res, body);
    return;
  }

  if (pathname.startsWith('/api/cart')) {
    await cartController.handleRequest(req, res, body);
    return;
  }

  if (pathname.startsWith('/api/orders')) {
    await orderController.handleRequest(req, res, body);
    return;
  }

  if (pathname.startsWith('/api/reviews')) {
    await reviewController.handleRequest(req, res, body);
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
}