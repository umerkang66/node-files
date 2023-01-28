import express from 'express';
import {
  updateUser,
  deleteUser,
  getAllUsers,
  getUser,
} from '../../controllers/admin/users';
import { currentUser } from '../../middlewares/current-user';
import { requireAuth } from '../../middlewares/require-auth';
import { restrictTo } from '../../middlewares/restrict-to';
import { validateRequest } from '../../middlewares/validate-request';
import { updateUserValidator, withIdParam } from '../../validators/admin/users';

const router = express.Router();

router.use(currentUser, requireAuth, restrictTo('admin'));

router.get('/', getAllUsers);

router.get('/:id', withIdParam, validateRequest, getUser);

router.patch('/:id', updateUserValidator, validateRequest, updateUser);

router.delete('/:id', withIdParam, validateRequest, deleteUser);

export { router as adminUsersRouter };
