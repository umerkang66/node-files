const { Router } = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

// Importing the review router to merge the routers
const reviewRouter = require('./reviewRoutes');

const router = Router();

// REVIEWS: MERGING ROUTES
// Router should use review router, if it gets the routes like this "/api/v1/tours/:tourId/reviews"
// This is just mounting the router
router.use('/:tourId/reviews', reviewRouter);

// Params middlewares: that only runs if the certain criteria is mentioned that if it has "id" in the parameter
// router.param('id', tourController.checkId);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
// We should also be able to pass year through url params ("/:year")
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

router
  .route('/')
  .get(tourController.getAllTours)
  // checkBody before creating Tour
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );

// put request have to receive full object that needs to be updated, but patch request can only send properties that needs to be updated in the object
// We can also add optional parameters with "?"
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  // For deleting the tour, user should be first logged in, then it should be an ADMIN and LEAD-GUIDE
  // restrictTo will return a function (that will act as middleware function)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
