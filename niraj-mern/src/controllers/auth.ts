import { catchAsync } from '../utils/catch-async';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';
import { createSendToken } from '../services/create-send-token';
import { Password } from '../services/password';

interface SignupReqBody {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const signup = catchAsync<SignupReqBody>(async (req, res) => {
  const { email, name, password, passwordConfirm } = req.body;

  if (password !== passwordConfirm) {
    // this will be caught by
    throw new BadRequestError('Password and Password Confirm are not equal');
  }

  // uniqueness of email will be checked by mongoose
  const user = User.build({ name, email, password });
  await user.save();

  createSendToken(user, 201, req, res);
});

interface SigninReqBody {
  email: string;
  password: string;
}

const signin = catchAsync<SigninReqBody>(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new BadRequestError('No user exists with this email');
  }

  const correctPassword = await Password.compare(password, user.password);

  if (!correctPassword) {
    throw new BadRequestError('Invalid credentials');
  }

  createSendToken(user, 200, req, res);
});

export { signup, signin };
