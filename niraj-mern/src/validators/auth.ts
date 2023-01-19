import { body } from 'express-validator';

const signupValidator = [
  body('name').notEmpty().withMessage('Name must be provided.'),
  body('email').isEmail().withMessage('Email provided must be valid.'),
  body('password')
    .trim()
    .isLength({ min: 8, max: 30 })
    .withMessage('Password must be between 8 an 30 characters'),
  body('passwordConfirm')
    .trim()
    .isLength({ min: 8, max: 30 })
    .withMessage('PasswordConfirm must be between 8 an 30 characters'),
];

export { signupValidator };
