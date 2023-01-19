import { type CustomErrorArr, CustomError } from './custom-error';

export class NotAuthorizedError extends CustomError {
  public statusCode: number = 401;

  constructor() {
    const message = 'Not authorized';
    super(message);

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  public serializeErrors(): CustomErrorArr {
    return [{ message: this.message }];
  }
}
