import { CartService, AddToCartData, UpdateCartItemData } from '../services/index.js';
import { requireAuth } from '../middleware/index.js';
import { parse } from 'url';

const cartService = new CartService();

export class CartController {
  async handleRequest(req: any, res: any, body: any): Promise<void> {
    const { method } = req;
    const parsedUrl = parse(req.url || '', true);
    const pathname = parsedUrl.pathname || '';

    if (pathname === '/api/cart' && method === 'POST') {
      await this.addToCart(req, res, body);
      return;
    }

    if (pathname === '/api/cart' && method === 'GET') {
      await this.getCart(req, res);
      return;
    }

    if (pathname.startsWith('/api/cart/') && method === 'PUT') {
      const id = pathname.slice('/api/cart/'.length);
      await this.updateCartItem(req, res, id, body);
      return;
    }

    if (pathname.startsWith('/api/cart/') && method === 'DELETE') {
      const id = pathname.slice('/api/cart/'.length);
      await this.removeFromCart(req, res, id);
      return;
    }

    if (pathname === '/api/cart/clear' && method === 'DELETE') {
      await this.clearCart(req, res);
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }

  private async addToCart(req: any, res: any, body: any): Promise<void> {
    try {
      const userId = await requireAuth(req, res);
      if (!userId) return;

      const data: AddToCartData = {
        userId,
        bookId: body.bookId,
        quantity: body.quantity || 1
      };

      const result = await cartService.addToCart(data);
      if (result.error) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: result.error }));
        return;
      }

      res.writeHead(200);
      res.end(JSON.stringify(result.item));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }

  private async getCart(req: any, res: any): Promise<void> {
    try {
      const userId = await requireAuth(req, res);
      if (!userId) return;

      const result = await cartService.getCart(userId);

      res.writeHead(200);
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }

  private async updateCartItem(req: any, res: any, id: string, body: any): Promise<void> {
    try {
      const userId = await requireAuth(req, res);
      if (!userId) return;

      const data: UpdateCartItemData = {
        quantity: body.quantity
      };

      const result = await cartService.updateCartItem(id, userId, data);
      if (result.error) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: result.error }));
        return;
      }

      if (!result.item) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Cart item not found' }));
        return;
      }

      res.writeHead(200);
      res.end(JSON.stringify(result.item));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }

  private async removeFromCart(req: any, res: any, id: string): Promise<void> {
    try {
      const userId = await requireAuth(req, res);
      if (!userId) return;

      const removed = await cartService.removeFromCart(id, userId);
      if (!removed) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Cart item not found' }));
        return;
      }

      res.writeHead(200);
      res.end(JSON.stringify({ message: 'Item removed from cart' }));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }

  private async clearCart(req: any, res: any): Promise<void> {
    try {
      const userId = await requireAuth(req, res);
      if (!userId) return;

      await cartService.clearCart(userId);

      res.writeHead(200);
      res.end(JSON.stringify({ message: 'Cart cleared' }));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }
}