import { prisma } from "../lib/prisma";


export function getProvinces() {
  return prisma.province.findMany({
    where: { isActive: true },
    orderBy: { nameTh: "asc" },
    select: { code: true, nameTh: true, nameEn: true },
  });
}

export function getDistrictsByProvince(provinceCode: string) {
  return prisma.district.findMany({
    where: { provinceCode, isActive: true },
    orderBy: { nameTh: "asc" },
    select: { code: true, nameTh: true, nameEn: true, provinceCode: true },
  });
}

export function getSubdistricts(provinceCode: string, districtCode: string) {
  return prisma.subdistrict.findMany({
    where: { provinceCode, districtCode, isActive: true },
    orderBy: { nameTh: "asc" },
    select: {
      code: true,
      nameTh: true,
      nameEn: true,
      zipcode: true,
      provinceCode: true,
      districtCode: true,
    },
  });
}






// export function getConsituencies(where: any) {
//   return prisma.consituency.findMany({
//     where,
//     orderBy: [{ province: "asc" }, { consituencynumber: "asc" }],
//   });
// }

// export function getConsituencyById(id: number) {
//   return prisma.consituency.findUnique({ where: { id } });
// }

