import type { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

import { RequestValidationError } from '../errors/request-validation-error';

export const validateRequest: RequestHandler = (req, res, next) => {
  // validationResult will pull out everything that was appended to the request by body middleware
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // if there are errors
    // automatically caught up by express error handling middleware
    // if it is async function, this will also be caught in global error handling middleware
    throw new RequestValidationError(errors.array());
  }

  next();
};
