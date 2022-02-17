const { Router } = require('express');

// Importing the controllers
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = Router();

// AUTH CONTROLLERS: For Users
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Forgot password should only receive email address
router.post('/forgotPassword', authController.forgotPassword);
// This will receive the token as well as the new password as the url parameter
router.patch('/resetPassword/:token', authController.resetPassword);

// For logged in users, update the password
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

// USER CONTROLLERS
// This is also a protected route, and the id of the user is going to come from req.user that is set by protect middleware
router.patch('/updateMe', authController.protect, userController.updateMe);
// This one also requires user to be logged in
router.delete('/deleteMe', authController.protect, userController.deleteMe);

// For Administrators
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
