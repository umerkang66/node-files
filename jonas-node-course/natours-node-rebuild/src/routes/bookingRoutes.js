const { Router } = require('express');
// Importing the controllers
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = Router();

// Send the id of the tour, that is currently being booked
router.get(
  '/checkout-session/:tourId',
  authController.protect,
  bookingController.getCheckoutSession
);

module.exports = router;
