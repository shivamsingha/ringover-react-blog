require('dotenv').config({ path: '.test.env' });
const db = require('../psql-con');
const app = require('../../index');
const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

describe('Response of POST to /signin', () => {
  const email = 'a@abc.com';
  const password = 'Abcdefg1';

  beforeAll(async () => {
    await db.query('TRUNCATE TABLE users');
  });

  describe('when user does not exist', () => {
    test('should be 401 and contain error message', async () => {
      const response = await request(app)
        .post('/api/user/signin')
        .send({ email, password });
      expect(response.statusCode).toBe(401);
      expect(response.body).toStrictEqual({
        msg: 'Email or password is incorrect.',
      });
    });
  });

  describe('when user exists', () => {
    beforeEach(async () => {
      await db.query('INSERT INTO users VALUES($1, $2, $3)', [
        email,
        'abc',
        bcrypt.hashSync(password, 10),
      ]);
    });

    test('should be 200 and contain token', async () => {
      const response = await request(app)
        .post('/api/user/signin')
        .send({ email, password });
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        user: {
          email: expect.stringContaining(email),
          username: expect.stringContaining('abc'),
        },
      });
      expect(
        jwt.verify(response.body.token, process.env.JWTSECRETKEY)
      ).toMatchObject({
        email: expect.stringContaining(email),
        username: expect.stringContaining('abc'),
      });
    });
  });
});

describe('Response of POST to /signup', () => {
  const email = 'a@abc.com';
  const username = 'abcd'
  const password = 'Abcdefg1';

  beforeEach(async () => {
    await db.query('TRUNCATE TABLE users');
  });

  describe('when email & username is available', () => {
    test('should be 201', async () => {
      const response = await request(app)
        .post('/api/user/signup')
        .send({ email, username, password });
      expect(response.statusCode).toBe(201);
    });
  });

  describe('', () => {
    beforeEach(async () => {
      await db.query('INSERT INTO users VALUES($1, $2, $3)', [
        email,
        username,
        bcrypt.hashSync(password, 10),
      ]);
    });

    test('when username already in use should be 400', async () => {
      const response = await request(app)
        .post('/api/user/signup')
        .send({ email: 'abc@abc.com', username, password });
      expect(response.statusCode).toBe(400);
    });

    test('when email already in use should be 400', async () => {
      const response = await request(app)
        .post('/api/user/signup')
        .send({ email, username:'asdfa', password });
      expect(response.statusCode).toBe(400);
    });
  });
});
