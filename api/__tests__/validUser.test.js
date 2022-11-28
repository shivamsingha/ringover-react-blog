const { validUser } = require('../routes/userFunctions');

describe('validUser', () => {
  const knownValidEmail = 'a+b.c1@d1ef.ghi.com';
  const knownValidUsername = 'abc';
  const knownValidPassword = 'Abcdefg1';

  describe('for valid email, username, password', () => {
    test('should return true', () => {
      expect(
        validUser(knownValidEmail, knownValidUsername, knownValidPassword)
      ).toBe(true);
    });
  });

  describe("for email 'abc.com'", () => {
    test('should return false', () => {
      expect(validUser('abc.com', knownValidUsername, knownValidPassword)).toBe(
        false
      );
    });
  });

  describe("for email 'abc@a@abc.com'", () => {
    test('should return false', () => {
      expect(
        validUser('abc@a@abc.com', knownValidUsername, knownValidPassword)
      ).toBe(false);
    });
  });

  describe("for email '.abc@abc.com'", () => {
    test('should return false', () => {
      expect(
        validUser('.abc@abc.com', knownValidUsername, knownValidPassword)
      ).toBe(false);
    });
  });

  describe("for username 'ab'", () => {
    test('should return false', () => {
      expect(validUser(knownValidEmail, 'ab', knownValidPassword)).toBe(false);
    });
  });

  describe("for password 'abcdefgh'", () => {
    test('should return false', () => {
      expect(validUser(knownValidEmail, knownValidUsername, 'abcdefgh')).toBe(
        false
      );
    });
  });

  describe("for password 'aBcdefgh'", () => {
    test('should return false', () => {
      expect(validUser(knownValidEmail, knownValidUsername, 'aBcdefgh')).toBe(
        false
      );
    });
  });

  describe("for password 'abcde1gh'", () => {
    test('should return false', () => {
      expect(validUser(knownValidEmail, knownValidUsername, 'abcde1gh')).toBe(
        false
      );
    });
  });

  describe("for password 'Ab1'", () => {
    test('should return false', () => {
      expect(validUser(knownValidEmail, knownValidUsername, 'Ab1')).toBe(false);
    });
  });
});
