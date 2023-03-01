const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const { userOne, userOneId, setupDatabase } = require('./fixtures/db');

// This is just async callback function
beforeEach(setupDatabase);

afterAll(async () => {
  await mongoose.disconnect();
});

test('Should signup a new user', async () => {
  const res = await request(app)
    .post('/users')
    .send({
      name: 'Umer',
      email: 'test1@test.com',
      password: 'test1234',
    })
    .expect(201);

  // user is created in db
  const user = await User.findById(res.body.user._id);
  expect(user).not.toBeNull();

  // Assertions about the response, object provided can be or cannot be exact one
  expect(res.body).toMatchObject({
    user: { name: 'Umer', email: 'test1@test.com' },
    token: user.tokens[0].token,
  });

  expect(user.password).not.toBe('test1234');
});

test('Should login existing user', async () => {
  const res = await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  const user = await User.findById(res.body.user._id);

  expect(res.body.token).toBe(user.tokens[1].token);
});

test("Should not login if user doesn't exist", async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: 'random@random.com',
      password: 'random-password',
    })
    .expect(400);
});

test('Should get user profile', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test('Should not get profile or unauthenticated users', async () => {
  await request(app)
    .get('/users/me')
    // don't provide token
    .send()
    .expect(401);
});

test('Should delete account for unauthenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test('Should not delete account for unauthenticated user', async () => {
  await request(app)
    .delete('/users/me')
    // don't provide token
    .send()
    .expect(401);
});

test('Should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'test/fixtures/profile-pic.jpg')
    .expect(200);

  const user = await User.findById(userOneId);
  // Check if it is an instance of buffer
  // toEqual is used if we are checking for different objs in memory
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update valid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ name: 'Gulzar' })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.name).toBe('Gulzar');
});

test('Should not update invalid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ location: 'Pakistan' })
    .expect(400);
});
