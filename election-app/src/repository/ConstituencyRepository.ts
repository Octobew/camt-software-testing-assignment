import { prisma } from '../lib/prisma'


export async function createConstituency(
    consituencynumber: number,
    districtCode: string,
    subdistrictCodes: string[],
    provinceCode: string,
    zipcode: string,

) {
    if (subdistrictCodes.length === 0) {
        throw new Error('กรุณาเลือกรหัสตำบลอย่างน้อย 1 รายการ')
    }

    const uniqueSubdistrictCodes = [...new Set(subdistrictCodes)]

    if (uniqueSubdistrictCodes.length !== subdistrictCodes.length) {
        throw new Error('พบรหัสตำบลซ้ำในรายการที่เลือก')
    }

    const subdistricts = await prisma.subdistrict.findMany({
        where: {
            code: { in: uniqueSubdistrictCodes },
            provinceCode,
            districtCode,
        },
        select: { code: true },
    })

    if (subdistricts.length !== uniqueSubdistrictCodes.length) {
        throw new Error('มีรหัสตำบลที่ไม่อยู่ในจังหวัดหรืออำเภอที่เลือก')
    }

    return prisma.consituency.create({
        data: {
            provinceCode,
            districtCode,
            consituencynumber,
            zipcode,
            isclosed: false,
            subdistricts: {
                create: uniqueSubdistrictCodes.map((subdistrictCode) => ({ subdistrictCode })),
            },
        },
        include: constituencyInclude,
    });
}

const constituencyInclude = {
    province: true,
    district: true,
    subdistricts: {
        include: {
            subdistrict: true,
        },
        orderBy: {
            subdistrictCode: 'asc' as const,
        },
    },
} as const

// อ่าน AllConstitutency
export async function getAllConstituencies() {
    return prisma.consituency.findMany({
        include: constituencyInclude,
        orderBy: [
            { provinceCode: `asc` },
            { consituencynumber: `asc` },
        ],
    })
}

// อ่านแต่ id contitutency

export async function getConstituencyById(id: number) {
    return prisma.consituency.findUnique({
        where: { id },
        include: constituencyInclude,
    })
}

// ค้นกา และ Filter ตอนลงทะเบียน

export async function searchConstituencies(params: {
    provinceCode?: string
    districtCode?: string
    subdistrictCode?: string
    consituencynumber?: number
}) {
    const where: any = {}

    if (params.provinceCode) where.provinceCode = params.provinceCode
    if (params.districtCode) where.districtCode = params.districtCode
    if (params.subdistrictCode) {
        where.subdistricts = {
            some: {
                subdistrictCode: params.subdistrictCode,
            },
        }
    }
    if (typeof params.consituencynumber === 'number') where.consituencynumber = params.consituencynumber

    return prisma.consituency.findMany({
        where,
        include: constituencyInclude,
        orderBy: [
            { provinceCode: `asc` },
            { consituencynumber: `asc` }],
    })
}

export async function deleteConstituency(id: number) {
    return prisma.consituency.delete({
        where: {
            id: id,
        },
    });
}

export async function openConstituencyElection(id: number) {
    return prisma.consituency.update({
        where: {
            id: id,
        },
        data: {
            isclosed: false,
        },
    });
}

export async function closeConstituencyElection(id: number) {
    return prisma.consituency.update({
        where: {
            id: id,
        },
        data: {
            isclosed: true,
        },
    });
}


export async function openConstituencyElectionAll() {
    return prisma.consituency.updateMany({
        data: {
            isclosed: false,
        },
    });
}

export async function closeConstituencyElectionAll() {
    return prisma.consituency.updateMany({
        data: {
            isclosed: true,
        },
    });
}
