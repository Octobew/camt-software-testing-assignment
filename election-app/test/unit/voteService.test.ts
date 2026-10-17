// Unit tests for voteService: no database. Prisma and the vote repository are replaced
// with jest.fn() through jest.mock, because VoteServices imports them directly (the module is the seam).
import { faker } from '@faker-js/faker';
import type { candidate, consituency, electionsetting, vote } from '../../src/generated/prisma/client';

jest.mock('../../src/lib/prisma', () => ({
  prisma: { electionsetting: { findFirst: jest.fn() } },
}));
jest.mock('../../src/repository/voteRepository', () => ({
  upsetVote: jest.fn(),
  consituencyByID: jest.fn(),
  candidateByID: jest.fn(),
  findVoteByUserId: jest.fn(),
  countVotesByCandidateId: jest.fn(),
  totalVotes_all: jest.fn(),
}));

import { prisma } from '../../src/lib/prisma';
import * as voteRepo from '../../src/repository/voteRepository';
import { voteService } from '../../src/services/VoteServices';

const findElectionSetting = prisma.electionsetting.findFirst as unknown as jest.Mock;
const consituencyByID = jest.mocked(voteRepo.consituencyByID);
const candidateByID = jest.mocked(voteRepo.candidateByID);
const upsetVote = jest.mocked(voteRepo.upsetVote);

// ค่าที่ test ไม่สนใจให้ faker สุ่ม ค่าที่ test สนใจส่งเข้ามาเอง
function anElectionSetting(isopen: boolean): electionsetting {
  return {
    id: 1,
    electionname: 'เลือกตั้ง ส.ส. 2569',
    startdate: faker.date.recent(),
    enddate: faker.date.soon(),
    starttime: '08:00',
    endtime: '17:00',
    isopen,
    updatedAt: faker.date.recent(),
  };
}

function aConstituency(id: number, isclosed: boolean): consituency {
  return {
    id,
    provinceCode: '50',
    districtCode: '5001',
    consituencynumber: faker.number.int({ min: 1, max: 10 }),
    zipcode: '50200',
    isclosed,
  };
}

function aCandidate(id: number, consituencyId: number): candidate {
  return {
    id,
    candidatenumber: faker.number.int({ min: 1, max: 20 }),
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    imageurl: null,
    policy: null,
    consituencyId,
    consituencyprovince: 'เชียงใหม่',
    partyId: faker.number.int({ min: 1, max: 50 }),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  };
}

function aVote(usersId: number, candidateId: number): vote {
  return { id: faker.number.int({ min: 1, max: 1000 }), usersId, candidateId, createdAt: new Date(), updatedAt: new Date() };
}

// Stub: ป้อน input ทางอ้อมให้ voteService ว่าตอนนี้เลือกตั้งเปิดไหม เขตปิดหีบหรือยัง ผู้สมัครอยู่เขตไหน
function given({
  setting = anElectionSetting(true),
  constituency = aConstituency(1, false),
  candidateInDb = aCandidate(7, 1),
}: {
  setting?: electionsetting | null;
  constituency?: consituency | null;
  candidateInDb?: candidate | null;
} = {}) {
  findElectionSetting.mockResolvedValue(setting);
  consituencyByID.mockResolvedValue(constituency);
  candidateByID.mockResolvedValue(candidateInDb);
  upsetVote.mockImplementation(async (userId, candidateId) => aVote(userId, candidateId));
}

beforeEach(() => {
  faker.seed(20261017);
});

describe('voteService', () => {
  it('TC-V01 saves the vote when the election is open, the constituency is open and the candidate is in it', async () => {
    given();

    const saved = await voteService({ userId: 42, consituencyId: 1, candidateId: 7 });

    // Spy: upsetVote จดไว้ว่าถูกเรียกด้วยอะไร แล้วค่อยตรวจหลัง Act
    expect(upsetVote).toHaveBeenCalledTimes(1);
    expect(upsetVote).toHaveBeenCalledWith(42, 7);
    expect(saved).toMatchObject({ usersId: 42, candidateId: 7 });
  });

  describe('refuses and saves nothing', () => {
    // Mock: ทุก test ในกลุ่มนี้ตั้งความคาดหวังว่า upsetVote ต้องไม่ถูกเรียกเลย
    afterEach(() => {
      expect(upsetVote).not.toHaveBeenCalled();
    });

    it('TC-V02 when the election is closed', async () => {
      given({ setting: anElectionSetting(false) });

      const result = voteService({ userId: 42, consituencyId: 1, candidateId: 7 });

      await expect(result).rejects.toThrow('ยังไม่อยู่ในช่วงเวลาการเลือกตั้ง');
    });

    it('TC-V03 when the constituency has closed its poll', async () => {
      given({ constituency: aConstituency(1, true) });

      const result = voteService({ userId: 42, consituencyId: 1, candidateId: 7 });

      await expect(result).rejects.toThrow('ปิดหีบลงคะแนนแล้ว');
    });

    it('TC-V04 when the candidate belongs to another constituency', async () => {
      given({ candidateInDb: aCandidate(7, 2) });

      const result = voteService({ userId: 42, consituencyId: 1, candidateId: 7 });

      await expect(result).rejects.toThrow('นอกเขตเลือกตั้งของคุณ');
    });

    it('TC-V05 when the candidate does not exist', async () => {
      given({ candidateInDb: null });

      const result = voteService({ userId: 42, consituencyId: 1, candidateId: 999 });

      await expect(result).rejects.toThrow();
    });

    it('TC-V06 when the constituency does not exist', async () => {
      // ผู้สมัครอยู่เขต 999 ตรงกับที่ขอ เพื่อให้เหลือแค่เงื่อนไข "หาเขตไม่เจอ" ข้อเดียว
      given({ constituency: null, candidateInDb: aCandidate(7, 999) });

      const result = voteService({ userId: 42, consituencyId: 999, candidateId: 7 });

      await expect(result).rejects.toThrow();
    });

    it('TC-V07 when no election has been set up', async () => {
      given({ setting: null });

      const result = voteService({ userId: 42, consituencyId: 1, candidateId: 7 });

      await expect(result).rejects.toThrow();
    });
  });

  it('TC-V08 saves exactly the voter and candidate it was given (faker-generated ids)', async () => {
    const userId = faker.number.int({ min: 1, max: 100_000 });
    const constituencyId = faker.number.int({ min: 1, max: 400 });
    const candidateId = faker.number.int({ min: 1, max: 5_000 });
    given({ constituency: aConstituency(constituencyId, false), candidateInDb: aCandidate(candidateId, constituencyId) });

    await voteService({ userId, consituencyId: constituencyId, candidateId });

    expect(consituencyByID).toHaveBeenCalledWith(constituencyId);
    expect(candidateByID).toHaveBeenCalledWith(candidateId);
    expect(upsetVote).toHaveBeenCalledWith(userId, candidateId);
  });
});
