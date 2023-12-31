import util from 'util';
import { Post } from '../models/post';
import { createUser, deleteAllUsers } from './user';

const createPost = async () => {
  await deleteAllUsers();
  await deleteAllPosts();

  const user1 = await createUser();
  const user2 = await createUser();

  console.log(user1, user2);

  await new Post({ title: 'Title', author: user1.id }).save();
  await new Post({ title: 'Title', author: user2.id }).save();
};

const queryAllPosts = async () => {
  const posts = await Post.find();

  console.log(util.inspect(posts, false, null, true));
};

const deleteAllPosts = () => {
  return Post.deleteMany();
};

export { createPost, queryAllPosts, deleteAllPosts };
