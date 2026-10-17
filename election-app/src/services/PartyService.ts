import { PartyRequest } from '../models/PartyRequest';

import * as partyRepo from '../repository/PartyRepository'; 

// TODO: validate name (required + trim)
// TODO: call partyRepo.createParty(...)
export async function createParty(request: PartyRequest) {
    const name = request.name?.trim();
    if (!name) {
        throw new Error('ต้องระบุชื่อพรรคการเมือง');
    }
    return await partyRepo.createParty(
        name,
        request.imageurl,
        request.policy
    ); 
}

// TODO: call partyRepo.getAllParties()
export async function getAllParties() {
  return await partyRepo.getAllParties();
}

// TODO: call partyRepo.getPartyById(id)
export async function getPartyById(id: number) {
    return await partyRepo.getPartyById(id);
}

  // TODO: validate name (ถ้าส่งมาให้แก้)
  // TODO: call partyRepo.updateParty(...)
export async function updateParty(id: number, request: PartyRequest) {
  const name = request.name?.trim();
  if (!name) {
    throw new Error('ต้องระบุชื่อพรรคการเมือง');
  }
  return await partyRepo.updateParty(
    id,
    name,
    request.imageurl,
    request.policy
  );
}

 // TODO: เช็คว่ามี candidate ผูกอยู่ไหม (ห้ามลบถ้ามี)
  // TODO: call partyRepo.deleteParty(id)
export async function deleteParty(id: number) {
    const count = await partyRepo.countCandidatesByPartyId(id);
    if (count > 0) {
        throw new Error('ไม่สามารถลบพรรคการเมืองได้ เนื่องจากมีผู้สมัครรับเลือกตั้ง');
    }
    return await partyRepo.deleteParty(id);
}
