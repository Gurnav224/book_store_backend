const Wishlist = require('../models/wishlistModel');
const Book = require('../models/bookModel');

// Get wishlist for the logged in user => /api/v1/wishlist
exports.getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: 'books',
      select: 'title author price discountPrice images stock genre publisher',
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        books: [],
      });
    }

    res.status(200).json({
      success: true,
      wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add book to wishlist => /api/v1/wishlist/add
exports.addToWishlist = async (req, res) => {
  try {
    const { bookId } = req.body;

    // Validate book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    // Find user's wishlist or create a new one
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        books: [],
      });
    }

    // Check if book already exists in wishlist
    if (wishlist.books.includes(bookId)) {
      return res.status(400).json({
        success: false,
        message: 'Book already in wishlist',
      });
    }

    // Add book to wishlist
    wishlist.books.push(bookId);
    await wishlist.save();

    // Populate book details before sending response
    await wishlist.populate({
      path: 'books',
      select: 'title author price discountPrice images stock genre publisher',
    });

    res.status(200).json({
      success: true,
      wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove book from wishlist => /api/v1/wishlist/remove
exports.removeFromWishlist = async (req, res) => {
  try {
    const { bookId } = req.body;

    // Find user's wishlist
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found',
      });
    }

    // Remove book from wishlist
    wishlist.books = wishlist.books.filter(book => book.toString() !== bookId);
    await wishlist.save();

    // Populate book details before sending response
    await wishlist.populate({
      path: 'books',
      select: 'title author price discountPrice images stock genre publisher',
    });

    res.status(200).json({
      success: true,
      wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Clear wishlist => /api/v1/wishlist/clear
exports.clearWishlist = async (req, res) => {
  try {
    // Find user's wishlist
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found',
      });
    }

    // Clear the wishlist
    wishlist.books = [];
    await wishlist.save();

    res.status(200).json({
      success: true,
      message: 'Wishlist cleared successfully',
      wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Move book from wishlist to cart => /api/v1/wishlist/move-to-cart
exports.moveToCart = async (req, res) => {
  try {
    const { bookId } = req.body;
    
    // This endpoint will be implemented in the frontend by:
    // 1. Calling the removeFromWishlist endpoint
    // 2. Calling the addItemToCart endpoint
    
    res.status(200).json({
      success: true,
      message: 'Please implement this functionality in the frontend by calling the respective APIs',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
