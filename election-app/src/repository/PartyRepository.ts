import { prisma } from '../lib/prisma';


export async function createParty(
  name: string,
  imageurl?: string,
  policy?: string
) {
  return prisma.party.create({
    data: {
      name: name,
      imageurl: imageurl,
      policy: policy,
    },
  });
}

export async function getAllParties() {
  return prisma.party.findMany({
    orderBy: {
      id: 'asc',
    },
  });
}

export async function getPartyById(id: number) {
  return prisma.party.findUnique({
    where: { id },
  });
}

export async function updateParty(
  id: number,
  name: string,
  imageurl?: string,
  policy?: string
) {
  return prisma.party.update({
    where: { id },
    data: {
      name: name,
      imageurl: imageurl,
      policy: policy,
    },
  });
}

export async function deleteParty(id: number) {
  return prisma.party.delete({
    where: { id },
  });
}


export async function countCandidatesByPartyId(id: number) {
  return prisma.candidate.count({
    where: { partyId: id },
  });
}

