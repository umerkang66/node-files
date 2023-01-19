import { type CustomErrorArr, CustomError } from './custom-error';

export class InternalServerError extends CustomError {
  public statusCode: number = 500;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }

  public serializeErrors(): CustomErrorArr {
    return [{ message: this.message }];
  }
}
