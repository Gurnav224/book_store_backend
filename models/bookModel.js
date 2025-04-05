const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please enter book title'],
      trim: true,
      maxLength: [100, 'Book title cannot exceed 100 characters'],
    },
    author: {
      type: String,
      required: [true, 'Please enter book author'],
      trim: true,
      maxLength: [100, 'Author name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please enter book description'],
    },
    price: {
      type: Number,
      required: [true, 'Please enter book price'],
      maxLength: [8, 'Price cannot exceed 8 characters'],
      default: 0.0,
    },
    discountPrice: {
      type: Number,
      maxLength: [8, 'Discount price cannot exceed 8 characters'],
      default: 0.0,
    },
    genre: {
      type: String,
      required: [true, 'Please select book genre'],
      enum: {
        values: [
          'Fiction',
          'Non-fiction',
          'Science Fiction',
          'Fantasy',
          'Mystery',
          'Thriller',
          'Romance',
          'Biography',
          'History',
          'Self-help',
          'Business',
          'Children',
          'Young Adult',
          'Other',
        ],
        message: 'Please select correct genre for book',
      },
    },
    publisher: {
      type: String,
      required: [true, 'Please enter book publisher'],
    },
    publicationDate: {
      type: Date,
      required: [true, 'Please enter publication date'],
    },
    language: {
      type: String,
      required: [true, 'Please enter book language'],
      default: 'English',
    },
    pageCount: {
      type: Number,
      required: [true, 'Please enter book page count'],
    },
    isbn: {
      type: String,
      required: [true, 'Please enter ISBN'],
      unique: true,
    },
    stock: {
      type: Number,
      required: [true, 'Please enter book stock'],
      maxLength: [5, 'Stock cannot exceed 5 characters'],
      default: 0,
    },
    format: {
      type: String,
      required: [true, 'Please select book format'],
      enum: {
        values: ['Hardcover', 'Paperback', 'E-book', 'Audiobook'],
        message: 'Please select correct format for book',
      },
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    ratings: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);
