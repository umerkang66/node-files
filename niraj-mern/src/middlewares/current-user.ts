import { RequestHandler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User, type UserDocument } from '../models/user';

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserDocument;
    }
  }
}

const currentUser: RequestHandler = async (req, res, next) => {
  // this req.cookies and req.cookies.jwt is coming from cookie-parser library
  if (!req.cookies || !req.cookies.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(
      req.cookies.jwt,
      process.env.JWT_KEY!
    ) as JwtPayload;

    const user = await User.findById(payload.id);
    if (!user) return next();

    if (user.passwordChangedAfter(payload.iat!)) {
      // if the user's password has been changed after the token has been issued
      // then token should not work
      return next();
    }

    req.currentUser = user;
    // if there is error don't do anything, there could be an error, if jwt_key is not correct
  } catch (err) {}

  next();
};

export { currentUser };
