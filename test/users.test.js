const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../schemas/userModel');
require('dotenv').config();

const app = require('../app'); 

const testUser = {
  email: 'test@example.com',
  password: 'password123',
};

let server;
let token;
let verificationToken;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  server = app.listen(3001);
  jest.setTimeout(10000);
});

afterAll(async () => {
  console.log('Closing database connection...');
  await mongoose.connection.close();
  console.log('Database connection closed.');
  if (server) {
    console.log('Closing server...');
    await new Promise(resolve => server.close(resolve));
    console.log('Server closed.');
  }
  await new Promise(resolve => setImmediate(resolve));
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('User Authentication', () => {
  it('should register a user', async () => {
    const res = await request(server)
      .post('/api/users/register')
      .send(testUser)
      .expect(201);

    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', testUser.email);
    expect(res.body.user).toHaveProperty('subscription', 'starter');

    const user = await User.findOne({ email: testUser.email });
    expect(user).toBeDefined();
    expect(user.verificationToken).toBeDefined();

    verificationToken = user.verificationToken;
  });

  it('should not register a user with an existing email', async () => {
    await request(server)
      .post('/api/users/register')
      .send(testUser)
      .expect(201);

    const res = await request(server)
      .post('/api/users/register')
      .send(testUser)
      .expect(409);

      expect(res.body).toHaveProperty('message', 'Email вжe використовується');
  });

  it('should login a user', async () => {
    await request(server)
      .post('/api/users/register')
      .send(testUser);

    const user = await User.findOne({ email: testUser.email });
    verificationToken = user.verificationToken;

    await request(server)
      .get(`/api/users/verify/${verificationToken}`)
      .expect(200);

    const res = await request(server)
      .post('/api/users/login')
      .send(testUser)
      .expect(200);

    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', testUser.email);
    expect(res.body.user).toHaveProperty('subscription', 'starter');

    token = res.body.token;
  });

  it('should not login a user with incorrect password', async () => {
    await request(server)
      .post('/api/users/register')
      .send(testUser);

    const user = await User.findOne({ email: testUser.email });
    verificationToken = user.verificationToken;

    await request(server)
      .get(`/api/users/verify/${verificationToken}`)
      .expect(200);

    const res = await request(server)
      .post('/api/users/login')
      .send({ email: testUser.email, password: 'wrongpassword' })
      .expect(401);

    expect(res.body).toHaveProperty('message', 'Email або пароль невірний');
  });

  it('should not verify email with invalid token', async () => {
    await request(server)
      .post('/api/users/register')
      .send(testUser);

    const res = await request(server)
      .get(`/api/users/verify/invalidToken`)
      .expect(404);

    expect(res.body).toHaveProperty('message', 'Користувач не знайдений');
  });

  it('should send a verification email on registration', async () => {
    const res = await request(server)
      .post('/api/users/register')
      .send(testUser)
      .expect(201);

    const user = await User.findOne({ email: testUser.email });
    expect(user).toBeDefined();
    expect(user.verificationToken).toBeDefined();
  });

  it('should invalidate the verification token after verification', async () => {
    await request(server)
      .post('/api/users/register')
      .send(testUser);

    const user = await User.findOne({ email: testUser.email });
    verificationToken = user.verificationToken;

    await request(server)
      .get(`/api/users/verify/${verificationToken}`)
      .expect(200);

    const verifiedUser = await User.findOne({ email: testUser.email });
    expect(verifiedUser.verificationToken).toBeNull();
  });

  it('should return a token on login', async () => {
    await request(server)
      .post('/api/users/register')
      .send(testUser);

    const user = await User.findOne({ email: testUser.email });
    verificationToken = user.verificationToken;

    await request(server)
      .get(`/api/users/verify/${verificationToken}`)
      .expect(200);

    const res = await request(server)
      .post('/api/users/login')
      .send(testUser)
      .expect(200);

    expect(res.body).toHaveProperty('token');
  });

  it('should return a user object with email and subscription on login', async () => {
    await request(server)
      .post('/api/users/register')
      .send(testUser);

    const user = await User.findOne({ email: testUser.email });
    verificationToken = user.verificationToken;

    await request(server)
      .get(`/api/users/verify/${verificationToken}`)
      .expect(200);

    const res = await request(server)
      .post('/api/users/login')
      .send(testUser)
      .expect(200);

    expect(res.body.user).toHaveProperty('email', testUser.email);
    expect(res.body.user).toHaveProperty('subscription', 'starter');
  });
});
