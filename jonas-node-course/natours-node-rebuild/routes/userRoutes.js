const { Router } = require('express');

// Importing the controllers
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = Router();

// Auth Controllers: For Users
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// User Controllers: For Administrators
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
