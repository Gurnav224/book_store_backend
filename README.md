# Book Store E-Commerce Backend

A RESTful API for a book seller e-commerce platform built with Express.js and MongoDB.

## Features

- User authentication and authorization
- Book management (CRUD operations)
- Order processing
- Reviews and ratings
- Admin dashboard functionality

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## API Endpoints

### Authentication

- `POST /api/v1/register` - Register a new user
- `POST /api/v1/login` - Login user
- `GET /api/v1/logout` - Logout user
- `GET /api/v1/me` - Get user profile
- `PUT /api/v1/password/update` - Update password
- `PUT /api/v1/me/update` - Update user profile

### Books

- `GET /api/v1/books` - Get all books
- `GET /api/v1/book/:id` - Get single book
- `POST /api/v1/admin/book/new` - Create new book (Admin)
- `PUT /api/v1/admin/book/:id` - Update book (Admin)
- `DELETE /api/v1/admin/book/:id` - Delete book (Admin)

### Reviews

- `PUT /api/v1/review` - Create/Update review
- `GET /api/v1/reviews` - Get book reviews
- `DELETE /api/v1/reviews` - Delete review

### Orders

- `POST /api/v1/order/new` - Create new order
- `GET /api/v1/order/:id` - Get single order
- `GET /api/v1/orders/me` - Get logged in user orders
- `GET /api/v1/admin/orders` - Get all orders (Admin)
- `PUT /api/v1/admin/order/:id` - Update order status (Admin)
- `DELETE /api/v1/admin/order/:id` - Delete order (Admin)

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/bookstore
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   ```
4. Run the server
   ```
   npm run dev
   ```

## License

This project is licensed under the MIT License.
