import { type CustomErrorArr, CustomError } from './custom-error';

export class DatabaseConnectionError extends CustomError {
  public statusCode: number = 500;

  constructor() {
    // this reason will become "this.message" by the super call
    const message = 'Error connecting to database';
    // for logging purposes
    super(message);

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  public serializeErrors(): CustomErrorArr {
    // always return object that contains errors, that is a array of message, or field property
    return [{ message: this.message }];
  }
}
