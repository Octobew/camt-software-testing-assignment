# Worksheet — ระบบเลือกตั้ง (ระบบอ้างอิง)

Boundary: **U** = Unit · **I** = Integration · **C** = Component · **K** = Contract · **E** = End-to-end · **X** = ไม่ใช่ automated functional test

| # | Test case | Boundary | เหตุผล |
|---|---|---|---|
| 1 | เลขบัตรประชาชนที่ checksum ผิด ถูกปฏิเสธตอนลงทะเบียน | U | สูตร checksum อยู่ใน `isValidThaiNationalId` เป็น pure function และ `AccountService.register` ทดสอบได้ด้วย stub repository ไม่ต้องมี DB หรือ HTTP |
| 2 | ลงทะเบียนด้วยเขตเลือกตั้งที่ไม่มีในระบบ ได้ 400 | U (+C 1 ข้อ) | กฎ "เขตต้องมีอยู่จริง" อยู่ใน `AccountService` ใช้ stub `DistrictRepository` คืน `null` แล้วคาดหวัง `ValidationError` ส่วนการแปลง `ValidationError` เป็น 400 เป็นของ error handler ตัวเดียว ทดสอบที่ C ครั้งเดียวพอ ไม่ต้องทำทุกกฎ |
| 3 | `PgUserRepository.findByNationalId` คืน user ที่ map column → field ถูกต้อง | I | ต้องการรู้ว่า SQL กับการ map `national_id` → `nationalId` ถูกกับ schema จริง ถ้า mock `pool` ก็แค่เขียนสิ่งที่เราเชื่อซ้ำอีกรอบ ต้องใช้ Postgres จริง |
| 4 | ผู้มีสิทธิเลือกตั้ง (VOTER) เรียก `POST /parties` แล้วได้ 403 | C | ต้องรู้ว่า route นี้ถูกครอบด้วย `authenticate` + `requireRole('COMMISSIONER')` จริง ซึ่งเห็นได้ผ่าน HTTP เท่านั้น ส่วน logic ของ `requireRole` เองทดสอบเป็น U ได้ |
| 5 | ผู้ใช้ลงทะเบียน → login → ลงคะแนน → เปลี่ยนคะแนน → กกต. ปิดหีบ → ผลแสดงคะแนนถูกต้อง | E | เป็น user journey ข้ามหลาย role และหลาย endpoint ต้องการความมั่นใจว่าทั้งระบบต่อกันได้ ควรมีแค่ไม่กี่เส้นแบบนี้ รายละเอียดแต่ละกฎให้ไปทดสอบที่ระดับต่ำกว่า (ตอนนี้ยังปิดหีบไม่ได้ เพราะยังไม่ได้ทำ feature นี้) |
| 6 | รหัสผ่านถูกเก็บแบบ hash ไม่ใช่ plain text | U | `hashPassword` คืนค่ารูปแบบ `scrypt$salt$hash` ที่ไม่เท่ากับรหัสเดิม และ `register` ส่ง `passwordHash` ให้ repository ตรวจได้ด้วย spy หรือ fake repository ไม่ต้องเปิด DB |
| 7 | หมายเลขผู้สมัครในเขตเดียวกันห้ามซ้ำ | U + I | `ElectionAdminService.addCandidate` เช็กเลขซ้ำก่อน (U ด้วย stub `CandidateRepository`) แต่ถ้ามี 2 request เข้ามาพร้อมกัน ด่านสุดท้ายคือ `UNIQUE (district_id, number)` ใน DB ซึ่งต้องทดสอบด้วย I |
| 8 | Liquibase changelog ทั้งหมด apply บน database เปล่าได้สำเร็จ | I | เป็นการทดสอบว่าโค้ดของเรา (changelog) คุยกับ Postgres ได้ถูก ใน repo นี้ทำทุกครั้งที่รัน `test:integration` และ CI เพราะ test DB เป็น tmpfs เริ่มจาก DB เปล่าเสมอ ไม่ต้องเขียนใน Jest |
| 9 | ก่อนปิดหีบ `GET /districts/:id/results` ไม่แสดงคะแนน | C | logic นี้ (`closed: false` และไม่ส่งจำนวนคะแนน) อยู่ใน route โดยตรง ไม่มี service ให้ทดสอบแยก จึงต้องทดสอบผ่าน HTTP ถ้าย้าย logic ไปไว้ใน service ภายหลังจะลดลงมาเป็น U ได้ |
| 10 | Frontend คาดว่า results API มี field `closed` และ `candidates[].votes` | K | เป็นข้อตกลงรูปร่างข้อมูลระหว่าง consumer (frontend) กับ provider (API) ควรใช้ consumer-driven contract test เช่น Pact ถ้ารอให้ E เจอ ก็จะรู้ช้าและไม่รู้ว่าฝั่งไหนเปลี่ยน |
| 11 | JWT ที่หมดอายุแล้ว ใช้ยืนยันตัวตนไม่ได้ | U | `JwtTokenService.verify` คืน `null` เมื่อหมดอายุ ทดสอบได้โดยสร้าง token ที่อายุสั้นแล้วเลื่อนเวลาด้วย fake timers ส่วน middleware ที่ได้ `null` แล้วโยน `UnauthorizedError` ก็เป็น U ได้เช่นกัน |
| 12 | admin เปลี่ยน role ผู้ใช้เป็น กกต. แล้วผู้ใช้นั้นสร้างพรรคได้ | C | ต้องเห็นหลายชิ้นทำงานร่วมกัน: PATCH role → role ถูกบันทึกใน DB → login ใหม่ได้ token ที่มี role ใหม่ → `POST /parties` ได้ 201 ทำผ่าน supertest + Postgres จริงได้ ไม่ต้องถึง E (ข้อสังเกต: token เดิมยังเป็น VOTER ต้อง login ใหม่) |
| 13 | ระบบรับการลงคะแนนพร้อมกัน 1,000 ครั้งในนาทีแรกหลังเปิดหีบได้ | X | เป็น non-functional (performance / load) ควรใช้ load test เช่น k6, JMeter หรือ Gatling บน environment ที่ใกล้ production แล้ววัด response time, error rate และดูว่าไม่มีคะแนนหายหรือซ้ำ |
| 14 | ผู้มีสิทธิเห็นเฉพาะผู้สมัครในเขตของตัวเอง | C | ตอนนี้ logic อยู่ใน SQL ของ `voteRoutes` (legacy) ที่ใช้ `pool` global ไม่มี seam ทดสอบได้ต่ำสุดแค่ C ถ้า refactor ให้มี repository ก็ทดสอบ query เป็น I และ logic เป็น U ได้ |
| 15 | หน้ารายละเอียดพรรคแสดงผลสวยงามบนมือถือ | X | "สวยงาม" เป็นเรื่องที่คนต้องตัดสิน ควรทำ manual / exploratory test บนอุปกรณ์จริง หรือใช้ visual regression (screenshot เทียบภาพ) ช่วยจับการเปลี่ยนแปลง และ repo นี้ไม่มี frontend |
| 16 | หลังปิดหีบแล้ว ผู้มีสิทธิเปลี่ยนคะแนนไม่ได้ | U (+C 1 ข้อ) | เป็นกฎทางธุรกิจที่ขึ้นกับเวลา ควรอยู่ใน service แล้วทดสอบด้วย fake `Clock` + stub repository แต่ตอนนี้ยังไม่ได้ทำ feature และ `voteRoutes` เรียก `new Date()` ตรงๆ ต้องสร้าง seam ก่อน แล้วค่อยมี C 1 ข้อยืนยันว่าได้ 409 |
