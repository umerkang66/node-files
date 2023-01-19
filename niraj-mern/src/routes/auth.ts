import { Router } from 'express';
import * as authControllers from '../controllers/auth';
import { validateRequest } from '../middlewares/validate-request';
import { signinValidator, signupValidator } from '../validators/auth';

const router = Router();

router.post(
  '/signup',
  signupValidator,
  validateRequest,
  authControllers.signup
);

router.post(
  '/signin',
  signinValidator,
  validateRequest,
  authControllers.signin
);

export { router as authRouter };
