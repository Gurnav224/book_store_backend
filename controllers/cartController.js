const Cart = require('../models/cartModel');
const Book = require('../models/bookModel');

// Get cart for the logged in user => /api/v1/cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate({
        path: 'items.book',
        select: 'title author price discountPrice images stock',
      });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        totalPrice: 0,
        totalItems: 0,
      });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add item to cart => /api/v1/cart/add
exports.addItemToCart = async (req, res) => {
  try {
    const { bookId, quantity = 1 } = req.body;

    // Validate book exists and has enough stock
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    if (book.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Not enough stock available',
      });
    }

    // Find user's cart or create a new one
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        totalPrice: 0,
        totalItems: 0,
      });
    }

    // Check if book already exists in cart
    const itemIndex = cart.items.findIndex(item => item.book.toString() === bookId);
    
    // Get the price (use discounted price if available)
    const price = book.discountPrice > 0 ? book.discountPrice : book.price;

    if (itemIndex > -1) {
      // Book exists in cart, update quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Book does not exist in cart, add new item
      cart.items.push({
        book: bookId,
        quantity,
        price,
      });
    }

    await cart.save();

    // Populate book details before sending response
    await cart.populate({
      path: 'items.book',
      select: 'title author price discountPrice images stock',
    });

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update cart item quantity => /api/v1/cart/update
exports.updateCartItem = async (req, res) => {
  try {
    const { bookId, quantity } = req.body;

    // Validate quantity
    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1',
      });
    }

    // Validate book exists and has enough stock
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    if (book.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Not enough stock available',
      });
    }

    // Find user's cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex(item => item.book.toString() === bookId);
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    // Populate book details before sending response
    await cart.populate({
      path: 'items.book',
      select: 'title author price discountPrice images stock',
    });

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove item from cart => /api/v1/cart/remove
exports.removeCartItem = async (req, res) => {
  try {
    const { bookId } = req.body;

    // Find user's cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    // Remove the item from the cart
    cart.items = cart.items.filter(item => item.book.toString() !== bookId);
    await cart.save();

    // Populate book details before sending response
    await cart.populate({
      path: 'items.book',
      select: 'title author price discountPrice images stock',
    });

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Clear cart => /api/v1/cart/clear
exports.clearCart = async (req, res) => {
  try {
    // Find user's cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    // Clear the cart
    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
