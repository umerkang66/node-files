import { type CustomErrorArr, CustomError } from './custom-error';

export class NotAuthenticatedError extends CustomError {
  public statusCode: number = 401;

  constructor() {
    const message = 'Not authenticated';
    super(message);

    Object.setPrototypeOf(this, NotAuthenticatedError.prototype);
  }

  public serializeErrors(): CustomErrorArr {
    return [{ message: this.message }];
  }
}
