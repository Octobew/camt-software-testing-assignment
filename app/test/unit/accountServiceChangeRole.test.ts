import { TokenService } from '../../src/auth/tokenService';
import { User } from '../../src/domain/types';
import { DistrictRepository } from '../../src/repositories/districtRepository';
import { UserRepository } from '../../src/repositories/userRepository';
import { AccountService } from '../../src/services/accountService';

function notUsed(name: string) {
  return () => {
    throw new Error(`dummy ${name} should not be used`);
  };
}

// Dummy: changeRole ไม่แตะ DistrictRepository เลย แต่ constructor ต้องการ
// ถ้าวันหนึ่งถูกเรียกขึ้นมา test จะพังทันที เพราะสมมติฐาน "ไม่ถูกใช้" ไม่จริงแล้ว
const dummyDistricts: DistrictRepository = {
  findAll: notUsed('DistrictRepository.findAll'),
  findById: notUsed('DistrictRepository.findById'),
};

// Dummy: changeRole ไม่ได้ออก token ใหม่ จึงไม่ควรเรียก TokenService
const dummyTokens: TokenService = {
  issue: notUsed('TokenService.issue'),
  verify: notUsed('TokenService.verify'),
};

// UserRepository: changeRole ใช้แค่ updateRole ส่วน method อื่นเป็น dummy
// updateRole เป็น jest.fn() — แต่ละ test จะใช้มันเป็น stub, spy หรือ mock
function usersWhereUpdateRole(updateRole: UserRepository['updateRole']) {
  return {
    findById: notUsed('UserRepository.findById'),
    findByNationalId: notUsed('UserRepository.findByNationalId'),
    create: notUsed('UserRepository.create'),
    updateRole: jest.fn(updateRole),
  } satisfies UserRepository;
}

const somchai: User = {
  id: 11,
  nationalId: '1509900000017',
  passwordHash: 'scrypt$salt$hash',
  firstName: 'สมชาย',
  lastName: 'ใจดี',
  address: '239 ถ.ห้วยแก้ว',
  districtId: 'CM-1',
  role: 'VOTER',
};

describe('AccountService.changeRole', () => {
  it('makes a voter a commissioner and returns the updated user without the password hash', async () => {
    // updateRole = stub (ป้อนผลลัพธ์ว่าอัปเดตสำเร็จ) และ spy (จดว่าถูกเรียกด้วยอะไร)
    const users = usersWhereUpdateRole(async (id, role) => ({ ...somchai, id, role }));
    const accounts = new AccountService(users, dummyDistricts, dummyTokens);

    const updated = await accounts.changeRole(11, 'COMMISSIONER');

    expect(users.updateRole).toHaveBeenCalledWith(11, 'COMMISSIONER');
    expect(updated).toEqual({
      id: 11,
      nationalId: '1509900000017',
      firstName: 'สมชาย',
      lastName: 'ใจดี',
      address: '239 ถ.ห้วยแก้ว',
      districtId: 'CM-1',
      role: 'COMMISSIONER',
    });
  });
});
