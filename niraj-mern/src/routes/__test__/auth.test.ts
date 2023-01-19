import request from 'supertest';
import { app } from '../../app';

beforeAll(() => {
  process.env.JWT_KEY = 'asdf';
  process.env.JWT_EXPIRES_IN = '30d';
  process.env.JWT_COOKIE_EXPIRES_IN = '30';
});

describe('Signup', () => {
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

describe('SignIn', () => {
  // validation tests
  it('returns a 400 with an invalid email', async () => {
    await request(app)
      .post('/api/auth/signin')
      .send({ email: 'test.test.com', password: 'password' })
      .expect(400);
  });

  it('returns a 400 with an invalid password', async () => {
    await request(app)
      .post('/api/auth/signin')
      .send({ email: 'test@test.com', password: 'pass' })
      .expect(400);
  });

  it('returns a 400 with missing email or password', async () => {
    await request(app)
      .post('/api/auth/signin')
      .send({ email: 'test@test.com' })
      .expect(400);

    await request(app)
      .post('/api/auth/signin')
      .send({ password: 'password' })
      .expect(400);
  });

  // Signin tests that will pass the validation tests
  it("fails when email doesn't exist that is supplied", async () => {
    await request(app)
      .post('/api/auth/signin')
      .send({ email: 'test@test.com', password: 'password' })
      .expect(400);
  });

  it('fails when an incorrect password is supplied', async () => {
    // first create the user
    const body = {
      name: 'first_name',
      email: 'test@test.com',
      password: 'password',
      passwordConfirm: 'password',
    };
    await request(app).post('/api/auth/signup').send(body).expect(201);

    await request(app)
      .post('/api/auth/signin')
      .send({ email: 'test@test.com', password: 'incorrect_password' })
      .expect(400);
  });

  it('responds with a cookie when given valid credentials', async () => {
    // first create the user
    const body = {
      name: 'first_name',
      email: 'test@test.com',
      password: 'password',
      passwordConfirm: 'password',
    };
    await request(app).post('/api/auth/signup').send(body).expect(201);

    const res = await request(app)
      .post('/api/auth/signin')
      .send({ email: body.email, password: body.password })
      .expect(200);

    expect(res.get('Set-Cookie')).toBeDefined();
  });
});
