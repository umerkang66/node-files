import request from 'supertest';
import { app } from '../../app';
import { mailer } from '../../emails/mailer';
import { EmailVerifyToken } from '../../models/tokens/email-verify-token';
import { ResetPasswordToken } from '../../models/tokens/reset-password-token';
import { User, type UserDocument } from '../../models/user';
import { Password } from '../../services/password';

// in the same directory there should be __mocks__/mailer.ts
jest.mock('../../emails/mailer');

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

  it('sends the otp token email after successful signup', async () => {
    const body = {
      name: 'first_name',
      email: 'test@test.com',
      password: 'password',
      passwordConfirm: 'password',
    };

    await request(app).post('/api/auth/signup').send(body).expect(201);

    expect(mailer.sendMail).toHaveBeenCalled();
  });
});

describe('Resend Email Verification Token', () => {
  let user: UserDocument;

  beforeEach(async () => {
    // Create the user
    user = await User.build({
      name: 'first',
      email: 't@t.com',
      password: 'password',
    }).save();
  });

  it('returns 400, if token already exists', async () => {
    await user.addEmailVerifyToken();

    await request(app)
      .post('/api/auth/resend-email-verify-token')
      .send({ userId: user.id })
      .expect(400);
  });

  it('sends the token to email', async () => {
    await request(app)
      .post('/api/auth/resend-email-verify-token')
      .send({ userId: user.id })
      .expect(200);

    expect(mailer.sendMail).toHaveBeenCalled();
  });
});

describe('Confirm Signup', () => {
  it('returns and error if invalid userId is provided', async () => {
    await request(app)
      .post('/api/auth/confirm-signup')
      .send({ token: 'random_token', userId: 'random_userId' })
      .expect(400);
  });

  it('Signs up the user after token is provided', async () => {
    // First create the user
    const user = await User.build({
      name: 'first',
      email: 't@t.com',
      password: 'password',
    }).save();

    const userId = user.id;
    const token = await user.addEmailVerifyToken();

    const body = { userId, token };
    const res = await request(app)
      .post('/api/auth/confirm-signup')
      .send(body)
      .expect(201);

    expect(res.get('Set-Cookie')).toBeDefined();
    // After verifying the user, isVerified should be true
    expect(res.body.isVerified).toBe(true);

    // Token should be deleted after signing up
    const foundToken = await EmailVerifyToken.findOne({
      token: Password.hashToken(token),
    });

    expect(foundToken).toBeNull();
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
      .expect(404);
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
    const email = 'test@test.com';
    const password = 'password';

    const user = User.build({
      name: 'first_name',
      email,
      password,
    });
    user.isVerified = true;
    await user.save();

    const res = await request(app)
      .post('/api/auth/signin')
      .send({ email, password })
      .expect(200);

    expect(res.get('Set-Cookie')).toBeDefined();
  });
});

describe('Update Password', () => {
  it('returns 401, when user is not authenticated', async () => {
    // Create the user, but don't send the cookie
    const { password } = await getAuthCookie();

    const newPass = 'new_password';

    await request(app)
      .post('/api/auth/update-password')
      .send({
        currentPassword: password,
        password: newPass,
        passwordConfirm: newPass,
      })
      .expect(401);
  });

  it('Updates the password, if user is logged in', async () => {
    // Create the user and cookie
    const { email, password, cookie } = await getAuthCookie();

    const newPass = 'new_password';

    await request(app)
      .post('/api/auth/update-password')
      .set('Cookie', cookie)
      .send({
        currentPassword: password,
        password: newPass,
        passwordConfirm: newPass,
      })
      .expect(200);

    // It should signin with the new password
    const res = await request(app)
      .post('/api/auth/signin')
      .send({ email, password: newPass })
      .expect(200);

    expect(res.get('Set-Cookie')).toBeDefined();
  });
});

describe('Forgot and Reset Password', () => {
  let user: UserDocument;

  beforeEach(async () => {
    user = User.build({
      name: 'first_name',
      email: 'test@test.com',
      password: 'password',
    });
    user.isVerified = true;
    await user.save();
  });

  it('Sends the token to email, if user is found', async () => {
    await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: user.email })
      .expect(200);

    // token should be created with this owner
    const foundToken = ResetPasswordToken.findOne({ owner: user.id });
    expect(foundToken).toBeDefined();

    expect(mailer.sendMail).toHaveBeenCalled();
  });

  it('changes the password of user after token is provided', async () => {
    // Create the token
    const token = await user.addResetPasswordToken();
    const url = `/api/auth/reset-password?token=${token}&userId=${user.id}`;

    const newPass = 'newPassword';
    const res = await request(app)
      .post(url)
      .send({ password: newPass, passwordConfirm: newPass })
      .expect(200);

    // This also sets the cookie
    expect(res.get('Set-Cookie')).toBeDefined();

    // it should login with new password
    const res2 = await request(app)
      .post('/api/auth/signin')
      .send({ email: user.email, password: newPass })
      .expect(200);

    expect(res2.get('Set-Cookie')).toBeDefined();
  });
});
