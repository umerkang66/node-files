jest.setTimeout(100000);

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

let mongo: MongoMemoryServer;

declare global {
  var getAuthCookie: () => Promise<{
    name: string;
    email: string;
    password: string;
    id: string;
    cookie: string;
  }>;

  var getAdminCookie: () => Promise<{
    name: string;
    email: string;
    password: string;
    id: string;
    cookie: string;
  }>;
}

beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  mongoose.set('strictQuery', false);

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

global.getAuthCookie = async () => {
  const name = 'first';
  const email = 'test@test.com';
  const password = 'password';

  const user = User.build({ name, email, password });
  user.isVerified = true;
  await user.save();

  const token = jwt.sign({ id: user.id }, process.env.JWT_KEY!);

  const cookie = `jwt=${token}`;

  return { name, email, password, id: user.id, cookie };
};

global.getAdminCookie = async () => {
  const name = 'first';
  const email = 'admin@admin.com';
  const password = 'password';

  const user = User.build({ name, email, password });
  user.isVerified = true;
  user.role = 'admin';
  await user.save();

  const token = jwt.sign({ id: user.id }, process.env.JWT_KEY!);

  const cookie = `jwt=${token}`;

  return { name, email, password, id: user.id, cookie };
};
