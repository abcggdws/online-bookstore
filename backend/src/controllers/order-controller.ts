import { OrderService, CreateOrderData } from '../services/index.js';
import { requireAuth, requireAdmin } from '../middleware/index.js';
import { parse } from 'url';

const orderService = new OrderService();

export class OrderController {
  async handleRequest(req: any, res: any, body: any): Promise<void> {
    const { method } = req;
    const parsedUrl = parse(req.url || '', true);
    const pathname = parsedUrl.pathname || '';

    if (pathname === '/api/orders' && method === 'POST') {
      await this.createOrder(req, res, body);
      return;
    }

    if (pathname === '/api/orders' && method === 'GET') {
      await this.getOrders(req, res);
      return;
    }

    if (pathname === '/api/orders/my' && method === 'GET') {
      await this.getMyOrders(req, res);
      return;
    }

    if (pathname.startsWith('/api/orders/') && pathname.endsWith('/cancel') && method === 'POST') {
      const id = pathname.slice('/api/orders/'.length, -'/cancel'.length);
      await this.cancelOrder(req, res, id);
      return;
    }

    if (pathname.startsWith('/api/orders/') && pathname.endsWith('/status') && method === 'PUT') {
      const id = pathname.slice('/api/orders/'.length, -'/status'.length);
      await this.updateOrderStatus(req, res, id, body);
      return;
    }

    if (pathname.startsWith('/api/orders/') && method === 'GET') {
      const id = pathname.slice('/api/orders/'.length);
      await this.getOrderById(req, res, id);
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }

  private async createOrder(req: any, res: any, body: any): Promise<void> {
    try {
      const userId = await requireAuth(req, res);
      if (!userId) return;

      const data: CreateOrderData = {
        userId,
        shippingAddress: body.shippingAddress
      };

      const result = await orderService.createOrder(data);
      if (result.error) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: result.error }));
        return;
      }

      res.writeHead(201);
      res.end(JSON.stringify(result.order));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }

  private async getOrders(req: any, res: any): Promise<void> {
    try {
      const userId = await requireAuth(req, res);
      if (!userId) return;
      if (!requireAdmin(userId, res)) return;

      const orders = await orderService.getAllOrders();

      res.writeHead(200);
      res.end(JSON.stringify({ orders }));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }

  private async getMyOrders(req: any, res: any): Promise<void> {
    try {
      const userId = await requireAuth(req, res);
      if (!userId) return;

      const orders = await orderService.getOrdersByUser(userId);

      res.writeHead(200);
      res.end(JSON.stringify({ orders }));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }

  private async getOrderById(req: any, res: any, id: string): Promise<void> {
    try {
      const userId = await requireAuth(req, res);
      if (!userId) return;

      const order = await orderService.getOrderById(id);
      if (!order) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Order not found' }));
        return;
      }

      const user = await requireAuth(req, res);
      if (user !== order.userId && !requireAdmin(userId, res)) return;

      res.writeHead(200);
      res.end(JSON.stringify(order));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }

  private async cancelOrder(req: any, res: any, id: string): Promise<void> {
    try {
      const userId = await requireAuth(req, res);
      if (!userId) return;

      const result = await orderService.cancelOrder(id, userId);
      if (result.error) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: result.error }));
        return;
      }

      res.writeHead(200);
      res.end(JSON.stringify(result.order));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }

  private async updateOrderStatus(req: any, res: any, id: string, body: any): Promise<void> {
    try {
      const userId = await requireAuth(req, res);
      if (!userId) return;
      if (!requireAdmin(userId, res)) return;

      const status = body.status as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
      const result = await orderService.updateOrderStatus(id, status);
      if (result.error) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: result.error }));
        return;
      }

      res.writeHead(200);
      res.end(JSON.stringify(result.order));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }
}