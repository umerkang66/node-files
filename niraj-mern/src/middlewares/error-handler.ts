import type { ErrorRequestHandler } from 'express';
import { Error as MongooseError } from 'mongoose';

import { BadRequestError } from '../errors/bad-request-error';
import { CustomError, type CustomErrorArr } from '../errors/custom-error';

interface ResponseError {
  errors: CustomErrorArr;
}

const handleMongooseErrors = (err: Error): Error | CustomError => {
  let error: Error | CustomError = err;

  // If there are some other errors like (mongoose errors), then create CustomError out of it
  if (err instanceof MongooseError.CastError) {
    // In case of mongoose CastError, message does
    // If mongodb couldn't convert (cast) the provided property to
    // its specific type in the schema
    const message = `Resource not found, Invalid '${err.path}'`;
    error = new BadRequestError(message);
  }

  // NOTE! We are gonna use express-validator, to technically
  // mongoose validation is not required
  if (err instanceof MongooseError.ValidationError) {
    const requiredFields: string[] = [];
    for (const keys in err.errors) {
      requiredFields.push(err.errors[keys].path);
    }

    const fieldsStr = requiredFields.join(', ');
    const msg = `Please enter these required fields correctly: [${fieldsStr}]`;
    error = new BadRequestError(msg);
  }

  if (err.name === 'MongoServerError') {
    // If document value should be unique, but it is not
    // @ts-ignore
    const keys = Object.keys(err.keyValue).join(', ');
    const message = `Duplicate field value: [${keys}]. Please use another one.`;
    error = new BadRequestError(message);
  }

  return error;
};

type ErrorHandler = ErrorRequestHandler<any, ResponseError>;
export const errorHandler: ErrorHandler = (err, req, res, next) => {
  // always return object that contains errors, that is a array of message, or field property, that is done by serialize error, below is done manually

  // if 'err' doesn't fulfils the requirements of some mongoose error,
  // default 'err' will be returned, that is provided
  err = handleMongooseErrors(err);

  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  // It is not one of the defined errors
  console.log(err);
  res.status(500).send({
    errors: [{ message: 'Something went wrong' }],
  });
};
