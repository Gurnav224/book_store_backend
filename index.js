const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { connectDB, isMockDb } = require('./config/db');
const errorHandler = require('./middleware/error');

// Load env vars
dotenv.config();

// Create a route for checking server status
const app = express();

// Add a health check route that doesn't require DB connection
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    environment: process.env.NODE_ENV
  });
});

// Connect to database asynchronously
(async () => {
  const { connected, mock } = await connectDB();
  if (!connected) {
    console.log('Warning: Server running without database connection');
  } else if (mock) {
    console.log('Warning: Using mock database instead of MongoDB');
  }
})();

// Route files
const auth = require('./routes/auth');
const book = require('./routes/book');
const order = require('./routes/order');
const cart = require('./routes/cart');
const wishlist = require('./routes/wishlist');
const fallback = require('./routes/fallback');

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Enable CORS
app.use(cors());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1', fallback); // Mount fallback routes first
app.use('/api/v1', auth);
app.use('/api/v1', book);
app.use('/api/v1', order);
app.use('/api/v1', cart);
app.use('/api/v1', wishlist);

// Error handler middleware
app.use(errorHandler);

// Handle unhandled routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
