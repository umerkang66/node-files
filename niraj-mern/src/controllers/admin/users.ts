import { User } from '../../models/user';
import * as factory from '../../utils/handle-factory';

const deleteUser = factory.deleteOne(User);
const getAllUsers = factory.getAll(User);
const getUser = factory.getOne(User);
const updateUser = factory.updateOne(User);

export { getAllUsers, getUser, updateUser, deleteUser };
