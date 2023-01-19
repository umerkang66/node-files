import { type CustomErrorArr, CustomError } from './custom-error';

export class BadRequestError extends CustomError {
  public statusCode: number = 400;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  public serializeErrors(): CustomErrorArr {
    return [{ message: this.message }];
  }
}
