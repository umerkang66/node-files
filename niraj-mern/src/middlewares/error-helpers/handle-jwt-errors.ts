import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { CustomError } from '../../errors/custom-error';
import { BadRequestError } from '../../errors/bad-request-error';

const handleJWTErrors = (err: Error): Error | CustomError => {
  let error: Error | CustomError = err;

  console.log(err);

  // If there are some other errors like (jwt errors), then create CustomError out of it
  if (err instanceof TokenExpiredError) {
    error = new BadRequestError(err.message);
  }

  if (err instanceof JsonWebTokenError) {
    error = new BadRequestError(err.message);
  }

  return error;
};

export { handleJWTErrors };
