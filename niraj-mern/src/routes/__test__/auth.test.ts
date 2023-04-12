import request from 'supertest';
import { app } from '../../app';
import { mailer } from '../../emails/mailer';
import { AdminVerifyToken } from '../../models/tokens/admin-verify-token';
import { EmailVerifyToken } from '../../models/tokens/email-verify-token';
import { ResetPasswordToken } from '../../models/tokens/reset-password-token';
import { User, type UserDocument } from '../../models/user';
import { Password } from '../../services/password';
import {
  addAdminVerifyToken,
  addEmailVerifyToken,
  addResetPasswordToken,
} from '../../utils/token-utils';

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
    await addEmailVerifyToken(user.id);

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
    const token = await addEmailVerifyToken(user.id);

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

describe('Current User', () => {
  it('responds with details about the currentuser, if user is logged in', async () => {
    const { cookie, email } = await getAuthCookie();

    const res = await request(app)
      .get('/api/auth/currentuser')
      .set('Cookie', cookie)
      .send()
      .expect(200);

    expect(res.body.currentUser.email).toBe(email);
  });

  it('responds undefined if user is not logged in', async () => {
    const res = await request(app).get('/api/auth/currentuser').send();

    expect(res.body.currentUser).toBeNull();
  });
});

describe('Update Me', () => {
  it('updates the user if correct properties are provided', async () => {
    // create the user
    const { cookie } = await getAuthCookie();

    // update the user
    await request(app)
      .patch('/api/auth/update-me')
      .set('Cookie', cookie)
      .send({ name: 'second_name' })
      .expect(200);

    // get the user
    const res = await request(app)
      .get('/api/auth/currentuser')
      .set('Cookie', cookie)
      .send()
      .expect(200);

    expect(res.body.currentUser.name).toBe('second_name');
  });
});

describe('Update Password', () => {
  it('returns 401, when user is not authenticated', async () => {
    // Create the user, but don't send the cookie
    const { password } = await getAuthCookie();

    const newPass = 'new_password';

    await request(app)
      .patch('/api/auth/update-password')
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
      .patch('/api/auth/update-password')
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
    const token = await addResetPasswordToken(user.id);
    const url = `/api/auth/reset-password?token=${token}&userId=${user.id}`;

    const newPass = 'newPassword';
    const res = await request(app)
      .patch(url)
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

describe('Sign out', () => {
  it('clears the cookie after signing out', async () => {
    const { cookie } = await getAuthCookie();

    const res = await request(app)
      .post('/api/auth/signout')
      .set('Cookie', cookie)
      .send({})
      .expect(200);

    // there should be a cookie with jwt in the cookies array, and that should contain cookieItem
    res.get('Set-Cookie').forEach(cookieItem => {
      expect(cookieItem).toContain('logged_out');
    });
  });
});

describe('Delete Me', () => {
  it('deletes the currentuser', async () => {
    const userInfo = await getAuthCookie();

    const res = await request(app)
      .delete('/api/auth/delete-me')
      .set('Cookie', userInfo.cookie)
      .send()
      .expect(204);

    expect(res.get('Set-Cookie')[0]).toContain('user_deleted');

    // Now the user cannot sign in
    await request(app)
      .post('/api/auth/signin')
      .send({ email: userInfo.email, password: userInfo.password })
      .expect(404);
  });
});

describe('Signup admin with token', () => {
  let user: UserDocument;
  let token: string;

  beforeEach(async () => {
    user = await User.build({
      name: 'firstname',
      email: 'test@test.com',
      password: 'password',
    }).save();

    token = await addAdminVerifyToken(user.id);
  });

  it('sets the role to "admin" if correct token is provided', async () => {
    await request(app)
      .patch(`/api/auth/admin-signup/${user.id}?token=${token}`)
      .send()
      .expect(200);

    const updatedUser = await User.findById(user.id);
    expect(updatedUser!.role).toBe('admin');
  });

  it('sets the cookie with updated user', async () => {
    const res = await request(app)
      .patch(`/api/auth/admin-signup/${user.id}?token=${token}`)
      .send()
      .expect(200);

    expect(res.get('Set-Cookie')).toBeDefined();
  });

  it('removes the token, after updating', async () => {
    await request(app)
      .patch(`/api/auth/admin-signup/${user.id}?token=${token}`)
      .send()
      .expect(200);

    const foundToken = await AdminVerifyToken.findOne({
      owner: user.id,
      token: Password.hashToken(token),
    });

    expect(foundToken).toBeNull();
  });
});
