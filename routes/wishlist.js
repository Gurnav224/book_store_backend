const express = require('express');
const router = express.Router();

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  moveToCart,
} = require('../controllers/wishlistController');

const { isAuthenticatedUser } = require('../middleware/auth');

// All wishlist routes require authentication
router.use(isAuthenticatedUser);

router.route('/wishlist').get(getWishlist);
router.route('/wishlist/add').post(addToWishlist);
router.route('/wishlist/remove').delete(removeFromWishlist);
router.route('/wishlist/clear').delete(clearWishlist);
router.route('/wishlist/move-to-cart').post(moveToCart);

module.exports = router;
