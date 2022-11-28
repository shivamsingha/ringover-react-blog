require('dotenv').config({ path: '.test.env' });
const { emailExists, usernameExists } = require('../routes/userFunctions');
const db = require('../psql-con');

describe('emailExists', () => {
  beforeAll(async () => {
    await db.query('TRUNCATE TABLE users');
    await db.query('INSERT INTO users VALUES($1, $2, $3)', [
      'a@abc.com',
      'abc',
      '123',
    ]);
  });

  test('should return false if email does not exist', async () => {
    const value = await emailExists('b@xyz.com');
    expect(value).toBe(false);
  });

  test('should return true if email exists', async () => {
    const value = await emailExists('a@abc.com');
    expect(value).toBe(true);
  });
});

describe('usernameExists', () => {
  beforeAll(async () => {
    await db.query('TRUNCATE TABLE users');
    await db.query('INSERT INTO users VALUES($1, $2, $3)', [
      'a@abc.com',
      'abc',
      '123',
    ]);
  });

  test('should return false if email does not exist', async () => {
    const value = await usernameExists('xyz');
    expect(value).toBe(false);
  });

  test('should return true if email exists', async () => {
    const value = await usernameExists('abc');
    expect(value).toBe(true);
  });
});
