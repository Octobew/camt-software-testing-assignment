import { prisma } from "../lib/prisma";
export async function createCandidate(
    candidatenumber: number,
    firstname: string,
    lastname: string,
    imageurl: string | undefined,
    policy: string | undefined,
    consituencyId: number,
    consituencyprovince: string,
    partyId: number
) {
    return prisma.candidate.create({
        data: {
            candidatenumber,
            firstname,
            lastname,
            imageurl,
            policy,
            consituencyId,
            consituencyprovince,
            partyId,
        }
    })
}

export async function getAllCandidates(consituencyId?: number) {
    const where: any = {}
    if (typeof consituencyId === 'number') {
        where.consituencyId = consituencyId
    }

    return prisma.candidate.findMany({
        where,
        orderBy: [
            { consituencyId: 'asc' },
            { candidatenumber: 'asc' }
        ],
        include: {
            party: true,
            consituency: true
        }
    })
}

export async function getCandidateById(id: number) {
    return prisma.candidate.findUnique({
        where: { id },
        include: {
            party: true,
            consituency: true
        }
    })
}

export async function updateCandidate(
    id: number,
    data: any
) {
    return prisma.candidate.update({
        where: { id },
        data
    })
}

export async function deleteCandidate(id: number) {
    return prisma.candidate.delete({
        where: { id }
    })
}

