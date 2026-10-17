import { CandidateRequest } from "../models/CandidateRequest"
import * as candidateRepo from '../repository/CandidateRepository'

export async function createCandidate(request: CandidateRequest) {
    const {
        candidatenumber,
        firstname,
        lastname,
        imageurl,
        policy,
        consituencyId,
        consituencyprovince,
        partyId,
    } = request

    return await candidateRepo.createCandidate(
        candidatenumber,
        firstname,
        lastname,
        imageurl,
        policy,
        consituencyId,
        consituencyprovince,
        partyId
    )
}

export async function getAllCandidates(query: any) {

    const consituencyId = query.consituencyId
        ? Number(query.consituencyId) : undefined

    return await candidateRepo.getAllCandidates(consituencyId)
}


export async function getCandidateById(id: number) {
    return await candidateRepo.getCandidateById(id)
}

export async function updateCandidate(id: number, request: CandidateRequest) {
    return await candidateRepo.updateCandidate(id, request)
}

export async function deleteCandidate(id: number) {
    return await candidateRepo.deleteCandidate(id)
}