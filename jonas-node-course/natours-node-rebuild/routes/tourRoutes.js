const { Router } = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

const router = Router();

// Params middlewares: that only runs if the certain criteria is mentioned that if it has "id" in the parameter
// router.param('id', tourController.checkId);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
// We should also be able to pass year through url params ("/:year")
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  // checkBody before creating Tour
  .post(tourController.createTour);

// put request have to receive full object that needs to be updated, but patch request can only send properties that needs to be updated in the object
// We can also add optional parameters with "?"
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
