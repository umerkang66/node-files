const { Router } = require('express');
const tourController = require('../controllers/tourController');

const router = Router();

// Params middlewares: that only runs if the certain criteria is mentioned
router.param('id', tourController.checkId);

router
  .route('/')
  .get(tourController.getAllTours)
  // checkBody before creating Tour
  .post(tourController.checkBody, tourController.createTour);

// put request have to receive full object that needs to be updated, but patch request can only send properties that needs to be updated in the object
// We can also add optional parameters with "?"
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
