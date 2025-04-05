const express = require('express');
const router = express.Router();

const {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require('../controllers/cartController');

const { isAuthenticatedUser } = require('../middleware/auth');

// All cart routes require authentication
router.use(isAuthenticatedUser);

router.route('/cart').get(getCart);
router.route('/cart/add').post(addItemToCart);
router.route('/cart/update').put(updateCartItem);
router.route('/cart/remove').delete(removeCartItem);
router.route('/cart/clear').delete(clearCart);

module.exports = router;
