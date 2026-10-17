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
  it('returns true for the password that was hashed', () => {
    const stored = hashPassword('voter1234');

    const matches = verifyPassword('voter1234', stored);

    expect(matches).toBe(true);
  });

  it('returns false for a different password', () => {
    const stored = hashPassword('voter1234');

    const matches = verifyPassword('voter12345', stored);

    expect(matches).toBe(false);
  });

  it.each([
    ['not a hash at all', 'garbage'],
    ['empty', ''],
    ['salt without hash', 'scrypt$onlysalt'],
    ['another scheme', 'md5$salt$abcdef'],
  ])('returns false, without throwing, when the stored hash is malformed: %s', (_case, stored) => {
    const matches = verifyPassword('voter1234', stored);

    expect(matches).toBe(false);
  });
});
