interface ICustomError {
  message: string;
  field?: string;
}

export type Errors = ICustomError[];
