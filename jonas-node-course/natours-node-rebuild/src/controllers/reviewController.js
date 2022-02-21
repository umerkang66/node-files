// IMPORTING THE MODELS
const Review = require('../models/reviewModel');
// IMPORTING THE HANDLE_FACTORY
const factory = require('./handleFactory');

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
exports.getAllReview = factory.getAll(Review);
// This getOne factory handler will work for both review routes, i.e. main route, and from tour route
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
