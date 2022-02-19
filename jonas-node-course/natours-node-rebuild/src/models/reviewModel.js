const mongoose = require('mongoose');

// Tours, and Users have 1:Many relationship with reviews (because a tour can have multiple reviews, and a user can have multiple reviews), so create the parent referencing to the tour, and user
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review text is required'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'A review cannot be empty'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    // We don't need to specify an array because, a review belong to only one tour
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'tours',
      required: [true, 'Review must belong to a tour'],
    },
    // We don't need to specify an array because, a review belong to only one user
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'users',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    // Explanations are in the tour model
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Review = mongoose.model('reviews', reviewSchema);

module.exports = Review;
