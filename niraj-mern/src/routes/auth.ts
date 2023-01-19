import { Router } from 'express';
import * as authControllers from '../controllers/auth';
import { validateRequest } from '../middlewares/validate-request';
import { signupValidator } from '../validators/auth';

const router = Router();

router.post(
  '/signup',
  signupValidator,
  validateRequest,
  authControllers.signup
);

export { router as authRouter };
