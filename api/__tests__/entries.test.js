require('dotenv').config({ path: '.test.env' });
const db = require('../psql-con');
const request = require('supertest')(require('../../index'));
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

describe('Response of GET to /api/entries/:title', () => {
  const entryObject = {
    header: 'TestHeader',
    subheader: 'TestSubheader',
    cateogry: 'TestCategory',
    content: 'TestContent',
    author: 'TestAuthor',
    date: '2000-01-01',
  };

  beforeAll(async () => {
    await db.query('TRUNCATE TABLE entries');
    await db.query(
      'INSERT INTO entries VALUES($1, $2, $3, $4, $5, $6)',
      Object.values(entryObject)
    );
  });

  describe('if title invalid', () => {
    test('should be 400', async () => {
      const response = await request.get('/api/entries/!@asd');
      expect(response.statusCode).toBe(400);
    });
  });

  describe('if title does not exist', () => {
    test('should be 204', async () => {
      const response = await request.get('/api/entries/asdfa');
      expect(response.statusCode).toBe(204);
    });
  });

  describe('if title exists', () => {
    test('should be 200 and contain entries', async () => {
      const response = await request.get('/api/entries/TestHeader');
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject([
        {
          header: expect.stringContaining(entryObject.header),
          subheader: expect.stringContaining(entryObject.subheader),
          cateogry: expect.stringContaining(entryObject.cateogry),
          author: expect.stringContaining(entryObject.author),
          date: expect.stringContaining(entryObject.date),
        },
      ]);
    });
  });
});

describe('Response of GET to /api/entries/page/:page', () => {
  const entryObject = {
    header: 'TestHeader',
    subheader: 'TestSubheader',
    cateogry: 'TestCategory',
    content: 'TestContent',
    author: 'TestAuthor',
    date: '2000-01-01',
  };

  beforeAll(async () => {
    await db.query('TRUNCATE TABLE entries');
  });

  describe('if invalid page number', () => {
    test('should be 204', async () => {
      const response = await request.get('/api/entries/page/0');
      expect(response.statusCode).toBe(204);
    });
  });

  describe('if empty entries', () => {
    beforeAll(async () => {
      await db.query('TRUNCATE TABLE entries');
    });
    test('should be 200', async () => {
      const response = await request.get('/api/entries/page/1');
      expect(response.statusCode).toBe(200);
    });
  });

  describe('if title invalid', () => {
    beforeAll(async () => {
      await db.query('TRUNCATE TABLE entries');
      for (let i = 0; i < 8; i++)
        await db.query(
          'INSERT INTO entries VALUES($1, $2, $3, $4, $5, $6)',
          Object.values(entryObject)
        );
    });
    test('should be 200', async () => {
      const response = await request.get('/api/entries/page/1');
      expect(response.statusCode).toBe(200);
    });
  });
});

describe('Response of POST to /api/entries/new', () => {
  const email = 'a@abc.com';
  const username = 'abc';
  const password = 'Abcdefg1';
  const token = jwt.sign({ username, email }, process.env.JWTSECRETKEY, {
    expiresIn: '1h',
  });
  const validInput = {
    header: 'TestHeader',
    subheader: 'TestSubheader',
    category: 'TestCategory',
    content: 'TestContent',
    token,
  };
  const invalidInput = {
    header: 'TestHeader',
    subheader: 'TestSubheader',
    category: '',
    content: 'TestContent',
    token,
  };

  beforeAll(async () => {
    await db.query('TRUNCATE TABLE entries');
    await db.query('TRUNCATE TABLE users');
    await db.query('INSERT INTO users VALUES($1, $2, $3)', [
      email,
      username,
      bcrypt.hashSync(password, 10),
    ]);
  });

  describe('if inputs are valid', () => {
    test('should be 201', async () => {
      const response = await request.post('/api/entries/new').send(validInput);
      expect(response.statusCode).toBe(201);
      expect(response.body).toMatchObject({
        msg: expect.stringContaining(
          'Your entry has been added to the database.'
        ),
      });
    });
  });

  describe('if inputs are invalid', () => {
    test('should be 400', async () => {
      const response = await request
        .post('/api/entries/new')
        .send(invalidInput);
      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        msg: expect.stringContaining('Please fill all the fields.'),
      });
    });
  });
});
