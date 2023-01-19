// ValidationError: it is a type that describes the error properties coming from express-validator
import type { ValidationError } from 'express-validator';
import { type CustomErrorArr, CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
  public statusCode: number = 400;

  constructor(private errors: ValidationError[]) {
    // for logging purposes
    super('Invalid request parameters');
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  public serializeErrors(): CustomErrorArr {
    // always return object that contains errors, that is a array of message, or field property
    return this.errors.map(err => {
      // these errors are coming from express-request validation library
      // technically, we will pass these errors in constructor
      return { message: err.msg, field: err.param };
    });
  }
}
