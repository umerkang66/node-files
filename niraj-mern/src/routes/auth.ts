import { Router } from 'express';
import * as authControllers from '../controllers/auth';
import { currentUser } from '../middlewares/current-user';
import { requireAuth } from '../middlewares/require-auth';
import { validateRequest } from '../middlewares/validate-request';
import {
  confirmAdminSignupValidator,
  forgotPasswordValidator,
  resendEmailVerifyTokenValidator,
  resetPasswordValidator,
  signinValidator,
  signupValidator,
  updateMeValidator,
  updatePasswordValidator,
  confirmSignupValidator,
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
  confirmSignupValidator,
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
  '/forgot-password',
  forgotPasswordValidator,
  validateRequest,
  authControllers.forgotPassword
);

router.patch(
  '/reset-password',
  resetPasswordValidator,
  validateRequest,
  authControllers.resetPassword
);

router.post(
  '/admin-signup',
  // it has same validator as signup
  signupValidator,
  validateRequest,
  authControllers.adminSignup
);

router.patch(
  // token is provided as req-query
  '/admin-signup/:userId',
  confirmAdminSignupValidator,
  validateRequest,
  authControllers.confirmAdminSignup
);

router.use(currentUser);

router.get('/currentuser', authControllers.currentUser);

router.use(requireAuth);

router.patch(
  '/update-me',
  updateMeValidator,
  validateRequest,
  authControllers.updateMe
);

router.patch(
  '/update-password',
  updatePasswordValidator,
  validateRequest,
  authControllers.updatePassword
);

router.post('/signout', authControllers.signout);
router.delete('/delete-me', authControllers.deleteMe);

export { router as authRouter };
