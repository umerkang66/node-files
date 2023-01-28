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

router.route('/').get(getAllUsers);

router
  .route('/:id')
  .get(withIdParam, validateRequest, getUser)
  .patch(updateUserValidator, validateRequest, updateUser)
  .delete(withIdParam, validateRequest, deleteUser);

export { router as adminUsersRouter };
