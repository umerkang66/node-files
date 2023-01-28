import { User } from '../../models/user';
import {
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from '../../utils/handle-factory';

const deleteUser = deleteOne(User);
const getAllUsers = getAll(User);
const getUser = getOne(User);
const updateUser = updateOne(User);

export { getAllUsers, getUser, updateUser, deleteUser };
