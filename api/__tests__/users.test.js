require('dotenv').config({ path: '.test.env' });
const db = require('../psql-con');
const request = require('supertest')(require('../../index'));
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

describe('Response of POST to /signin', () => {
  const email = 'a@abc.com';
  const username = 'abc';
  const password = 'Abcdefg1';

  beforeAll(async () => {
    await db.query('TRUNCATE TABLE users');
  });

  describe('when user does not exist', () => {
    test('should be 401 and contain error message', async () => {
      const response = await request
        .post('/api/user/signin')
        .send({ email, password });
      expect(response.statusCode).toBe(401);
      expect(response.body).toStrictEqual({
        msg: 'Email or password is incorrect.',
      });
    });
  });

  describe('when email & password are right', () => {
    beforeAll(async () => {
      await db.query('TRUNCATE TABLE users');
      await db.query('INSERT INTO users VALUES($1, $2, $3)', [
        email,
        username,
        bcrypt.hashSync(password, 10),
      ]);
    });

    test('should be 200 and contain token', async () => {
      const response = await request
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

  describe('when password is wrong', () => {
    beforeAll(async () => {
      await db.query('TRUNCATE TABLE users');
      await db.query('INSERT INTO users VALUES($1, $2, $3)', [
        email,
        username,
        bcrypt.hashSync(password, 10),
      ]);
    });

    test('should be 401 and contain token', async () => {
      const response = await request
        .post('/api/user/signin')
        .send({ email, password: 'cmncfjcf' });
      expect(response.statusCode).toBe(401);
      expect(response.body).toStrictEqual({
        msg: 'Email or password is incorrect.',
      });
    });
  });
});

describe('Response of POST to /signup', () => {
  const email = 'a@abc.com';
  const username = 'abcd';
  const password = 'Abcdefg1';

  beforeEach(async () => {
    await db.query('TRUNCATE TABLE users');
  });

  describe('when email & username is available', () => {
    test('should be 201', async () => {
      const response = await request
        .post('/api/user/signup')
        .send({ email, username, password });
      expect(response.statusCode).toBe(201);
      expect(response.body).toMatchObject(['User successfully registered!']);
    });
  });

  describe('when username already in use', () => {
    beforeEach(async () => {
      await db.query('INSERT INTO users VALUES($1, $2, $3)', [
        email,
        username,
        bcrypt.hashSync(password, 10),
      ]);
    });

    test('should be 400', async () => {
      const response = await request
        .post('/api/user/signup')
        .send({ email: 'abc@abc.com', username, password });
      expect(response.statusCode).toBe(400);
    });
  });

  describe('when email already in use', () => {
    beforeEach(async () => {
      await db.query('INSERT INTO users VALUES($1, $2, $3)', [
        email,
        username,
        bcrypt.hashSync(password, 10),
      ]);
    });

    test('should be 400', async () => {
      const response = await request
        .post('/api/user/signup')
        .send({ email, username: 'asdfa', password });
      expect(response.statusCode).toBe(400);
    });
  });

  describe('when email is invalid already in use', () => {
    test('should be 400', async () => {
      const response = await request
        .post('/api/user/signup')
        .send({ email: 'abc.com', username, password });
      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject([
        'Inputted data does not meet the requirements.',
      ]);
    });
  });
});
