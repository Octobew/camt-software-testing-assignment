# Software Testing Assignment (15%)

**ผู้ทำ:** APISARA ARUNWONG · CMU CAMT
**อ้างอิง workshop:** [boyone/camt-software-testing](https://github.com/boyone/camt-software-testing) (3–4 ต.ค. 2026)

repo นี้มี 2 ส่วนตามโจทย์

1. **Workshop Review** — ทำ lab ของ workshop ใหม่ใน branch `jest/*` แต่ละ branch มี commit ของฉันทีละขั้นตอน
2. **Election App Unit Testing** — unit test ของระบบเลือกตั้งจากวิชา Backend (ส่วน voter ที่ฉันรับผิดชอบ) ใน branch `election/*`

## Branch

| Branch | เนื้อหา |
|---|---|
| `main` | README นี้ + ระบบอ้างอิงของ workshop (`app/`) |
| `jest/lab/00-setup` | Lab 00 — เตรียมเครื่อง, รัน test 3 ระดับ |
| `jest/lab/01-boundaries` | Lab 01 — จัด test case เข้า boundary |
| `jest/lab/02-aaa-unit` | Lab 02 — Arrange / Act / Assert และ test smells |
| `jest/solution/02-aaa-unit` | เฉลย Lab 02 ของอาจารย์ (ใช้เทียบกับงานใน `jest/lab/02-aaa-unit`) |
| `jest/solution/03-test-doubles` | Lab 03 — test doubles (แบบฝึก `changeRole` ที่ทำในห้อง) |
| `jest/solution/04-test-data` | Lab 04 — Liquibase และสร้าง seed data ด้วย faker |
| `election/original` | โค้ด Election App ที่ส่งวิชา Backend (ไม่แก้) |
| `election/vv-improved` | Election App + unit test + โค้ดที่ปรับปรุงตามหลัก V&V |

ดูเฉพาะ commit ของฉันใน branch ใดก็ได้:

```bash
git log --author=APISARA --reverse --oneline origin/jest/solution/04-test-data
```

---

## 1. เตรียมเครื่อง

| เครื่องมือ | เวอร์ชัน | ใช้กับ |
|---|---|---|
| Node.js | 24 ขึ้นไป | ทุกส่วน |
| Git | ล่าสุด | ทุกส่วน |
| Docker (Desktop / OrbStack / Colima) + Compose v2 | ล่าสุด | Part 1 ที่เป็น integration, e2e และ Liquibase |

```bash
git clone https://github.com/Octobew/camt-software-testing-assignment.git
cd camt-software-testing-assignment
git fetch --all
```

---

## 2. Part 1 — Workshop Review

### วิธีรัน

```bash
git switch jest/lab/02-aaa-unit     # เปลี่ยนเป็น branch ที่ต้องการ
cd app
npm ci
npm run doctor                      # ตรวจเครื่อง ต้องได้ ✅ READY (ต้องเปิด Docker)
npm run test:unit                   # unit test — ไม่ต้องใช้ Docker
npm run test:integration            # เปิด Postgres + Liquibase แล้วรัน component test
npm run test:e2e                    # build app เป็น container แล้วยิง HTTP ด้วย Playwright
npm run db:down                     # ปิด container ทั้งหมดเมื่อเลิกใช้
```

### แต่ละ branch ทำอะไร และใช้แนวคิดอะไร

**`jest/lab/00-setup` — เตรียมเครื่องและรู้จัก test 3 ระดับ**
- รัน `npm run doctor` ผ่าน 9/9 (screenshot อยู่ที่ `labs/00-setup/screenshots/doctor-ready.png`)
- รัน unit (~1.6 วินาที), integration (~9 วินาที), e2e (~16 วินาที) แล้วจดผลใน `labs/00-setup/NOTES.md`
- ลองแก้สูตร checksum เลขบัตรประชาชนให้ผิด: unit test ชี้ต้นเหตุได้ทันที ส่วน integration test บอกแค่ว่าได้ 400
- แนวคิด: **test ยิ่งครอบคลุมกว้าง ยิ่งช้าและหาจุดพังยาก แต่ได้ความมั่นใจว่าทั้งระบบทำงานด้วยกันได้**,
  **dependency injection** (`createApp(deps)`) ทำให้เปลี่ยน dependency เป็นตัวปลอมตอน test ได้

**`jest/lab/01-boundaries` — Test boundaries**
- จัด test case 16 ข้อของระบบเลือกตั้งเข้า Unit / Integration / Component / Contract / E2E / ไม่ใช่ automated test
- แนวคิด: เลือก **ระดับที่ต่ำที่สุดที่ยังให้ความมั่นใจพอ**, **test pyramid**, บางเรื่อง (load test, หน้าจอสวยไหม) ไม่ใช่ functional test

**`jest/lab/02-aaa-unit` — Arrange / Act / Assert**
- หา smell 5 แบบใน `lab02-smelly.test.ts`: Obscure Test, Eager Test, Assertion Roulette, Conditional Test Logic, test ที่ไม่มี assertion
- เขียนใหม่เป็น `thaiNationalId`, `passwords`, `config`, `toPublicUser` แบบ AAA ใช้ `it.each` แทน loop และ `describe` ซ้อนตามสถานการณ์
- แนวคิด: **1 test = 1 พฤติกรรม, Act ครั้งเดียว, ไม่มี logic ใน test** ชื่อ test อ่านแล้วเป็น spec;
  `loadConfig(env)` รับ env เป็น parameter จึงเป็น pure function ไม่ต้องแก้ `process.env` ที่เป็น global

**`jest/solution/03-test-doubles` — Test doubles**
- เขียน `accountServiceChangeRole.test.ts` เอง 4 ขั้น: สำเร็จ, ไม่เจอ user, ห้ามเป็น ADMIN, role ที่ไม่มีอยู่จริง
- แนวคิด: **Dummy** (ส่งให้ครบแต่ต้องไม่ถูกใช้ — throw ถ้าถูกเรียก), **Stub** (ป้อน input ทางอ้อม),
  **Spy** (จด output ทางอ้อมไว้ตรวจทีหลัง), **Mock** (ตั้งความคาดหวังว่าต้อง/ต้องไม่ถูกเรียก)
  ทั้งหมดสร้างจาก `jest.fn()` ต่างกันที่ "ใช้ทำอะไร"

**`jest/solution/04-test-data` — Test data management**
- Part A: Liquibase `update` / `rollback-count` / `tag` / `update-to-tag` / `rollback --tag`, contexts และ checksum
  - `rollback-count` ย้อนตามลำดับที่รันจริง ไม่ใช่ไฟล์ที่เพิ่งเพิ่ม
  - tag แบบ changeset ถูกย้อนไปพร้อม rollback จึงย้อนซ้ำไม่ได้ ส่วน tag จาก CLI ย้อนซ้ำได้
  - rollback ที่ context ไม่ตรงกับตอน update จะข้าม changeset ไปเงียบๆ
  - แก้ changeset ที่รันไปแล้ว → checksum ไม่ตรง ต้องเพิ่ม changeset ใหม่แทน
- Part D: เขียน `scripts/generate-user-seed.ts` สร้าง seed กรรมการด้วย `UserBuilder` + faker แล้ว apply ลง dev DB
- แนวคิด: **schema คือโค้ด** (อยู่ใน git มี version), **Fresh Fixture** แทน Shared Fixture,
  **faker แบบ seed คงที่** ข้อมูลสุ่มแต่ทำซ้ำได้

---

## 3. Part 2 — Election App Unit Testing

โค้ดมาจากงานกลุ่มวิชา Backend [sdsiriwat/online-election-project](https://github.com/sdsiriwat/online-election-project)
branch `develop` commit `a0dac61` (Express 5 + TypeScript + Prisma 7 + PostgreSQL) ทดสอบเฉพาะส่วน **voter** ที่ฉันรับผิดชอบ
key ของ Supabase ที่ฝังอยู่ใน `src/awsConfig.ts` ถูกแทนด้วย `REDACTED` ทั้งสอง branch

### วิธีรัน

unit test ไม่ต้องใช้ database และไม่ต้องตั้ง `.env`

```bash
git switch election/vv-improved
cd election-app
npm ci
npx prisma generate      # สร้าง Prisma client (ใช้แค่ type ใน test)
npm test                 # ต้องได้ Tests: 15 passed, 15 total
```

> ถ้า `npm ci` หรือ `prisma generate` ค้างตอนดาวน์โหลด engine ของ Prisma (เครือข่ายบล็อก `binaries.prisma.sh`)
> ใช้ `npm ci --ignore-scripts` แล้วรัน `PRISMA_SCHEMA_ENGINE_BINARY=/usr/bin/true npx prisma generate` แทน — ตอน generate ไม่ได้เรียกใช้ engine จริง

**ดูว่า test จับ bug ของโค้ดเดิมได้:** เอา `src` ของ `election/original` มาวางแทนชั่วคราวแล้วรัน

```bash
git checkout election/original -- src   # ใช้โค้ดเดิม
npm test                                # Tests: 5 failed, 10 passed
git checkout HEAD -- src                # คืนโค้ดที่ปรับปรุงแล้ว
```

### Unit ที่ทดสอบ

| ไฟล์ test | Unit | จำนวน |
|---|---|---|
| `test/unit/voteService.test.ts` | `voteService` — ตรวจเงื่อนไขแล้วบันทึกคะแนน | 8 |
| `test/unit/authMiddleware.test.ts` | `checkRole_voter`, `protect` | 7 |

**การออกแบบ (ข้อ 2.1)**
- **Solitary unit test** — ไม่มี database ไม่มี network ทุกอย่างที่ unit เรียกใช้แทนด้วย test double
- โค้ดเดิม `import` Prisma และ repository ตรงๆ ไม่ได้รับผ่าน parameter จึงใช้ **`jest.mock(module, factory)` เป็น seam**
- test case ของ `voteService` มาจาก **decision table** ของ 3 เงื่อนไข (เปิดเลือกตั้งไหม / เขตปิดหีบหรือยัง / ผู้สมัครอยู่เขตเดียวกันไหม)
  รวมกรณีที่หาข้อมูลไม่เจอ (`null`) ส่วน middleware ใช้ **equivalence partitioning** (เป็น voter / ไม่ใช่ / ไม่มี user, token ถูก / ผิด / ไม่มี)

### ครอบคลุมข้อ 2.3

| ข้อ | ต้องมี | อยู่ที่ |
|---|---|---|
| 2.3.1 | Happy path | TC-V01 ลงคะแนนสำเร็จ, TC-M01 voter ผ่าน middleware |
| 2.3.2 | Alternative / failure | TC-V02–V07 ปฏิเสธการลงคะแนน, TC-M02 / M04 / M05 / M07 |
| 2.3.3 | Stub | election setting, `consituencyByID`, `candidateByID` (ทุก TC-V), `getUserFromToken` (TC-M06) |
| 2.3.4 | Spy | `upsetVote` ถูกเรียกด้วย `(42, 7)` (TC-V01), `next` (TC-M01) |
| 2.3.5 | Mock | `upsetVote` **ต้องไม่ถูกเรียก** เมื่อถูกปฏิเสธ (TC-V02–V07), `next` ต้องไม่ถูกเรียก (TC-M02) |
| 2.3.6 | Faker | TC-V08 สุ่ม userId / เขต / ผู้สมัคร และข้อมูลที่ไม่สำคัญของทุก stub (seed คงที่) |

---

## 4. เปรียบเทียบ `election/original` กับ `election/vv-improved` (ข้อ 2.2)

```bash
git diff election/original election/vv-improved -- election-app/src
```

### สิ่งที่เหมือนเดิม
- โครงสร้าง `routes → services → repository → Prisma`, schema, migration และ API ทุกเส้น
- ส่วนของ admin, กกต., พรรค, ผู้สมัคร และเขตเลือกตั้ง ไม่ได้แตะ
- ข้อความ error ของกรณีที่ทำงานถูกอยู่แล้ว

### สิ่งที่เปลี่ยน และเหตุผล

| เปลี่ยนอะไร | เดิม | ใหม่ | เหตุผล | Test |
|---|---|---|---|---|
| ระบบ test | ไม่มี (`npm test` แค่พิมพ์ error) | Jest + ts-jest + faker | ต้องมีเครื่องมือก่อนจึงจะ verify ได้ | — |
| `voteService` หาผู้สมัครไม่เจอ | บันทึกคะแนนต่อ | ปฏิเสธ | **Verification** — `if (candidate && …)` ทำให้ `null` หลุดผ่านกฎของตัวเอง | TC-V05 |
| `voteService` หาเขตไม่เจอ | ปล่อยผ่าน | ปฏิเสธ | **Verification** — เหตุเดียวกัน | TC-V06 |
| `voteService` ไม่มี election setting | ถือว่าเปิด | ถือว่าปิด | **Validation** — ระบบเลือกตั้งควร fail-safe: ไม่แน่ใจต้องไม่รับคะแนน | TC-V07 |
| `checkRole_voter` ไม่มี user | crash (`TypeError`) | ตอบ 401 | **Verification** — ใช้ `user.role` ก่อนตรวจว่ามี `user` | TC-M04 |
| `protect` token ผิดหรือหมดอายุ | ไม่ตอบ request ค้าง | ตอบ 401 | **Verification** — `catch` เทียบชื่อ error ที่สะกดผิดซึ่งไม่มีวันตรง | TC-M07 |

กระบวนการที่ใช้: เขียน test ตามที่ระบบ**ควร**ทำ → รันกับโค้ดเดิมให้เห็นว่าแดง (commit แยกไว้เป็นหลักฐาน) → แก้โค้ดให้เขียว

### ข้อสังเกตที่ยังไม่ได้แก้
- route ลงคะแนนรับ `userId` และ `consituencyId` จาก request body แทนที่จะเอาจาก token → voter โหวตแทนคนอื่นได้
- ลงทะเบียนไม่ตรวจ `confirmPassword` และรูปแบบเลขบัตรประชาชน
- error ทางธุรกิจของ `voteService` กลายเป็น 500 แทน 4xx เพราะ route ไม่ได้ `catch`
- `checkRole_admin`, `checkRole_ect` มี bug แบบเดียวกับ TC-M04 (เป็นส่วนของเพื่อนในกลุ่ม)

---

## 5. ทฤษฎีการทดสอบที่ใช้

| แนวคิด | ความหมายสั้นๆ | ใช้ที่ |
|---|---|---|
| **Verification & Validation** | Verification = สร้างถูกตามที่ตั้งใจไหม, Validation = สร้างสิ่งที่ผู้ใช้ต้องการจริงไหม | ข้อ 2.2 |
| **Test pyramid / test boundaries** | unit มากสุด เร็ว ชี้จุดพังแม่น; integration / e2e น้อยกว่า ช้ากว่า แต่มั่นใจภาพรวม | Lab 00, 01 |
| **Arrange-Act-Assert** | เตรียม → ทำครั้งเดียว → ตรวจผล แยกให้เห็นชัด | ทุก test |
| **Test smells** | Obscure Test, Eager Test, Assertion Roulette, Conditional Test Logic | Lab 02 |
| **Test doubles** | Dummy, Stub, Spy, Mock, Fake แทน dependency จริงใน unit test | Lab 03, Part 2 |
| **Seam / dependency injection** | จุดที่สลับของจริงเป็นของปลอมได้ (`createApp(deps)`, `jest.mock`) | Lab 00, Part 2 |
| **Decision table / equivalence partitioning** | ได้ test case จากการรวมเงื่อนไข / แบ่งกลุ่ม input ที่ระบบปฏิบัติเหมือนกัน | Part 2 |
| **Test data builder + faker** | test บอกเฉพาะค่าที่สำคัญ ค่าอื่นสุ่มแบบ seed คงที่ ทำซ้ำได้ | Lab 04, Part 2 |
| **Fresh vs Shared Fixture** | ทุก test สร้างข้อมูลเอง ไม่พึ่ง seed ร่วมกัน | Lab 04 |
| **Database versioning** | schema อยู่ใน git, เปลี่ยนด้วย changeset ใหม่เท่านั้น (Liquibase) | Lab 04 |

## อ้างอิง

- Toby Clemson — [Testing Strategies in a Microservice Architecture](https://martinfowler.com/articles/microservice-testing/)
- Gerard Meszaros — [xUnit Test Patterns](http://xunitpatterns.com/)
- Steve Freeman & Nat Pryce — Growing Object-Oriented Software, Guided by Tests
- Michael Feathers — Working Effectively with Legacy Code
