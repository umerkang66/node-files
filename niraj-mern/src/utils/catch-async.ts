import { type RequestHandler } from 'express';

const catchAsync = <ReqBody = any, Params = any, ReqQuery = any, ResBody = any>(
  func: RequestHandler<Params, ResBody, ReqBody, ReqQuery>
): RequestHandler<Params, ResBody, ReqBody, ReqQuery> => {
  return (req, res, next) => {
    const promise = func(req, res, next) as unknown as Promise<void>;

    promise.catch(next);
  };
};

export { catchAsync };
