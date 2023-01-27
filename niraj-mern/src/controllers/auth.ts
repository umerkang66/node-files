import { catchAsync } from '../utils/catch-async';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';
import { createSendToken } from '../services/create-send-token';
import {
  sendEmailVerificationMail,
  sendResetPasswordTokenMail,
} from '../emails';
import { EmailVerifyToken } from '../models/tokens/email-verify-token';
import { NotFoundError } from '../errors/not-found-error';
import { ResetPasswordToken } from '../models/tokens/reset-password-token';

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

  const token = await user.addEmailVerifyToken();

  await sendEmailVerificationMail(token, user.email);

  // This will not send the cookie but the normal response
  createSendToken(user, 201, req, res, 'Check your email for OTP token');
});

const resendEmailVerifyToken = catchAsync<{ userId: string }>(
  async (req, res) => {
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

    const token = await user.addEmailVerifyToken();
    await sendEmailVerificationMail(token, user.email);

    // This will not send the cookie but the normal response
    createSendToken(user, 200, req, res, 'Check your email for OTP token');
  }
);

// express validator runs before it, so these values must be present
// by express-validator, this must be mongoose objectId
const confirmSignup = catchAsync<{ userId: string; token: string }>(
  async (req, res) => {
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
      throw new NotFoundError('Invalid token');
    }

    user.isVerified = true;
    await user.save();

    // Now remove the token
    await EmailVerifyToken.findByIdAndRemove(foundToken.id);

    createSendToken(user, 201, req, res);
  }
);

// express validator runs before it, so these values must be present
const signin = catchAsync<{ email: string; password: string }>(
  async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new NotFoundError('No user exists with this email');
    }

    const correctPassword = await user.validatePassword(password);

    if (!correctPassword) {
      throw new BadRequestError('Invalid credentials');
    }

    createSendToken(user, 200, req, res);
  }
);

const forgotPassword = catchAsync<{ email: string }>(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const existedToken = await ResetPasswordToken.findOne({ owner: user.id });

  const errMessage = 'Only after 1 hour you can generate password reset token';
  if (existedToken) {
    throw new BadRequestError(errMessage);
  }

  // This token should be strong
  const token = await user.addResetPasswordToken();

  const host = req.get('host');

  const resetPasswordUrl = `${req.protocol}://${host}/api/auth/reset-password?token=${token}&userId=${user.id}`;

  await sendResetPasswordTokenMail(resetPasswordUrl, user.email);

  res.send({
    userId: user.id,
    message: 'Check your email to reset your password',
  });
});

const resetPassword = catchAsync<
  { password: string; passwordConfirm: string },
  any,
  { token: string; userId: string }
>(async (req, res) => {
  const { token, userId } = req.query;
  const { password, passwordConfirm } = req.body;

  if (password !== passwordConfirm) {
    throw new BadRequestError('Password and Password Confirm are not equal');
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  const resetPasswordToken = await user.checkResetPasswordToken(token);

  if (!resetPasswordToken) {
    throw new BadRequestError('Invalid token');
  }

  user.password = password;
  await user.save();

  await ResetPasswordToken.findByIdAndRemove(resetPasswordToken.id);

  createSendToken(user, 200, req, res);
});

export {
  signup,
  resendEmailVerifyToken,
  confirmSignup,
  signin,
  forgotPassword,
  resetPassword,
};
