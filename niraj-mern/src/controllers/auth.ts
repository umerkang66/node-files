import { catchAsync } from '../utils/catch-async';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';
import { createSendToken } from '../services/create-send-token';

interface SignupReqBody {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const signup = catchAsync<SignupReqBody>(async (req, res) => {
  if (req.body.password !== req.body.passwordConfirm) {
    // this will be caught by
    throw new BadRequestError('Password and Password Confirm are not equal');
  }

  // uniqueness of email will be checked by mongoose
  const user = User.build(req.body);
  await user.save();

  createSendToken(user, 201, req, res);
});

export { signup };
