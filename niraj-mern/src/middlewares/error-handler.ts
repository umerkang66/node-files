import type { ErrorRequestHandler } from 'express';
import { CustomError, type CustomErrorArr } from '../errors/custom-error';
import { handleMongooseErrors, handleJWTErrors } from './error-helpers';

interface ResponseError {
  errors: CustomErrorArr;
}

type ErrorHandler = ErrorRequestHandler<any, ResponseError>;
export const errorHandler: ErrorHandler = (err, req, res, next) => {
  // always return object that contains errors, that is a array of message, or field property, that is done by serialize error, below is done manually

  // if 'err' doesn't fulfils the requirements of some mongoose error,
  // default 'err' will be returned, that is provided
  err = handleMongooseErrors(err);
  err = handleJWTErrors(err);

  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  // It is not one of the defined errors
  console.log(err);
  res.status(500).send({
    errors: [{ message: 'Something went wrong' }],
  });
};
