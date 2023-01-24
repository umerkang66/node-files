import { body } from 'express-validator';
import { isValidObjectId } from 'mongoose';

const signupValidator = [
  body('name').notEmpty().withMessage('Name must be provided'),
  body('email').isEmail().withMessage('Email provided must be valid'),
  body('password')
    .trim()
    .isLength({ min: 8, max: 30 })
    .withMessage('Password must be between 8 an 30 characters'),
  body('passwordConfirm')
    .trim()
    .isLength({ min: 8, max: 30 })
    .withMessage('PasswordConfirm must be between 8 an 30 characters'),
];

const verifyEmailValidator = [
  body('userId')
    .notEmpty()
    .withMessage('userId must be provided')
    .custom(userId => isValidObjectId(userId))
    .withMessage('Invalid userId'),
  body('token').notEmpty().withMessage('Token must be provided'),
];

const signinValidator = [
  body('email')
    .isEmail()
    .withMessage('The email that you have provided must be valid'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('You must provide a password')
    .isLength({ min: 8, max: 30 })
    .withMessage('Your password length should be between 8 and 30'),
];

export { signupValidator, verifyEmailValidator, signinValidator };
