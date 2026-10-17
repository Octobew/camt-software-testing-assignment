import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

type SeedProvince = {
  code: string
  nameTh: string
  nameEn: string
  isActive: boolean
}

type SeedSubdistrict = {
  code: string
  nameTh: string
  nameEn: string
  zipcode: string
  isActive: boolean
  provinceCode: string
  districtCode: string
}

type SeedDistrict = {
  code: string
  nameTh: string
  nameEn: string
  isActive: boolean
  provinceCode: string
  subdistricts: SeedSubdistrict[]
}

type SeedLocation = {
  region: string
  province: SeedProvince
  districts: SeedDistrict[]
}

const representativeLocations: SeedLocation[] = [
  {
    region: "north",
    province: {
      code: "50",
      nameTh: "เชียงใหม่",
      nameEn: "Chiang Mai",
      isActive: true,
    },
    districts: [
      {
        code: "5001",
        nameTh: "เมืองเชียงใหม่",
        nameEn: "Mueang Chiang Mai",
        isActive: true,
        provinceCode: "50",
        subdistricts: [
          {
            code: "500101",
            nameTh: "สุเทพ",
            nameEn: "Suthep",
            zipcode: "50200",
            isActive: true,
            provinceCode: "50",
            districtCode: "5001",
          },
          {
            code: "500107",
            nameTh: "ศรีภูมิ",
            nameEn: "Si Phum",
            zipcode: "50200",
            isActive: true,
            provinceCode: "50",
            districtCode: "5001",
          },
        ],
      },
      {
        code: "5007",
        nameTh: "แม่ริม",
        nameEn: "Mae Rim",
        isActive: true,
        provinceCode: "50",
        subdistricts: [
          {
            code: "500701",
            nameTh: "ริมใต้",
            nameEn: "Rim Tai",
            zipcode: "50180",
            isActive: true,
            provinceCode: "50",
            districtCode: "5007",
          },
          {
            code: "500703",
            nameTh: "แม่สา",
            nameEn: "Mae Sa",
            zipcode: "50180",
            isActive: true,
            provinceCode: "50",
            districtCode: "5007",
          },
        ],
      },
    ],
  },
  {
    region: "central",
    province: {
      code: "10",
      nameTh: "กรุงเทพมหานคร",
      nameEn: "Bangkok",
      isActive: true,
    },
    districts: [
      {
        code: "1007",
        nameTh: "ปทุมวัน",
        nameEn: "Pathum Wan",
        isActive: true,
        provinceCode: "10",
        subdistricts: [
          {
            code: "100701",
            nameTh: "รองเมือง",
            nameEn: "Rong Mueang",
            zipcode: "10330",
            isActive: true,
            provinceCode: "10",
            districtCode: "1007",
          },
          {
            code: "100703",
            nameTh: "วังใหม่",
            nameEn: "Wang Mai",
            zipcode: "10330",
            isActive: true,
            provinceCode: "10",
            districtCode: "1007",
          },
        ],
      },
      {
        code: "1004",
        nameTh: "บางรัก",
        nameEn: "Bang Rak",
        isActive: true,
        provinceCode: "10",
        subdistricts: [
          {
            code: "100401",
            nameTh: "สีลม",
            nameEn: "Si Lom",
            zipcode: "10500",
            isActive: true,
            provinceCode: "10",
            districtCode: "1004",
          },
          {
            code: "100402",
            nameTh: "สุริยวงศ์",
            nameEn: "Suriyawong",
            zipcode: "10500",
            isActive: true,
            provinceCode: "10",
            districtCode: "1004",
          },
        ],
      },
    ],
  },
  {
    region: "northeast",
    province: {
      code: "40",
      nameTh: "ขอนแก่น",
      nameEn: "Khon Kaen",
      isActive: true,
    },
    districts: [
      {
        code: "4001",
        nameTh: "เมืองขอนแก่น",
        nameEn: "Mueang Khon Kaen",
        isActive: true,
        provinceCode: "40",
        subdistricts: [
          {
            code: "400101",
            nameTh: "ในเมือง",
            nameEn: "Nai Mueang",
            zipcode: "40000",
            isActive: true,
            provinceCode: "40",
            districtCode: "4001",
          },
          {
            code: "400113",
            nameTh: "ศิลา",
            nameEn: "Sila",
            zipcode: "40000",
            isActive: true,
            provinceCode: "40",
            districtCode: "4001",
          },
        ],
      },
      {
        code: "4010",
        nameTh: "บ้านไผ่",
        nameEn: "Ban Phai",
        isActive: true,
        provinceCode: "40",
        subdistricts: [
          {
            code: "401001",
            nameTh: "ในเมือง",
            nameEn: "Nai Mueang Ban Phai",
            zipcode: "40110",
            isActive: true,
            provinceCode: "40",
            districtCode: "4010",
          },
          {
            code: "401002",
            nameTh: "เมืองเพีย",
            nameEn: "Mueang Phia",
            zipcode: "40110",
            isActive: true,
            provinceCode: "40",
            districtCode: "4010",
          },
        ],
      },
    ],
  },
  {
    region: "south",
    province: {
      code: "90",
      nameTh: "สงขลา",
      nameEn: "Songkhla",
      isActive: true,
    },
    districts: [
      {
        code: "9011",
        nameTh: "หาดใหญ่",
        nameEn: "Hat Yai",
        isActive: true,
        provinceCode: "90",
        subdistricts: [
          {
            code: "901101",
            nameTh: "คอหงส์",
            nameEn: "Kho Hong",
            zipcode: "90110",
            isActive: true,
            provinceCode: "90",
            districtCode: "9011",
          },
          {
            code: "901102",
            nameTh: "หาดใหญ่",
            nameEn: "Hat Yai",
            zipcode: "90110",
            isActive: true,
            provinceCode: "90",
            districtCode: "9011",
          },
        ],
      },
      {
        code: "9001",
        nameTh: "เมืองสงขลา",
        nameEn: "Mueang Songkhla",
        isActive: true,
        provinceCode: "90",
        subdistricts: [
          {
            code: "900101",
            nameTh: "บ่อยาง",
            nameEn: "Bo Yang",
            zipcode: "90000",
            isActive: true,
            provinceCode: "90",
            districtCode: "9001",
          },
          {
            code: "900108",
            nameTh: "พะวง",
            nameEn: "Phawong",
            zipcode: "90100",
            isActive: true,
            provinceCode: "90",
            districtCode: "9001",
          },
        ],
      },
    ],
  },
];

