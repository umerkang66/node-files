import { Router } from 'express';
import * as authControllers from '../controllers/auth';
import { validateRequest } from '../middlewares/validate-request';
import {
  resendEmailVerifyTokenValidator,
  signinValidator,
  signupValidator,
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

export { router as authRouter };
