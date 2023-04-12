import { RequestHandler } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';

type Role = 'user' | 'admin';

// current-user, and requireAuth should be used before restrict to.
const restrictTo = (...roles: Role[]): RequestHandler => {
  return (req, res, next) => {
    const role = req.currentUser!.role;
    if (!roles.includes(role as Role)) {
      throw new NotAuthorizedError();
    }

    next();
  };
};

export { restrictTo };
