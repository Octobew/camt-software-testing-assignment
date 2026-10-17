import { prisma } from '../lib/prisma'
import { RoleName } from '../generated/prisma/enums';


export async function registerUser(
    nationalId: string,
    firstName: string,
    lastName: string,
    address: string,
    province: string,
    district: string,
    subdistrict: string,
    consituencyId: number,
    password: string,

) {
    return prisma.users.create({
        data: {
            nationalId: nationalId,
            firstname: firstName,
            lastname: lastName,
            password: password,
            address: address,
            subdistrict: subdistrict,
            district: district,
            province: province,

            consituency: {
                connect: { id: consituencyId }
            },

            role: {
                create: {
                    roleName: RoleName.ROLE_VOTER
                }
            }
        },
        include: {
            role: true,
        },
    });
}

export async function getAllUsers() {
    return prisma.users.findMany({
        select: {
            id: true,
            nationalId: true,
            firstname: true,
            lastname: true,
            role: {
                select: {
                    id: true,
                    roleName: true,
                },
            },
        },
    });
}

export async function findUserByNationalId(nationalId: string) {
    return prisma.users.findUnique({
        where: {
            nationalId: nationalId,
        },
        include: {
            consituency: true,
            role: true,
        },

    });
}

export async function addUserRole(userId: number, roleName: RoleName) {
    return prisma.role.create({
        data: {
            usersId: userId,
            roleName: roleName,
        },
    });

}


export async function deleteUserRole(userId: number, roleName: RoleName) {
    return prisma.role.deleteMany({
        where: {
            usersId: userId,
            roleName: roleName,
        },
    });
}

// update profile function for users to update their own profile information
export async function updateProfile(id: number, data: {
    nationalId?: string,
    firstname?: string,
    lastname?: string,
    imageurl?: string,
    address?: string,
    subdistrict?: string,
    district?: string,
    province?: string,
    consituencyID?: number,
}) {
    return prisma.users.update({
        where: { id },
        data: data
    });
}



// export async function getAllProvinces () {
//     return prisma.consituency.findMany({
//         distinct: ['provinceCode'],
//         select: { province: true },
//         orderBy: ({ province: 'asc' } as any),
//     });
    
// }

// export async function getDistrictsByProvince(province: string) {
//     return prisma.consituency.findMany({
//         where: {
//             provinceCode: province
//         },
//         distinct: ['districtCode'],
//         select: { district: true },
//         orderBy: ({ district: 'asc' } as any),
//     });
// }

// export async function getSubdistrictsByDistrict(province: string, district: string) {
//     return prisma.consituency.findMany({
//         where: {
//             provinceCode: province,
//             districtCode: district
//         },
//         distinct: ['subdistrictCode'],
//         select: { subdistrict: true },
//         orderBy: ({ subdistrict: 'asc' } as any),
//     });
// }

// export async function getConstituencyNumberByDistrict(province: string, district: string, subdistrict: string) {
//     return prisma.consituency.findFirst({
//         where: {
//             provinceCode: province,
//             districtCode: district,
//             subdistrictCode: subdistrict
//         },
//         select: { 
//             id: true,
//             consituencynumber: true 
//         },
//     });
// }
