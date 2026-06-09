# Online Bookstore System

A full-stack online bookstore management system with book catalog, shopping cart, order management, and customer reviews.

## Project Structure

```
online-bookstore/
├── backend/
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── repositories/  # Data access layer
│   │   ├── models/        # TypeScript interfaces
│   │   ├── schemas/       # Zod validation schemas
│   │   ├── middleware/    # Express middleware (JWT auth)
│   │   ├── routes/        # API route definitions
│   │   ├── config/        # Configuration
│   │   ├── db/            # SQLite database setup
│   │   ├── seed/          # Database seeding
│   │   └── main.ts        # Application entry
│   └── package.json
└── README.md
```

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: SQLite (better-sqlite3)
- **Authentication**: JWT + bcrypt
- **Validation**: Zod
- **Security**: Helmet, Rate Limiting, CORS
- **Testing**: Jest

## Features

### Core Functionality
- User registration and authentication
- Role-based access control (admin/customer)
- Book catalog management with ISBN tracking
- Category-based book organization
- Shopping cart with stock validation
- Order management with status tracking
- Customer reviews and ratings
- Book search and filtering
- Best sellers and top-rated books
- Inventory management

### API Endpoints

**Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

**Books**
- `GET /api/books` - List all books (with filters)
- `GET /books/top-rated` - Get top-rated books
- `GET /books/best-sellers` - Get best-selling books
- `POST /api/books` - Add new book (admin)
- `PUT /api/books/:id` - Update book (admin)
- `DELETE /api/books/:id` - Delete book (admin)

**Cart**
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove from cart

**Orders**
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `DELETE /api/orders/:id` - Cancel order

**Reviews**
- `GET /api/reviews/book/:bookId` - Get book reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

## Getting Started

### Prerequisites
- Node.js 18+

### Installation

```bash
cd backend
npm install
```

### Running the Application

```bash
# Development mode
npm run dev

# Build
npm run build

# Production mode
npm start
```

### Database Setup

```bash
# Initialize database
npm run db:init

# Seed sample data
npm run db:seed

# Reset database
npm run db:reset
```

### Testing

```bash
npm test
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| JWT_SECRET | JWT secret key | bookstore-secret-key |
| JWT_EXPIRES_IN | JWT expiration | 7d |
| BCRYPT_ROUNDS | BCrypt rounds | 10 |
| DB_PATH | Database file path | ./data/bookstore.db |

## Sample Data

The seed script creates:
- 2 users (1 admin, 2 customers)
- 12 books across Programming and Fiction categories
- 5 categories
- 5 reviews

Default login credentials:
- Admin: `admin@bookstore.com` / `password123`
- Customer: `john@example.com` / `password123`

## API Usage Examples

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "password123",
    "first_name": "New",
    "last_name": "User"
  }'
```

### Search Books
```bash
curl "http://localhost:3000/api/books?search=JavaScript"
```

### Add to Cart
```bash
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "book_id": "<book_id>",
    "quantity": 2
  }'
```

### Create Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "shipping_address": "123 Main St, City, State 12345",
    "payment_method": "credit_card"
  }'
```

## License

MIT