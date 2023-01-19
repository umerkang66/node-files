import request from 'supertest';
import { app } from '../../app';

describe('Signup', () => {
  beforeEach(() => {
    process.env.JWT_KEY = 'asdf';
    process.env.JWT_EXPIRES_IN = '30d';
    process.env.JWT_COOKIE_EXPIRES_IN = '30';
  });

  it('returns 400 with missing email or password, or both', async () => {
    await request(app).post('/api/auth/signup').send({}).expect(400);

    await request(app)
      .post('/api/auth/signup')
      .send({ email: 'test@test.com' })
      .expect(400);

    await request(app)
      .post('/api/auth/signup')
      .send({ password: 'password' })
      .expect(400);
  });

  it('disallows duplicate emails', async () => {
    const body = {
      name: 'first_name',
      email: 'test@test.com',
      password: 'password',
      passwordConfirm: 'password',
    };

    await request(app).post('/api/auth/signup').send(body).expect(201);

    await request(app).post('/api/auth/signup').send(body).expect(400);
  });

  it('sets a cookie after successful signup', async () => {
    const body = {
      name: 'first_name',
      email: 'test@test.com',
      password: 'password',
      passwordConfirm: 'password',
    };

    const res = await request(app)
      .post('/api/auth/signup')
      .send(body)
      .expect(201);

    expect(res.get('Set-Cookie')).toBeDefined();
  });
});
