import { User } from '../../src/domain/types';
import { toPublicUser } from '../../src/services/accountService';

describe('toPublicUser', () => {
  const user: User = {
    id: 7,
    nationalId: '1509900000017',
    passwordHash: 'scrypt$salt$hash',
    firstName: 'สมชาย',
    lastName: 'ใจดี',
    address: '239 ถ.ห้วยแก้ว',
    districtId: 'CM-1',
    role: 'VOTER',
  };

  it('leaves the password hash out', () => {
    const publicUser = toPublicUser(user);

    expect(publicUser).not.toHaveProperty('passwordHash');
  });

  it('keeps every other field unchanged', () => {
    const publicUser = toPublicUser(user);

    expect(publicUser).toEqual({
      id: 7,
      nationalId: '1509900000017',
      firstName: 'สมชาย',
      lastName: 'ใจดี',
      address: '239 ถ.ห้วยแก้ว',
      districtId: 'CM-1',
      role: 'VOTER',
    });
  });
});
