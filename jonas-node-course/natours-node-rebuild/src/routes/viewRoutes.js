const { Router } = require('express');
const viewController = require('../controllers/viewController');

const router = Router();

// Root page should be the overview page
router.get('/', viewController.getOverview);
router.get('/tour/:slug', viewController.getTour);

module.exports = router;
