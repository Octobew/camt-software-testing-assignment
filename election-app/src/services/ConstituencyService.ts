import { ConstituencyRequest } from '../models/ConstituencyRequest';
import * as authRepo from '../repository/ConstituencyRepository';

type ConstituencyWithRelations = Awaited<ReturnType<typeof authRepo.getConstituencyById>>
type CreatedConstituency = Awaited<ReturnType<typeof authRepo.createConstituency>>
type ConstituencyItem = NonNullable<ConstituencyWithRelations | CreatedConstituency>

function formatConstituency(constituency: ConstituencyItem) {
    const subdistricts = constituency.subdistricts.map((item) => ({
        code: item.subdistrict.code,
        nameTh: item.subdistrict.nameTh,
        nameEn: item.subdistrict.nameEn,
        zipcode: item.subdistrict.zipcode,
        provinceCode: item.subdistrict.provinceCode,
        districtCode: item.subdistrict.districtCode,
    }))

    return {
        id: constituency.id,
        provinceCode: constituency.provinceCode,
        provinceNameTh: constituency.province.nameTh,
        provinceNameEn: constituency.province.nameEn,
        districtCode: constituency.districtCode,
        districtNameTh: constituency.district.nameTh,
        districtNameEn: constituency.district.nameEn,
        consituencynumber: constituency.consituencynumber,
        zipcode: constituency.zipcode,
        isclosed: constituency.isclosed,
        subdistrictCodes: subdistricts.map((item) => item.code),
        subdistrictNames: subdistricts.map((item) => item.nameTh),
        subdistricts,
    }
}


// Constituency service functions and business logic for handling constituency-related operations
export async function createConstituency(requestConstituency: ConstituencyRequest) {
    const {
        provinceCode,
        districtCode,
        subdistrictCode,
        subdistrictCodes,
        consituencynumber,
        zipcode, } = requestConstituency;

    const normalizedSubdistrictCodes = subdistrictCodes?.length
        ? subdistrictCodes
        : subdistrictCode
            ? [subdistrictCode]
            : [];

    const constituency = await authRepo.createConstituency(
        consituencynumber,
        districtCode,
        normalizedSubdistrictCodes,
        provinceCode,
        zipcode,
    );

    return formatConstituency(constituency)
}

export async function getAllConstituencies() {
    const constituencies = await authRepo.getAllConstituencies()
    return constituencies.map(formatConstituency)
}

export async function getConstituencyById(id: number) {
    const constituency = await authRepo.getConstituencyById(id)
    return constituency ? formatConstituency(constituency) : null
}

export async function searchConstituencies(query: any) {
    const params = {
        provinceCode: query.provinceCode ? String(query.provinceCode) : query.province ? String(query.province) : undefined,
        districtCode: query.districtCode ? String(query.districtCode) : query.district ? String(query.district) : undefined,
        subdistrictCode: query.subdistrictCode ? String(query.subdistrictCode) : query.subdistrict ? String(query.subdistrict) : undefined,
        consituencynumber: query.consituencynumber ? Number(query.consituencynumber) : undefined,
    }
    const constituencies = await authRepo.searchConstituencies(params)
    return constituencies.map(formatConstituency)
}

export async function deleteConstituency(id: number) {
    return authRepo.deleteConstituency(id);
}  

export async function openConstituencyElection(id: number) {
    return authRepo.openConstituencyElection(id);
}

export async function closeConstituencyElection(id: number) {
    return authRepo.closeConstituencyElection(id);
}

export async function openConstituencyElectionAll() {
    return authRepo.openConstituencyElectionAll();
}

export async function closeConstituencyElectionAll() {
    return authRepo.closeConstituencyElectionAll();
}