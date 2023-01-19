import { type CustomErrorArr, CustomError } from './custom-error';

export class NotFoundError extends CustomError {
  public statusCode: number = 404;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  public serializeErrors(): CustomErrorArr {
    // we have to call the default constructor, that accepts the message,
    return [{ message: this.message }];
  }
}
