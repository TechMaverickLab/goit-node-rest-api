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
  });

  it('should login a user', async () => {
    await request(server).post('/api/users/register').send(testUser);

    const res = await request(server)
      .post('/api/users/login')
      .send(testUser)
      .expect(200);

    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', testUser.email);
    expect(res.body.user).toHaveProperty('subscription', 'starter');

    token = res.body.token;
  });

  it('should return a token on login', async () => {
    await request(server).post('/api/users/register').send(testUser);

    const res = await request(server)
      .post('/api/users/login')
      .send(testUser)
      .expect(200);

    expect(res.body).toHaveProperty('token');
  });

  it('should return a user object with email and subscription on login', async () => {
    await request(server).post('/api/users/register').send(testUser);

    const res = await request(server)
      .post('/api/users/login')
      .send(testUser)
      .expect(200);

    expect(res.body.user).toHaveProperty('email', testUser.email);
    expect(res.body.user).toHaveProperty('subscription', 'starter');
  });
});
