export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'customer' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  price: number;
  stock: number;
  category: string;
  description?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  userId: string;
  bookId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  bookId: string;
  title: string;
  author: string;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Review {
  id: string;
  userId: string;
  bookId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthToken {
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
}