async function main() {
  console.log('Start seeding constituencies...')

  await prisma.vote.deleteMany()
  await prisma.role.deleteMany()
  await prisma.users.deleteMany()
  await prisma.candidate.deleteMany()
  await prisma.party.deleteMany()
  await prisma.consituency.deleteMany()

  await prisma.subdistrict.deleteMany()
  await prisma.district.deleteMany()
  await prisma.province.deleteMany()

  await prisma.electionsetting.deleteMany()

  console.log('Cleared existing data')
  console.log('Start seeding locations...')

  const districts = representativeLocations.flatMap((location) => location.districts)
  const subdistricts = districts.flatMap((district) => district.subdistricts)

  await prisma.province.createMany({
    data: representativeLocations.map((location) => location.province),
  })

  await prisma.district.createMany({
    data: districts.map(({ subdistricts: _subdistricts, ...district }) => district),
  })

  await prisma.subdistrict.createMany({
    data: subdistricts,
  })

  const chiangMaiLocation = representativeLocations.find(
    (location) => location.region === "north"
  )

  if (!chiangMaiLocation) {
    throw new Error("Chiang Mai seed location is missing")
  }

  const chiangMaiDistrict = chiangMaiLocation.districts[0]
  const chiangMaiSubdistrict = chiangMaiDistrict?.subdistricts[0]

  if (!chiangMaiDistrict || !chiangMaiSubdistrict) {
    throw new Error("Chiang Mai district seed is incomplete")
  }

  console.log('Created Locations')

  await prisma.electionsetting.create({
    data: {
      electionname: "การเลือกตั้งทั่วไป 2026",
      startdate: new Date('2026-01-24T08:00:00Z'),
      enddate: new Date('2026-01-24T17:00:00Z'),
      starttime: "08:00",
      endtime: "17:00",
      isopen: true // เปิดระบบ
    }
  })
  console.log('Created Election Settings')

  // // const bkk1 = await prisma.consituency.create({
  // //   data: { province: 'กรุงเทพมหานคร', consituencynumber: 1, district: 'บางรัก', subdistrict: 'สี่พระยา', zipcode: '10500', isclosed: false }
  // // })
  // // const bkk2 = await prisma.consituency.create({
  // //   data: { province: 'กรุงเทพมหานคร', consituencynumber: 2, district: 'ปทุมวัน', subdistrict: 'รองเมือง', zipcode: '10330', isclosed: false }
  // // })
  // const cm1 = await prisma.consituency.create({
  //   data: { province: 'เชียงใหม่', consituencynumber: 1, district: 'เมืองเชียงใหม่', subdistrict: 'สุเทพ', zipcode: '50200', isclosed: false }
  // })
  // console.log('Created Constituencies')

  //สรา้งเขต
  const cm1 = await prisma.consituency.create({
    data: {
      provinceCode: chiangMaiLocation.province.code,
      districtCode: chiangMaiDistrict.code,
      consituencynumber: 1,
      zipcode: chiangMaiSubdistrict.zipcode ?? "50200",
      isclosed: false,
      subdistricts: {
        create: chiangMaiDistrict.subdistricts.map((subdistrict) => ({
          subdistrictCode: subdistrict.code,
        })),
      },
    },
  })

  //สร้างพรรค
  const partyA = await prisma.party.create({
    data: {
      name: "พรรคก้าวไกล",
      imageurl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Move_Forward_Party_Logo.svg/1200px-Move_Forward_Party_Logo.svg.png",
      policy: "นโยบาย: สวัสดิการถ้วนหน้า, กระจายอำนาจ, ปฏิรูประบบราชการ"
    }
  })
  const partyB = await prisma.party.create({
    data: {
      name: "พรรคเพื่อไทย",
      imageurl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Pheu_Thai_Party_Logo.svg/1200px-Pheu_Thai_Party_Logo.svg.png",
      policy: "นโยบาย: กระตุ้นเศรษฐกิจ, Digital Wallet, ค่าแรงขั้นต่ำ 600 บาท"
    }
  })
  const partyC = await prisma.party.create({
    data: {
      name: "พรรคภูมิใจไทย",
      imageurl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Bhumjaithai_Party_Logo.svg/1200px-Bhumjaithai_Party_Logo.svg.png",
      policy: "นโยบาย: พักหนี้ 3 ปี, โซลาร์รูฟฟรี, ลดค่าไฟ"
    }
  })

  console.log('reated Parties')

  //สร้างผู้สมัคร

  const cmProvince = await prisma.province.findUnique({ where: { code: chiangMaiLocation.province.code } })
  await prisma.candidate.create({
    data: {
      candidatenumber: 1,
      firstname: "เหนือ",
      lastname: "ชายดอย",
      imageurl: "https://ui-avatars.com/api/?name=Nuea&background=random",
      policy: "แก้ปัญหาฝุ่น PM 2.5 อย่างยั่งยืน",
      consituencyId: cm1.id,
      consituencyprovince: cmProvince?.nameTh ?? "เชียงใหม่",
      partyId: partyA.id,
    },
  })
  // await prisma.candidate.create({
  //   data: {
  //     candidatenumber: 1, firstname: "สมชาย", lastname: "รักชาติ",
  //     imageurl: "https://ui-avatars.com/api/?name=Somchai&background=random",
  //     policy: "มุ่งมั่นพัฒนาเขตบางรักให้น่าอยู่",
  //     consituencyId: bkk1.id, consituencyprovince: bkk1.province, partyId: partyA.id
  //   }
  // })
  // await prisma.candidate.create({
  //   data: {
  //     candidatenumber: 2, firstname: "วิภา", lastname: "ใจดี",
  //     imageurl: "https://ui-avatars.com/api/?name=Wipa&background=random",
  //     policy: "เน้นเศรษฐกิจชุมชนและการท่องเที่ยว",
  //     consituencyId: bkk1.id, consituencyprovince: bkk1.province, partyId: partyB.id
  //   }
  // })

  // เขต 1 เชียงใหม่
  // await prisma.candidate.create({
  //   data: {
  //     candidatenumber: 1, firstname: "เหนือ", lastname: "ชายดอย",
  //     imageurl: "https://ui-avatars.com/api/?name=Nuea&background=random",
  //     policy: "แก้ปัญหาฝุ่น PM 2.5 อย่างยั่งยืน",
  //     consituencyId: cm1.id, consituencyprovince: cm1.province, partyId: partyA.id
  //   }
  // })

  console.log('Created Candidates')
  const passwordHash = bcrypt.hashSync('123456', 10); // รหัสผ่าน default: 123456

  // 6.1 User with 1 Role (VOTER) - ประชาชนทั่วไป
  // await prisma.users.create({
  //   data: {
  //     nationalId: "1111111111111",
  //     firstname: "สมศักดิ์", lastname: "พลเมือง",
  //     password: passwordHash,
  //     address: "123 ถ.สีลม", district: "บางรัก", subdistrict: "สี่พระยา", province: "กรุงเทพมหานคร",
  //     consituencyID: bkk1.id,
  //     role: { create: { roleName: 'ROLE_VOTER' } }
  //   }
  // })

  // 6.2 User with 1 Role (ADMIN) - ผู้ดูแลระบบ
  // await prisma.users.create({
  //   data: {
  //     nationalId: "2222222222222",
  //     firstname: "Admin", lastname: "System",
  //     password: passwordHash,
  //     address: "Server Room", district: "ปทุมวัน", subdistrict: "รองเมือง", province: "กรุงเทพมหานคร",
  //     consituencyID: bkk2.id, // Admin อาจจะผูกหรือไม่ผูกเขตก็ได้ แต่ใส่ไว้กัน Null
  //     role: { create: { roleName: 'ROLE_ADMIN' } }
  //   }
  // })

  // 6.3 User with 2 Roles (ECT + VOTER) - กกต. ที่มีสิทธิ์เลือกตั้งด้วย
  await prisma.users.create({
    data: {
      nationalId: "3333333333333",
      firstname: "กรรมการ", lastname: "เที่ยงธรรม",
      password: passwordHash,
      address: "สำนักงาน กกต.", district: chiangMaiDistrict.nameTh, subdistrict: chiangMaiSubdistrict.nameTh, province: chiangMaiLocation.province.nameTh,
      consituencyID: cm1.id,
      role: {
        create: [
          { roleName: 'ROLE_ECT' },
          { roleName: 'ROLE_VOTER' }
        ]
      }
    }
  })

  // 6.4 User with 3 Roles (ADMIN + ECT + VOTER) - Super User
  // await prisma.users.create({
  //   data: {
  //     nationalId: "4444444444444",
  //     firstname: "Super", lastname: "User",
  //     password: passwordHash,
  //     address: "Cloud", district: "บางรัก", subdistrict: "สี่พระยา", province: "กรุงเทพมหานคร",
  //     consituencyID: bkk1.id,
  //     role: {
  //       create: [
  //         { roleName: 'ROLE_ADMIN' },
  //         { roleName: 'ROLE_ECT' },
  //         { roleName: 'ROLE_VOTER' }
  //       ]
  //     }
  //   }
  // })

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })