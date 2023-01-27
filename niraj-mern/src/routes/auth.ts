import { Router } from 'express';
import * as authControllers from '../controllers/auth';
import { currentUser } from '../middlewares/current-user';
import { requireAuth } from '../middlewares/require-auth';
import { validateRequest } from '../middlewares/validate-request';
import {
  forgotPasswordValidator,
  resendEmailVerifyTokenValidator,
  resetPasswordValidator,
  signinValidator,
  signupValidator,
  updatePasswordValidator,
  verifyEmailValidator,
} from '../validators/auth';

const router = Router();

router.post(
  '/signup',
  signupValidator,
  validateRequest,
  authControllers.signup
);

router.post(
  '/resend-email-verify-token',
  resendEmailVerifyTokenValidator,
  validateRequest,
  authControllers.resendEmailVerifyToken
);

router.post(
  '/confirm-signup',
  verifyEmailValidator,
  validateRequest,
  authControllers.confirmSignup
);

router.post(
  '/signin',
  signinValidator,
  validateRequest,
  authControllers.signin
);

router.post(
  '/update-password',
  updatePasswordValidator,
  validateRequest,
  currentUser,
  requireAuth,
  authControllers.updatePassword
);

router.post(
  '/forgot-password',
  forgotPasswordValidator,
  validateRequest,
  authControllers.forgotPassword
);

router.post(
  '/reset-password',
  resetPasswordValidator,
  validateRequest,
  authControllers.resetPassword
);

export { router as authRouter };
