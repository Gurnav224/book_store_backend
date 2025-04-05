const express = require('express');
const router = express.Router();

const {
  getBooks,
  getSingleBook,
  newBook,
  updateBook,
  deleteBook,
  createBookReview,
  getBookReviews,
  deleteReview,
} = require('../controllers/bookController');

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

// Public routes
router.route('/books').get(getBooks);
router.route('/book/:id').get(getSingleBook);

// Review routes
router.route('/review').put(isAuthenticatedUser, createBookReview);
router.route('/reviews').get(getBookReviews);
router.route('/reviews').delete(isAuthenticatedUser, deleteReview);

// Admin routes
router
  .route('/admin/book/new')
  .post(isAuthenticatedUser, authorizeRoles('admin'), newBook);

router
  .route('/admin/book/:id')
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateBook)
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteBook);

module.exports = router;
