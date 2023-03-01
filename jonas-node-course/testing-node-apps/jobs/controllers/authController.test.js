import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

import User from '../models/user';
import { registerUser } from './authController';

// MOCKS
jest.mock('../utils/helpers.js', () => ({
  getJwtToken: jest.fn().mockReturnValue('jwt_token'),
}));

const mockRequest = () => ({
  body: { name: 'test', email: 'test@test.com', password: 'testtest' },
});

const mockResponse = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
});

// LIFECYCLE CALLBACKS
afterEach(() => {
  // works on spyOn
  jest.restoreAllMocks();
  // works on every mock
  jest.resetAllMocks();
});

describe('Register User', () => {
  const mockUser = () => ({
    _id: new mongoose.Types.ObjectId().toString(),
    name: 'test',
    email: 'test@test.com',
    password: 'mockedHashedValue',
  });

  it('should register user', async () => {
    // mock the bcrypt hash function
    // from the bcrypt module, only mock 'hash' function
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('mockedHashedValue');

    // mock the User.create function
    const user = mockUser();

    jest.spyOn(User, 'create').mockResolvedValue(user);

    const req = mockRequest();
    const res = mockResponse();

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalled();
    expect(User.create).toHaveBeenCalled();
  });
});
