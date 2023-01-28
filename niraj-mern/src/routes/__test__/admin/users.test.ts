import request from 'supertest';
import { app } from '../../../app';
import { User } from '../../../models/user';

describe('Get All Users', () => {
  it('responds with all the users', async () => {
    const body1 = {
      name: 'first_name',
      email: 'test@test.com',
      password: 'password',
    };
    const user = User.build(body1);
    user.isVerified = true;
    await user.save();

    const adminInfo = await getAdminCookie();

    const res = await request(app)
      .get('/api/admin/users')
      .set('Cookie', adminInfo.cookie)
      .send();

    // Admin's document is also created
    expect(res.body).toHaveLength(2);
  });
});

describe('Get User', () => {
  it('responds with the user', async () => {
    const constBody = {
      name: 'first_name',
      email: 'test@test.com',
      password: 'password',
    };

    const user = User.build(constBody);
    user.isVerified = true;
    await user.save();

    const adminInfo = await getAdminCookie();

    const res = await request(app)
      .get(`/api/admin/users/${user.id}`)
      .set('Cookie', adminInfo.cookie)
      .send();

    expect(res.body.id).toBe(user.id);
  });
});

describe('Updates the user', () => {
  it('updates the user', async () => {
    // create the user: signup
    const body = {
      name: 'first_name',
      email: 'test@test.com',
      password: 'password',
    };
    const user = User.build(body);
    user.isVerified = true;
    await user.save();

    // updates user user as admin
    const adminInfo = await getAdminCookie();
    const res = await request(app)
      .patch(`/api/admin/users/${user.id}`)
      .set('Cookie', adminInfo.cookie)
      .send({ name: 'second_name' })
      .expect(200);

    expect(res.body.name).toBe('second_name');
  });
});

describe('Deletes the user', () => {
  it('deletes the user', async () => {
    // create the user: signup
    const body = {
      name: 'first_name',
      email: 'test@test.com',
      password: 'password',
    };
    const user = User.build(body);
    user.isVerified = true;
    await user.save();

    // delete user user as admin
    const adminInfo = await getAdminCookie();
    await request(app)
      .delete(`/api/admin/users/${user.id}`)
      .set('Cookie', adminInfo.cookie)
      .send()
      .expect(204);

    // deleted cannot login into the app
    await request(app)
      .post('/api/auth/signin')
      .send({ email: body.email, password: body.password })
      .expect(404);
  });
});
