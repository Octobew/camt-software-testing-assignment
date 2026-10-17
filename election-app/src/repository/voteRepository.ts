import {prisma} from '../lib/prisma'

// Repository functions for vote management and database interactions
export async function upsetVote(userId: number,candidateId: number){
    return prisma.vote.upsert({
        where: {
            usersId: userId
               },
        update: {
            candidateId: candidateId,
            updatedAt: new Date()
                },
        create: {
            usersId: userId,
            candidateId: candidateId
    }
    }); 
} 

export async function consituencyByID(consituencyId: number){
    return prisma.consituency.findUnique({
        where: {
            id: consituencyId
        }
    });
}

export async function candidateByID(candidateId: number){
    return prisma.candidate.findUnique({
        where: {
            id: candidateId
        }
    });
}

export async function findVoteByUserId(userId: number){
    return prisma.vote.findUnique({
        where: {
            usersId: userId
        }
    });
}


export async function countVotesByCandidateId (candidateId: number){
    return prisma.vote.groupBy({
        by: ['candidateId'],
        where: {
            candidateId: candidateId
        },
        _count: {
            candidateId: true
        }
    });
}

export async function totalVotes_all(): Promise<number> {
    return prisma.vote.count({
    });
}
