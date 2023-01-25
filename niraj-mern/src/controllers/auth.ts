import { catchAsync } from '../utils/catch-async';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';
import { createSendToken } from '../services/create-send-token';
import { Password } from '../services/password';
import { sendEmailVerificationMail } from '../emails';
import { EmailVerifyToken } from '../models/email-verify-token';
import { NotFoundError } from '../errors/not-found-error';

// express validator runs before it, so these values must be present
const signup = catchAsync<{
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}>(async (req, res) => {
  const { email, name, password, passwordConfirm } = req.body;

  if (password !== passwordConfirm) {
    // this will be caught by
    throw new BadRequestError('Password and Password Confirm are not equal');
  }

  // uniqueness of email will be checked by mongoose
  const user = User.build({ name, email, password });
  await user.save();

  const token = Password.createToken(5);
  await user.addEmailVerifyToken(token);

  await sendEmailVerificationMail(token, user.email);

  res.status(201).send({
    userId: user.id,
    message: 'Check your email for OTP token',
  });
});

const resendEmailVerifyToken = catchAsync<{
  userId: string;
}>(async (req, res) => {
  const { userId } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  if (user.isVerified) {
    throw new BadRequestError('This is user is already verified');
  }

  const existedToken = await EmailVerifyToken.findOne({ owner: userId });
  if (existedToken) {
    throw new BadRequestError(
      'Only 1 hour later you can generated a new token'
    );
  }

  const token = Password.createToken(5);
  await user.addEmailVerifyToken(token);
  await sendEmailVerificationMail(token, user.email);

  res.status(200).send({ message: 'Check your email for OTP token' });
});

// express validator runs before it, so these values must be present
const confirmSignup = catchAsync<{
  // by express-validator, this must be mongoose objectId
  userId: string;
  token: string;
}>(async (req, res) => {
  const { userId, token } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  if (user.isVerified) {
    throw new BadRequestError('User is already verified');
  }

  const foundToken = await user.checkEmailVerifyToken(token);
  if (!foundToken) {
    throw new NotFoundError('Token not found');
  }

  user.isVerified = true;
  await user.save();

  createSendToken(user, 201, req, res);
});

// express validator runs before it, so these values must be present
const signin = catchAsync<{
  email: string;
  password: string;
}>(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundError('No user exists with this email');
  }

  const correctPassword = await Password.compare(password, user.password);

  if (!correctPassword) {
    throw new BadRequestError('Invalid credentials');
  }

  createSendToken(user, 200, req, res);
});

export { signup, resendEmailVerifyToken, confirmSignup, signin };
