import { body, param } from 'express-validator';
import { isValidObjectId } from 'mongoose';

const withIdParam = [
  param('id')
    .notEmpty()
    .withMessage("'id' param must be present")
    .custom(userId => isValidObjectId(userId))
    .withMessage('Invalid userId'),
];

const updateUserValidator = [
  param('id')
    .notEmpty()
    .withMessage("'id' param must be present")
    .custom(userId => isValidObjectId(userId))
    .withMessage('Invalid userId'),
  body('name').notEmpty().withMessage('Name must not be empty').optional(),
  body('isVerified')
    .notEmpty()
    .withMessage('isVerified must not be empty')
    .optional(),
];

export { withIdParam, updateUserValidator };
