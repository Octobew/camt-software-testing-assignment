import { hashPassword, verifyPassword } from '../../src/auth/passwords';

describe('hashPassword', () => {
  it('does not store the password as plain text', () => {
    const password = 'voter1234';

    const hash = hashPassword(password);

    expect(hash).not.toContain(password);
  });

  it('gives a different hash each time for the same password (random salt)', () => {
    const password = 'voter1234';

    const first = hashPassword(password);
    const second = hashPassword(password);

    expect(first).not.toBe(second);
  });
});

describe('verifyPassword', () => {
  describe('when the password is correct', () => {
    it('returns true', () => {
      const stored = hashPassword('voter1234');

      const matches = verifyPassword('voter1234', stored);

      expect(matches).toBe(true);
    });
  });

  describe('when the password is wrong', () => {
    it.each([
      ['one extra character', 'voter12345'],
      ['different case', 'VOTER1234'],
      ['empty', ''],
    ])('returns false: %s', (_case, attempt) => {
      const stored = hashPassword('voter1234');

      const matches = verifyPassword(attempt, stored);

      expect(matches).toBe(false);
    });
  });

  describe('when the stored hash is malformed', () => {
    it.each([
      ['not a hash at all', 'garbage'],
      ['empty', ''],
      ['salt without hash', 'scrypt$onlysalt'],
      ['another scheme', 'md5$salt$abcdef'],
    ])('returns false without throwing: %s', (_case, stored) => {
      const matches = verifyPassword('voter1234', stored);

      expect(matches).toBe(false);
    });
  });
});
