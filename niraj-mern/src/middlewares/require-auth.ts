import { RequestHandler } from 'express';
import { NotAuthenticatedError } from '../errors/not-authenticated-error';

const requireAuth: RequestHandler = (req, res, next) => {
  if (!req.currentUser) {
    throw new NotAuthenticatedError();
  }
  next();
};

export { requireAuth };
