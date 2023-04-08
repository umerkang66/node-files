import { User } from '../models/user';
import { catchAsync } from './catchAsync';

let num = 1;

const createUser = catchAsync(async () => {
  await deleteAllUsers();

  const user = new User({
    email: `test${num}@test.com`,
    username: 'umer did this',
    job: { company: 'company', title: 'developer' },
  });
  num++;
  return user.save();
});

const queryAllUsers = async () => {
  const users = await User.find();
  console.log(users);
};

const updateUser = async () => {
  const updatedUser = await User.findOneAndUpdate(
    { email: 'test1@test.com' },
    { email: 'test25@test.com' },
    { new: true, runValidators: true }
  );

  console.log(updatedUser);
};

const deleteAllUsers = () => {
  return User.deleteMany();
};

export { createUser, queryAllUsers, updateUser, deleteAllUsers };
