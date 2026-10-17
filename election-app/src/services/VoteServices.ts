import {prisma} from '../lib/prisma'
import {VoteRequest} from '../models/VoteRequest';
import * as authVost from '../repository/voteRepository';

// Vote service functions and business logic for handling vote-related operations

export async function voteService(requestVote: VoteRequest) {
    const {userId, consituencyId, candidateId } = requestVote;

    const setting = await prisma.electionsetting.findFirst();
        if (setting && !setting.isopen) {
            throw new Error("ขณะนี้ยังไม่อยู่ในช่วงเวลาการเลือกตั้ง ไม่สามารถลงคะแนนได้");
        }

    const constituency = await authVost.consituencyByID(consituencyId);

        if (constituency && constituency.isclosed) {
            throw new Error("เขตเลือกตั้งของคุณปิดหีบลงคะแนนแล้ว ไม่สามารถแก้ไขหรือลงคะแนนได้");
        }

    const candidate = await authVost.candidateByID(candidateId);

        if (candidate && candidate.consituencyId !== consituencyId) {
            throw new Error("คุณไม่สามารถโหวตให้ผู้สมัครนอกเขตเลือกตั้งของคุณได้");
        }

    return await authVost.upsetVote(userId,candidateId);

}

export async function findVoteByUserId(userId: number){
    return authVost.findVoteByUserId(userId);
}

export async function countVotesByCandidateId(candidateId: number){
    return authVost.countVotesByCandidateId(candidateId);
}

export async function totalVotes_all(): Promise<number> {
    return authVost.totalVotes_all();
}