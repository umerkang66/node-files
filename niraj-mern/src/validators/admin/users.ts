import { param } from 'express-validator';
import { isValidObjectId } from 'mongoose';

const withIdParam = [
  param('id')
    .notEmpty()
    .withMessage("'id' param must be present")
    .custom(userId => isValidObjectId(userId))
    .withMessage('Invalid userId'),
];

export { withIdParam };
