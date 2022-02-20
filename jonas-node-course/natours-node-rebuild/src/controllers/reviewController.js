// IMPORTING THE MODELS
const Review = require('../models/reviewModel');
// IMPORTING THE HANDLE_FACTORY
const factory = require('./handleFactory');

// IMPORTING THE UTILS
const catchAsync = require('../utils/catchAsync');

// ROUTE MIDDLEWARES
// In the create Review we need some additional steps, so we can create the middleware function, that will run before this handler
exports.setTourUserIds = (req, res, next) => {
  // We need to do it like this, because we can also create review from tourRouter, and we can also create the review from just reviewRouter, without specifying the tourId in the url, but in the body

  // If tour is present in body then, use that, if that is not present, then use it from the tourId param
  if (!req.body.tour) req.body.tour = req.params.tourId;

  // We are authenticated, so we have user in req.user also can be _id
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

// ROUTE HANDLERS
exports.getAllReview = catchAsync(async (req, res, next) => {
  // If the request is coming from tourRouter, then we have to send the reviews, specifically to that tours only, this is already done in the tourModel populating we can also do it here
  const tour = req.params.tourId;
  const filter = tour ? { tour } : {};

  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: { reviews },
  });
});

exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
