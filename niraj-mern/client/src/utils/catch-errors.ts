import { AxiosError } from 'axios';

const catchErrors = <
  T extends (
    ...args: Parameters<T>
  ) => Promise<Awaited<ReturnType<T>>>
>(
  fn: T
) => {
  const fetcherFunction = async (
    ...args: Parameters<T>
  ) => {
    try {
      return await fn(...args);
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        throw err.response.data.errors;
      } else {
        throw err;
      }
    }
  };

  return fetcherFunction as T;
};

export { catchErrors };
