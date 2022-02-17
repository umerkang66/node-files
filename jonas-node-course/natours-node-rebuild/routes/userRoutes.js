const { Router } = require('express');

// Importing the controllers
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = Router();

// Auth Controllers: For Users
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Forgot password should only receive email address
router.post('/forgotPassword', authController.forgotPassword);
// This will receive the token as well as the new password as the url parameter
router.patch('/resetPassword/:token', authController.resetPassword);

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
