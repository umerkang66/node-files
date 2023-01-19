interface ICustomError {
  message: string;
  field?: string;
}
type CustomErrorArr = ICustomError[];

abstract class CustomError extends Error {
  public abstract statusCode: number;
  // always return object that contains errors, that is a array of message, or field property
  public abstract serializeErrors(): CustomErrorArr;

  constructor(message: string) {
    super(message);
    // Only because we are extending a built in class
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export { CustomError, type CustomErrorArr };
