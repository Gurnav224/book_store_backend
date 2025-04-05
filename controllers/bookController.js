const Book = require('../models/bookModel');

// Create new book => /api/v1/admin/book/new
exports.newBook = async (req, res) => {
  try {
    req.body.user = req.user.id;
    
    const book = await Book.create(req.body);

    res.status(201).json({
      success: true,
      book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all books => /api/v1/books
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find();

    res.status(200).json({
      success: true,
      count: books.length,
      books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single book details => /api/v1/book/:id
exports.getSingleBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    res.status(200).json({
      success: true,
      book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Book => /api/v1/admin/book/:id
exports.updateBook = async (req, res) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Book => /api/v1/admin/book/:id
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    await book.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Book is deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create new review => /api/v1/review
exports.createBookReview = async (req, res) => {
  try {
    const { rating, comment, bookId } = req.body;

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    const book = await Book.findById(bookId);

    const isReviewed = book.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
      book.reviews.forEach((review) => {
        if (review.user.toString() === req.user._id.toString()) {
          review.comment = comment;
          review.rating = rating;
        }
      });
    } else {
      book.reviews.push(review);
      book.numOfReviews = book.reviews.length;
    }

    book.ratings =
      book.reviews.reduce((acc, item) => item.rating + acc, 0) /
      book.reviews.length;

    await book.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Book Reviews => /api/v1/reviews
exports.getBookReviews = async (req, res) => {
  try {
    const book = await Book.findById(req.query.id);

    res.status(200).json({
      success: true,
      reviews: book.reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Book Review => /api/v1/reviews
exports.deleteReview = async (req, res) => {
  try {
    const book = await Book.findById(req.query.bookId);

    const reviews = book.reviews.filter(
      (review) => review._id.toString() !== req.query.id.toString()
    );

    const numOfReviews = reviews.length;

    const ratings =
      numOfReviews === 0
        ? 0
        : reviews.reduce((acc, item) => item.rating + acc, 0) / numOfReviews;

    await Book.findByIdAndUpdate(
      req.query.bookId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
