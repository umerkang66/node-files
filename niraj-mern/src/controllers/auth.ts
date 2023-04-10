import { catchAsync } from '../utils/catch-async';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';
import { createSendToken } from '../services/create-send-token';
import {
  sendAdminVerifyTokenMail,
  sendEmailVerificationMail,
  sendResetPasswordTokenMail,
} from '../emails';
import { EmailVerifyToken } from '../models/tokens/email-verify-token';
import { NotFoundError } from '../errors/not-found-error';
import { ResetPasswordToken } from '../models/tokens/reset-password-token';
import { type RequestHandler } from 'express';
import { filterReqBody } from '../utils/filter-req-body';
import { AdminVerifyToken } from '../models/tokens/admin-verify-token';

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
        'Only 1 hour later you can generate a new token'
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
    await EmailVerifyToken.findByIdAndDelete(foundToken.id);

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

// currentUser middleware runs before this
const currentUser: RequestHandler = (req, res) => {
  res.send({ currentUser: req.currentUser || null });
};

const updateMe = catchAsync(async (req, res) => {
  // currently only name is allowed to be updated
  const filteredBody = filterReqBody(req.body, 'name');

  const updatedUser = await User.findByIdAndUpdate(
    req.currentUser!.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.send(updatedUser);
});

// currentUser and requireAuth runs before this
const updatePassword = catchAsync<{
  currentPassword: string;
  password: string;
  passwordConfirm: string;
}>(async (req, res) => {
  const user = req.currentUser!;
  const { currentPassword } = req.body;

  const correctPassword = await user.validatePassword(currentPassword);

  if (!correctPassword) {
    throw new BadRequestError('Current password is not correct');
  }

  const { password, passwordConfirm } = req.body;

  if (password !== passwordConfirm) {
    throw new BadRequestError('Password and PasswordConfirm are not equal');
  }

  user.password = password;
  await user.save();

  createSendToken(user, 200, req, res);
});

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

// first are req.body params, third are req.query params
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

  await ResetPasswordToken.findByIdAndDelete(resetPasswordToken.id);

  createSendToken(user, 200, req, res);
});

// CurrentUser and requireAuth runs before this
const signout: RequestHandler = (req, res) => {
  res.cookie('jwt', 'logged_out', {
    // expires in 10 minutes from current_time
    expires: new Date(Date.now() + 10 * 1000),
    // can only be modified from backend
    httpOnly: true,
  });

  res.send({ message: 'Logged out' });
};

const deleteMe = catchAsync(async (req, res) => {
  await User.findByIdAndDelete(req.currentUser!.id);

  // delete the user cookie
  res.cookie('jwt', 'user_deleted', {
    // expires in 10 minutes from current_time
    expires: new Date(Date.now() + 10 * 1000),
    // can only be modified from backend
    httpOnly: true,
  });

  res.status(204).send(null);
});

const adminSignup = catchAsync<{
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}>(async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  if (password !== passwordConfirm) {
    throw new BadRequestError('Password and Password confirm don not match');
  }

  const user = await User.build({ name, email, password }).save();

  const token = await user.addAdminVerifyToken();

  const host = req.get('host');
  const signupUrl = `${req.protocol}://${host}/api/auth/admin-signup/${user.id}?token=${token}`;

  await sendAdminVerifyTokenMail(signupUrl, 'ugulzar4512@gmail.com');

  res.send({ message: 'Token for signup has sent to your email' });
});

const confirmAdminSignup = catchAsync<
  any,
  { userId: string },
  { token: string }
>(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const foundToken = await user.checkAdminVerifyToken(req.query.token);
  if (!foundToken) {
    throw new BadRequestError('Token is invalid');
  }

  // Here user is already verified
  user.isVerified = true;
  user.role = 'admin';
  await user.save();

  await AdminVerifyToken.findByIdAndDelete(foundToken.id);

  createSendToken(user, 200, req, res);
});

export {
  signup,
  resendEmailVerifyToken,
  confirmSignup,
  signin,
  currentUser,
  updateMe,
  updatePassword,
  forgotPassword,
  resetPassword,
  signout,
  deleteMe,
  adminSignup,
  confirmAdminSignup,
};
