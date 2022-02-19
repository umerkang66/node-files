// IMPORTING THE MODELS
const Review = require('../models/reviewModel');

// IMPORTING THE UTILS
const catchAsync = require('../utils/catchAsync');

// ROUTE HANDLERS
exports.getAllReview = catchAsync(async (req, res, next) => {
  // If we have to populate more than one, then wrap it in the array
  const reviews = await Review.find({}).populate([
    {
      path: 'user',
      model: 'users',
      select: 'name',
    },
    {
      path: 'tour',
      model: 'tours',
      select: 'name',
    },
  ]);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: { reviews },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const { review, rating, tour } = req.body;

  const createdReview = await Review.create({
    review,
    rating,
    tour,
    // We are authenticated, so we have user in req.user
    user: req.user.id,
  });

  res.status(201).json({
    status: 'success',
    data: { review: createdReview },
  });
});
