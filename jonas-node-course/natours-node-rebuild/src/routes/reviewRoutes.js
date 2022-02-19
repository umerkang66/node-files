const { Router } = require('express');
// Importing the controllers
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

// ROUTING
const router = Router();

router
  .route('/')
  .get(reviewController.getAllReview)
  // Only authenticated users should create the reviews, and only "users", (!admins, !tourGuides)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

module.exports = router;
