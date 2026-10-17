# API Documentation - Online Election Project

**Base URL:** `http://localhost:3000`

**Production URL:** `https://online-election-project.onrender.com/`

# API Documentation - Online Election Project

**Base URL:** `http://localhost:3000`

**Production URL:** `https://online-election-project.onrender.com/`

**Version:** 2.1.0

---

## 🚀 Quick Start

### 1. Test API Health
```bash
curl https://online-election-project.onrender.com/
```

### 2. Register and Login
```bash
# Register
curl -X POST https://online-election-project.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nationalId":"1234567890123","firstname":"สมชาย","lastname":"ใจดี","address":"123 ถนนสุขุมวิท","province":"กรุงเทพมหานคร","district":"คลองเตย","subdistrict":"คลองเตย","consituencyId":1,"password":"Password123!","confirmPassword":"Password123!"}'

# Login
curl -X POST https://online-election-project.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"nationalId":"1234567890123","password":"Password123!"}'
```

### 3. Use Token for Authenticated Requests
```bash
export TOKEN="your_jwt_token_here"
curl -X GET https://online-election-project.onrender.com/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 API Endpoints Summary

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| **Authentication APIs** |
| POST | `/auth/register` | ลงทะเบียนผู้ใช้งาน | ❌ | - |
| POST | `/auth/login` | เข้าสู่ระบบ | ❌ | - |
| GET | `/auth/profile` | ดูข้อมูลโปรไฟล์ | ✅ | - |
| POST | `/auth/switch-role` | สลับบทบาท | ✅ | ADMIN/ECT |
| POST | `/auth/add-role` | เพิ่มบทบาทให้ผู้ใช้ | ✅ | ADMIN |
| DELETE | `/auth/delete-role` | ลบบทบาทผู้ใช้ | ✅ | ADMIN |
| GET | `/auth/users` | ดึงรายชื่อผู้ใช้ทั้งหมด | ❌ | - |
| GET | `/auth/provinces` | ดึงรายชื่อจังหวัด (Legacy) | ❌ | - |
| GET | `/auth/districts/:province` | ดึงรายชื่ออำเภอ (Legacy) | ❌ | - |
| GET | `/auth/subdistricts/:district` | ดึงรายชื่อตำบล (Legacy) | ❌ | - |
| GET | `/auth/constituencynumbers/:subdistrict` | ดึงหมายเลขเขต (Legacy) | ❌ | - |
| **Vote APIs** |
| POST | `/vote` | ลงคะแนนเลือกตั้ง | ✅ | VOTER |
| GET | `/vote/:userId` | ดูประวัติการลงคะแนน | ✅ | - |
| GET | `/vote/count/:candidateId` | นับคะแนนเสียงตาม candidateId | ❌ | - |
| GET | `/vote/total/count` | นับคะแนนเสียงทั้งหมด | ❌ | - |
| **Party APIs** |
| POST | `/party` | สร้างพรรคการเมืองใหม่ | ❌ | - |
| GET | `/party` | ดึงรายชื่อพรรคทั้งหมด | ❌ | - |
| GET | `/party/:id` | ดึงข้อมูลพรรคตาม ID | ❌ | - |
| PUT | `/party/:id` | แก้ไขข้อมูลพรรค | ❌ | - |
| DELETE | `/party/:id` | ลบพรรค | ❌ | - |
| **Candidate APIs** |
| POST | `/candidates` | สร้างผู้สมัครใหม่ | ❌ | - |
| GET | `/candidates` | ดึงรายชื่อผู้สมัครทั้งหมด | ❌ | - |
| GET | `/candidates/:id` | ดึงข้อมูลผู้สมัครตาม ID | ❌ | - |
| PUT | `/candidates/:id` | แก้ไขข้อมูลผู้สมัคร | ❌ | - |
| DELETE | `/candidates/:id` | ลบผู้สมัคร | ❌ | - |
| **Constituency APIs** |
| GET | `/constituencies` | ดึงรายชื่อเขตเลือกตั้งทั้งหมด | ❌ | - |
| GET | `/constituencies/:id` | ดึงข้อมูลเขตเลือกตั้งตาม ID | ❌ | - |
| POST | `/constituencies` | สร้างเขตเลือกตั้งใหม่ | ❌ | - |
| DELETE | `/constituencies/:id` | ลบเขตเลือกตั้ง | ❌ | - |
| PUT | `/constituencies/open/all` | เปิดการเลือกตั้งทุกเขต | ❌ | - |
| PUT | `/constituencies/close/all` | ปิดการเลือกตั้งทุกเขต | ❌ | - |
| PUT | `/constituencies/open/:id` | เปิดการเลือกตั้งเขตเฉพาะ | ❌ | - |
| PUT | `/constituencies/close/:id` | ปิดการเลือกตั้งเขตเฉพาะ | ❌ | - |
| **Location APIs** |
| GET | `/locations/provinces` | ดึงรายชื่อจังหวัดทั้งหมด | ❌ | - |
| GET | `/locations/districts` | ดึงรายชื่ออำเภอตามจังหวัด | ❌ | - |
| GET | `/locations/subdistricts` | ดึงรายชื่อตำบลตามอำเภอ | ❌ | - |
| **Upload File APIs** |
| POST | `/uploadfile/uploads` | อัพโหลดไฟล์ | ❌ | - |
| GET | `/uploadfile/presignedUrl` | ดึง Presigned URL | ❌ | - |

---

## 📋 Table of Contents
1. [Authentication APIs](#authentication-apis)
2. [Vote APIs](#vote-apis)
3. [Party APIs](#party-apis)
4. [Candidate APIs](#candidate-apis)
5. [Constituency APIs](#constituency-apis)
6. [Location APIs](#location-apis)
7. [Upload File APIs](#upload-file-apis)

---

## 🔐 Authentication APIs

Base Path: `/auth`

### 1. ลงทะเบียนผู้ใช้งาน (Register)

**Endpoint:** `POST /auth/register`

**Description:** ลงทะเบียนผู้ใช้งานใหม่เข้าสู่ระบบ

**Authentication:** ไม่ต้องการ

**Request Body:**
```json
{
  "nationalId": "string",           // เลขบัตรประชาชน 13 หัก (required)
  "firstname": "string",            // ชื่อจริง (required)
  "lastname": "string",             // นามสกุล (required)
  "address": "string",              // ที่อยู่ (required)
  "province": "string",             // จังหวัด (required)
  "district": "string",             // อำเภอ (required)
  "subdistrict": "string",          // ตำบล (required)
  "consituencyId": "number",        // ID เขตเลือกตั้ง (required)
  "password": "string",             // รหัสผ่าน (required)
  "confirmPassword": "string"       // ยืนยันรหัสผ่าน (required)
}
```

**Response:**

Success (201):
```json
{
  "status": "success",
  "message": "User registered successfully",
  "userId": 1
}
```

Error (400 - เลขบัตรซ้ำ):
```json
{
  "status": "error",
  "message": "เลขบัตรประชาชนนี้ถูกใช้งานแล้วจ้า"
}
```

Error (500):
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

**cURL Example:**
```bash
curl -X POST https://online-election-project.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nationalId": "1234567890123",
    "firstname": "สมชาย",
    "lastname": "ใจดี",
    "address": "123 ถนนสุขุมวิท",
    "province": "กรุงเทพมหานคร",
    "district": "คลองเตย",
    "subdistrict": "คลองเตย",
    "consituencyId": 1,
    "password": "Password123!",
    "confirmPassword": "Password123!"
  }'
```

---

### 2. เข้าสู่ระบบ (Login)

**Endpoint:** `POST /auth/login`

**Description:** เข้าสู่ระบบด้วยเลขบัตรประชาชนและรหัสผ่าน

**Authentication:** ไม่ต้องการ

**Request Body:**
```json
{
  "nationalId": "string",    // เลขบัตรประชาชน 13 หลัก (required)
  "password": "string"       // รหัสผ่าน (required)
}
```

**Response:**

Success (200):
```json
{
  "status": "success",
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nationalId": "1234567890123",
    "firstname": "สมชาย",
    "lastname": "ใจดี",
    "consituencypercent": "กรุงเทพมหานคร",
    "consituencynumber": 1,
    "rolename": ["ROLE_VOTER"],
    "currentRole": "ROLE_VOTER"
  }
}
```

Error (400):
```json
{
  "status": "error",
  "message": "กรุณากรอกบัตรประชาชน"
}
```

Error (404):
```json
{
  "status": "error",
  "message": "ไม่พบผู้ใช้งานนี้ในระบบ"
}
```

Error (401):
```json
{
  "status": "error",
  "message": "รหัสผ่านไม่ถูกต้อง"
}
```

**cURL Example:**
```bash
curl -X POST https://online-election-project.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "nationalId": "1234567890123",
    "password": "Password123!"
  }'
```

---

### 3. ดูข้อมูลโปรไฟล์ (Get Profile)

**Endpoint:** `GET /auth/profile`

**Description:** ดึงข้อมูลโปรไฟล์ของผู้ใช้ที่ล็อกอินอยู่

**Authentication:** Required (Bearer Token)

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response:**

Success (200):
```json
{
  "status": "success",
  "user": {
    "id": 1,
    "nationalId": "1234567890123",
    "firstname": "สมชาย",
    "lastname": "ใจดี",
    "consituencypercent": "กรุงเทพมหานคร",
    "consituencynumber": 1,
    "rolename": ["ROLE_VOTER", "ROLE_ADMIN"],
    "currentRole": "ROLE_VOTER"
  }
}
```

Error (401):
```json
{
  "message": "You are not logged in! Please log in to get access"
}
```

**cURL Example:**
```bash
curl -X GET https://online-election-project.onrender.com/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

### 4. สลับบทบาท (Switch Role)

**Endpoint:** `POST /auth/switch-role`

**Description:** สลับบทบาทระหว่าง ROLE_VOTER, ROLE_ADMIN, ROLE_ECT

**Authentication:** Required (Bearer Token + Admin/ECT Role)

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Request Body:**
```json
{
  "newRole": "string"    // "ROLE_VOTER" | "ROLE_ADMIN" | "ROLE_ECT" (required)
}
```

**Response:**

Success (200):
```json
{
  "status": "success",
  "message": "สลับบทบาทเป็น ROLE_ADMIN สำเร็จ",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Error (403):
```json
{
  "message": "You are not authorized to perform this action"
}
```

---

### 5. ดึงรายชื่อผู้ใช้ทั้งหมด (Get All Users)

**Endpoint:** `GET /auth/users`

**Description:** ดึงรายชื่อผู้ใช้ทั้งหมดในระบบ พร้อมบทบาทของแต่ละคน (เฉพาะ Admin)

**Authentication:** ไม่ต้องการ (แนะนำให้เพิ่ม Admin role)

**Response:**

Success (200):
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "nationalId": "1234567890123",
      "firstname": "สมชาย",
      "lastname": "ใจดี",
      "role": [
        {
          "id": 1,
          "roleName": "ROLE_VOTER"
        },
        {
          "id": 2,
          "roleName": "ROLE_ADMIN"
        }
      ]
    },
    {
      "id": 3,
      "nationalId": "3333333333333",
      "firstname": "กรรฑกา",
      "lastname": "เพื่อธรรม",
      "role": [
        {
          "id": 3,
          "roleName": "ROLE_ECT"
        },
        {
          "id": 4,
          "roleName": "ROLE_VOTER"
        }
      ]
    }
  ]
}
```

---

### 6. เพิ่มบทบาทให้ผู้ใช้ (Add Role)

**Endpoint:** `POST /auth/add-role`

**Description:** เพิ่มบทบาทให้กับผู้ใช้ (เฉพาะ Admin)

**Authentication:** Required (Bearer Token + Admin Role)

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Request Body:**
```json
{
  "userid": "number",        // ID ของผู้ใช้ (required)
  "roleName": "string"       // "ROLE_VOTER" | "ROLE_ADMIN" | "ROLE_ECT" (required)
}
```

**Response:**

Success (201):
```json
{
  "status": "success",
  "message": "เพิ่มบทบาทผู้ใช้สำเร็จ",
  "data": {
    "id": 5,
    "usersId": 1,
    "roleName": "ROLE_ADMIN"
  }
}
```

Error (403):
```json
{
  "message": "You are not authorized to perform this action"
}
```

---

### 7. ลบบทบาทผู้ใช้ (Delete Role)

**Endpoint:** `DELETE /auth/delete-role`

**Description:** ลบบทบาทของผู้ใช้ (เฉพาะ Admin)

**Authentication:** Required (Bearer Token + Admin Role)

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Request Body:**
```json
{
  "userid": "number",        // ID ของผู้ใช้ (required)
  "roleName": "string"       // "ROLE_VOTER" | "ROLE_ADMIN" | "ROLE_ECT" (required)
}
```

**Response:**

Success (200):
```json
{
  "status": "success",
  "message": "ลบบทบาทผู้ใช้สำเร็จ",
  "data": {
    "count": 1
  }
}
```

Error (403):
```json
{
  "message": "You are not authorized to perform this action"
}
```

Error (500):
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

**cURL Example:**
```bash
curl -X DELETE https://online-election-project.onrender.com/auth/delete-role \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "userid": 3,
    "roleName": "ROLE_ADMIN"
  }'
```

---

### 8. ดึงรายชื่อจังหวัดทั้งหมด (Get Provinces)

**Endpoint:** `GET /auth/provinces`

**Description:** ดึงรายชื่อจังหวัดทั้งหมดในระบบ

**Authentication:** ไม่ต้องการ

**Response:**

Success (200):
```json
{
  "status": "success",
  "data": [
    "กรุงเทพมหานคร",
    "เชียงใหม่"
  ]
}
```

Error (500):
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

**cURL Example:**
```bash
curl -X GET https://online-election-project.onrender.com/auth/provinces
```

---

### 9. ดึงรายชื่ออำเภอตามจังหวัด (Get Districts)

**Endpoint:** `GET /auth/districts/:province`

**Description:** ดึงรายชื่ออำเภอทั้งหมดในจังหวัดที่ระบุ

**Authentication:** ไม่ต้องการ

**Path Parameters:**
- `province` (string) - ชื่อจังหวัด

**Example:** `GET /auth/districts/กรุงเทพมหานคร`

**Response:**

Success (200):
```json
{
  "status": "success",
  "data": [
    {
      "district": "บางรัก"
    },
    {
      "district": "คลองเตย"
    }
  ]
}
```

---

### 10. ดึงรายชื่อตำบลตามอำเภอ (Get Subdistricts)

**Endpoint:** `GET /auth/subdistricts/:district?province=xxx`

**Description:** ดึงรายชื่อตำบลทั้งหมดในอำเภอที่ระบุ

**Authentication:** ไม่ต้องการ

**Path Parameters:**
- `district` (string) - ชื่ออำเภอ

**Query Parameters:**
- `province` (string) - ชื่อจังหวัด (required)

**Example:** `GET /auth/subdistricts/คลองเตย?province=กรุงเทพมหานคร`

**Response:**

Success (200):
```json
{
  "status": "success",
  "data": [
    {
      "subdistrict": "คลองเตย"
    },
    {
      "subdistrict": "คลองตัน"
    }
  ]
}
```

---

### 11. ดึงหมายเลขเขตเลือกตั้ง (Get Constituency Number)

**Endpoint:** `GET /auth/constituencynumbers/:subdistrict?province=xxx&district=xxx`

**Description:** ดึงหมายเลขเขตเลือกตั้งตามตำบล

**Authentication:** ไม่ต้องการ

**Path Parameters:**
- `subdistrict` (string) - ชื่อตำบล

**Query Parameters:**
- `province` (string) - ชื่อจังหวัด (required)
- `district` (string) - ชื่ออำเภอ (required)

**Example:** `GET /auth/constituencynumbers/คลองเตย?province=กรุงเทพมหานคร&district=คลองเตย`

**Response:**

Success (200):
```json
{
  "status": "success",
  "data": {
    "consituencynumber": 1,
    "id": 5
  }
}
```

Error (500):
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

**cURL Example:**
```bash
curl -X GET "https://online-election-project.onrender.com/auth/constituencynumbers/คลองเตย?province=กรุงเทพมหานคร&district=คลองเตย"
```

---

## 🗳️ Vote APIs

Base Path: `/vote`

### 1. ลงคะแนนเลือกตั้ง (Submit Vote)

**Endpoint:** `POST /vote`

**Description:** ลงคะแนนเลือกตั้งให้กับผู้สมัคร

**Authentication:** Required (Bearer Token + Voter Role)

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Request Body:**
```json
{
  "userId": "number",           // ID ของผู้ใช้ (required)
  "consituencyId": "number",    // ID เขตเลือกตั้ง (required)
  "candidateId": "number"       // ID ผู้สมัคร (required)
}
```

**Response:**

Success (200):
```json
{
  "message": "บันทึกคะแนนเลือกตั้งสำเร็จ",
  "data": {
    "id": 1,
    "userId": 1,
    "consituencyId": 5,
    "candidateId": 3,
    "createdAt": "2026-02-09T10:30:00.000Z"
  }
}
```

Error (401 - ไม่ได้ล็อกอิน):
```json
{
  "message": "You are not logged in! Please log in to get access"
}
```

Error (401 - ไม่มี userId):
```json
{
  "message": "Unauthoized"
}
```

Error (403 - ไม่มีสิทธิ์):
```json
{
  "message": "You are not authorized to perform this action"
}
```

Error (400 - ยังไม่เปิดการเลือกตั้ง):
```json
{
  "message": "ขณะนี้ยังไม่อยู่ในช่วงเวลาการเลือกตั้ง ไม่สามารถลงคะแนนได้"
}
```

Error (400 - เขตเลือกตั้งปิดแล้ว):
```json
{
  "message": "เขตเลือกตั้งของคุณปิดหีบลงคะแนนแล้ว ไม่สามารถแก้ไขหรือลงคะแนนได้"
}
```

Error (400 - โหวตนอกเขต):
```json
{
  "message": "คุณไม่สามารถโหวตให้ผู้สมัครนอกเขตเลือกตั้งของคุณได้"
}
```

---

### 2. ดูประวัติการลงคะแนน (Get Vote History)

**Endpoint:** `GET /vote/:userId`

**Description:** ดูประวัติการลงคะแนนของผู้ใช้

**Authentication:** Required (Bearer Token)

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Path Parameters:**
- `userId` (number) - ID ของผู้ใช้

**Example:** `GET /vote/1`

**Response:**

Success (200):
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "userId": 1,
    "consituencyId": 5,
    "candidateId": 3,
    "createdAt": "2026-02-09T10:30:00.000Z",
    "candidate": {
      "id": 3,
      "name": "สมชาย รักชาติ",
      "partyId": 2
    }
  }
}
```

---

### 3. นับคะแนนเสียงตาม Candidate (Count Votes by Candidate)

**Endpoint:** `GET /vote/count/:candidateId`

**Description:** นับจำนวนคะแนนเสียงที่ผู้สมัครได้รับ

**Authentication:** ไม่ต้องการ

**Path Parameters:**
- `candidateId` (number) - ID ของผู้สมัคร

**Example:** `GET /vote/count/3`

**Response:**

Success (200):
```json
{
  "status": "success",
  "data": 245
}
```

**cURL Example:**
```bash
curl -X GET https://online-election-project.onrender.com/vote/count/3
```

---

### 4. นับคะแนนเสียงทั้งหมด (Count Total Votes)

**Endpoint:** `GET /vote/total/count`

**Description:** นับจำนวนคะแนนเสียงทั้งหมดในระบบ

**Authentication:** ไม่ต้องการ

**Response:**

Success (200):
```json
{
  "status": "success",
  "data": 15847
}
```

**cURL Example:**
```bash
curl -X GET https://online-election-project.onrender.com/vote/total/count
```

---

## 🏛️ Party APIs

Base Path: `/party`

### 1. สร้างพรรคการเมือง (Create Party)

**Endpoint:** `POST /party`

**Description:** สร้างพรรคการเมืองใหม่

**Authentication:** ไม่ต้องการ (แนะนำให้เพิ่ม Admin role)

**Request Body:**
```json
{
  "name": "string",           // ชื่อพรรค (required)
  "imageurl": "string",       // URL รูปภาพโลโก้พรรค (optional)
  "policy": "string"          // นโยบายพรรค (optional)
}
```

**Response:**

Success (201):
```json
{
  "id": 1,
  "name": "พรรคประชาธิปไตย",
  "imageurl": "https://example.com/logo.png",
  "policy": "นโยบายเพื่อประชาชน",
  "createdAt": "2026-02-09T10:30:00.000Z"
}
```

Error (400 - ชื่อซ้ำ):
```json
{
  "message": "พรรคการเมืองนี้มีอยู่ในระบบแล้ว"
}
```

Error (500):
```json
{
  "message": "เกิดข้อผิดพลาดในการสร้างพรรคการเมือง"
}
```

**cURL Example:**
```bash
curl -X POST https://online-election-project.onrender.com/party \
  -H "Content-Type: application/json" \
  -d '{
    "name": "พรรคประชาธิปไตย",
    "imageurl": "https://example.com/logo.png",
    "policy": "นโยบายเพื่อประชาชน"
  }'
```

---

### 2. ดึงรายชื่อพรรคทั้งหมด (Get All Parties)

**Endpoint:** `GET /party`

**Description:** ดึงรายชื่อพรรคการเมืองทั้งหมด

**Authentication:** ไม่ต้องการ

**Response:**

Success (200):
```json
[
  {
    "id": 1,
    "name": "พรรคประชาธิปไตย",
    "imageurl": "https://example.com/logo.png",
    "policy": "นโยบายเพื่อประชาชน",
    "createdAt": "2026-02-09T10:30:00.000Z"
  },
  {
    "id": 2,
    "name": "พรรคเพื่อไทย",
    "imageurl": null,
    "policy": null,
    "createdAt": "2026-02-09T11:00:00.000Z"
  }
]
```

Error (500):
```json
{
  "message": "เกิดข้อผิดพลาดในการดึงข้อมูลพรรคการเมือง"
}
```

**cURL Example:**
```bash
curl -X GET https://online-election-project.onrender.com/party
```

---

### 3. ดึงข้อมูลพรรคตาม ID (Get Party by ID)

**Endpoint:** `GET /party/:id`

**Description:** ดึงข้อมูลพรรคการเมืองตาม ID

**Authentication:** ไม่ต้องการ

**Path Parameters:**
- `id` (number) - ID ของพรรค

**Example:** `GET /party/1`

**Response:**

Success (200):
```json
{
  "id": 1,
  "name": "พรรคประชาธิปไตย",
  "imageurl": "https://example.com/logo.png",
  "policy": "นโยบายเพื่อประชาชน",
  "createdAt": "2026-02-09T10:30:00.000Z"
}
```

Error (404):
```json
{
  "message": "ไม่พบพรรคการเมืองที่ระบุ"
}
```

Error (500):
```json
{
  "message": "เกิดข้อผิดพลาดในการดึงข้อมูลพรรคการเมือง"
}
```

**cURL Example:**
```bash
curl -X GET https://online-election-project.onrender.com/party/1
```

---

### 4. แก้ไขข้อมูลพรรค (Update Party)

**Endpoint:** `PUT /party/:id`

**Description:** แก้ไขข้อมูลพรรคการเมือง

**Authentication:** ไม่ต้องการ (แนะนำให้เพิ่ม Admin role)

**Path Parameters:**
- `id` (number) - ID ของพรรค

**Request Body:**
```json
{
  "name": "string",           // ชื่อพรรค (required)
  "imageurl": "string",       // URL รูปภาพ (optional)
  "policy": "string"          // นโยบาย (optional)
}
```

**Example:** `PUT /party/1`

**Response:**

Success (200):
```json
{
  "id": 1,
  "name": "พรรคประชาธิปไตยใหม่",
  "imageurl": "https://example.com/new-logo.png",
  "policy": "นโยบายใหม่",
  "createdAt": "2026-02-09T10:30:00.000Z",
  "updatedAt": "2026-02-09T15:00:00.000Z"
}
```

Error (400):
```json
{
  "message": "ต้องระบุชื่อพรรคการเมือง"
}
```

Error (500):
```json
{
  "message": "เกิดข้อผิดพลาดในการอัปเดตพรรคการเมือง"
}
```

**cURL Example:**
```bash
curl -X PUT https://online-election-project.onrender.com/party/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "พรรคประชาธิปไตยใหม่",
    "imageurl": "https://example.com/new-logo.png",
    "policy": "นโยบายใหม่"
  }'
```

---

### 5. ลบพรรค (Delete Party)

**Endpoint:** `DELETE /party/:id`

**Description:** ลบพรรคการเมือง

**Authentication:** ไม่ต้องการ (แนะนำให้เพิ่ม Admin role)

**Path Parameters:**
- `id` (number) - ID ของพรรค

**Example:** `DELETE /party/1`

**Response:**

Success (204):
```
No Content
```

Error (400 - มีผู้สมัคร):
```json
{
  "message": "ไม่สามารถลบพรรคการเมืองได้ เนื่องจากมีผู้สมัครรับเลือกตั้ง"
}
```

Error (500):
```json
{
  "message": "เกิดข้อผิดพลาดในการลบพรรคการเมือง"
}
```

**cURL Example:**
```bash
curl -X DELETE https://online-election-project.onrender.com/party/1
```

---

## 🏅 Candidate APIs

Base Path: `/candidates`

### 1. สร้างผู้สมัครรับเลือกตั้ง (Create Candidate)

**Endpoint:** `POST /candidates`

**Description:** สร้างผู้สมัครรับเลือกตั้งใหม่

**Authentication:** ไม่ต้องการ (แนะนำให้เพิ่ม Admin role)

**Request Body:**
```json
{
  "candidatenumber": "number",        // หมายเลขผู้สมัคร (required)
  "firstname": "string",              // ชื่อจริง (required)
  "lastname": "string",               // นามสกุล (required)
  "imageurl": "string",               // URL รูปภาพผู้สมัคร (optional)
  "policy": "string",                 // นโยบายผู้สมัคร (optional)
  "consituencyId": "number",          // ID เขตเลือกตั้ง (required)
  "consituencyprovince": "string",    // จังหวัดเขตเลือกตั้ง (required)
  "partyId": "number"                 // ID พรรคการเมือง (required)
}
```

**Response:**

Success (201):
```json
{
  "id": 1,
  "candidatenumber": 1,
  "firstname": "สมชาย",
  "lastname": "รักชาติ",
  "imageurl": "https://example.com/candidate.jpg",
  "policy": "พัฒนาการศึกษาและสาธารณสุข",
  "consituencyId": 5,
  "consituencyprovince": "กรุงเทพมหานคร",
  "partyId": 2,
  "createdAt": "2026-02-09T10:30:00.000Z"
}
```

Error (400 - ข้อมูลไม่ครบ):
```json
{
  "message": "ข้อมูลผู้สมัครไม่ครบถ้วน"
}
```

Error (400 - เบอร์ซ้ำ):
```json
{
  "message": "เบอร์ผู้สมัครนี้มีอยู่ในเขตเลือกตั้ง"
}
```

Error (500):
```json
{
  "message": "ระบบไม่สามารถให้บริการได้ในขณะนี้ ขออภัย"
}
```

---

### 2. ดึงรายชื่อผู้สมัครทั้งหมด (Get All Candidates)

**Endpoint:** `GET /candidates`

**Description:** ดึงรายชื่อผู้สมัครทั้งหมด หรือกรองตามเขตเลือกตั้ง

**Authentication:** ไม่ต้องการ

**Query Parameters:**
- `consituencyId` (number, optional) - ID เขตเลือกตั้ง

**Example:**
- `GET /candidates` - ดึงผู้สมัครทั้งหมด
- `GET /candidates?consituencyId=5` - ดึงผู้สมัครในเขตเลือกตั้ง ID 5

**Response:**

Success (200):
```json
[
  {
    "id": 1,
    "candidatenumber": 1,
    "firstname": "สมชาย",
    "lastname": "รักชาติ",
    "imageurl": "https://example.com/candidate1.jpg",
    "policy": "พัฒนาการศึกษาและสาธารณสุข",
    "consituencyId": 5,
    "consituencyprovince": "กรุงเทพมหานคร",
    "partyId": 2,
    "createdAt": "2026-02-09T10:30:00.000Z",
    "party": {
      "id": 2,
      "name": "พรรคเพื่อไทย",
      "imageurl": "https://example.com/party2.png",
      "policy": "นโยบายพรรคเพื่อไทย"
    },
    "consituency": {
      "id": 5,
      "consituencynumber": 1,
      "provinceCode": "กรุงเทพมหานคร",
      "districtCode": "คลองเตย",
      "subdistrictCode": "คลองเตย",
      "zipcode": "10110"
    }
  },
  {
    "id": 2,
    "candidatenumber": 2,
    "firstname": "สมหญิง",
    "lastname": "ใจดี",
    "imageurl": null,
    "policy": null,
    "consituencyId": 5,
    "consituencyprovince": "กรุงเทพมหานคร",
    "partyId": 1,
    "createdAt": "2026-02-09T11:00:00.000Z",
    "party": {
      "id": 1,
      "name": "พรรคประชาธิปไตย",
      "imageurl": "https://example.com/party1.png",
      "policy": "นโยบายประชาธิปไตย"
    },
    "consituency": {
      "id": 5,
      "consituencynumber": 1,
      "provinceCode": "กรุงเทพมหานคร",
      "districtCode": "คลองเตย",
      "subdistrictCode": "คลองเตย",
      "zipcode": "10110"
    }
  }
]
```

Error (500):
```json
{
  "message": "ระบบไม่สามารถให้บริการได้ในขณะนี้"
}
```

**cURL Example:**
```bash
# Get all candidates
curl -X GET https://online-election-project.onrender.com/candidates

# Get candidates by constituency
curl -X GET "https://online-election-project.onrender.com/candidates?consituencyId=5"
```

**Endpoint:** `GET /candidates/:id`

**Description:** ดึงข้อมูลผู้สมัครรับเลือกตั้งตาม ID

**Authentication:** ไม่ต้องการ

**Path Parameters:**
- `id` (number) - ID ของผู้สมัคร

**Example:** `GET /candidates/1`

**Response:**

Success (200):
```json
{
  "id": 1,
  "candidatenumber": 1,
  "firstname": "สมชาย",
  "lastname": "รักชาติ",
  "imageurl": "https://example.com/candidate.jpg",
  "policy": "พัฒนาการศึกษาและสาธารณสุข",
  "consituencyId": 5,
  "consituencyprovince": "กรุงเทพมหานคร",
  "partyId": 2,
  "createdAt": "2026-02-09T10:30:00.000Z",
  "party": {
    "id": 2,
    "name": "พรรคเพื่อไทย",
    "imageurl": "https://example.com/party.png",
    "policy": "นโยบายพรรค"
  },
  "consituency": {
    "id": 5,
    "consituencynumber": 1,
    "provinceCode": "กรุงเทพมหานคร",
    "districtCode": "คลองเตย",
    "subdistrictCode": "คลองเตย",
    "zipcode": "10110"
  }
}
```

Error (400):
```json
{
  "message": "รหัสผู้สมัครไม่ถูกต้อง กรุณาใส่ตัวเลข"
}
```

Error (404):
```json
{
  "message": "ไม่พบผู้สมัครหมายเลข 1"
}
```

Error (500):
```json
{
  "message": "ระบบไม่สามารถให้บริการได้ในขณะนี้"
}
```

**cURL Example:**
```bash
curl -X GET https://online-election-project.onrender.com/candidates/1
```

---

### 4. แก้ไขข้อมูลผู้สมัคร (Update Candidate)

**Endpoint:** `PUT /candidates/:id`

**Description:** แก้ไขข้อมูลผู้สมัครรับเลือกตั้ง

**Authentication:** ไม่ต้องการ (แนะนำให้เพิ่ม Admin role)

**Path Parameters:**
- `id` (number) - ID ของผู้สมัคร

**Request Body:**
```json
{
  "candidatenumber": "number",
  "firstname": "string",
  "lastname": "string",
  "imageurl": "string",
  "policy": "string",
  "consituencyId": "number",
  "consituencyprovince": "string",
  "partyId": "number"
}
```

**Example:** `PUT /candidates/1`

**Response:**

Success (200):
```json
{
  "id": 1,
  "candidatenumber": 1,
  "firstname": "สมชาย",
  "lastname": "รักชาติใหม่",
  "imageurl": "https://example.com/new-candidate.jpg",
  "policy": "นโยบายใหม่",
  "consituencyId": 5,
  "consituencyprovince": "กรุงเทพมหานคร",
  "partyId": 2,
  "updatedAt": "2026-02-09T15:00:00.000Z"
}
```

Error (400 - ID ไม่ถูกต้อง):
```json
{
  "message": "เบอร์ผู้สมัครไม่ถูกต้อง กรุณาใส่ตัวเลข"
}
```

Error (404):
```json
{
  "message": "ไม่พบผู้สมัครที่ต้องการแก้ไข"
}
```

Error (400 - เบอร์ซ้ำ):
```json
{
  "message": "เบอร์ผู้สมัครนี้มีอยู่ในเขตเลือกตั้ง"
}
```

Error (500):
```json
{
  "message": "ไม่สามารถแก้ไขข้อมูลของผู้สมัครได้"
}
```

**cURL Example:**
```bash
curl -X PUT https://online-election-project.onrender.com/candidates/1 \
  -H "Content-Type: application/json" \
  -d '{
    "candidatenumber": 1,
    "firstname": "สมชาย",
    "lastname": "รักชาติใหม่",
    "imageurl": "https://example.com/new-candidate.jpg",
    "policy": "นโยบายใหม่สำหรับประชาชน",
    "consituencyId": 5,
    "consituencyprovince": "กรุงเทพมหานคร",
    "partyId": 2
  }'
```

---

### 5. ลบผู้สมัคร (Delete Candidate)

**Endpoint:** `DELETE /candidates/:id`

**Description:** ลบผู้สมัครรับเลือกตั้ง

**Authentication:** ไม่ต้องการ (แนะนำให้เพิ่ม Admin role)

**Path Parameters:**
- `id` (number) - ID ของผู้สมัคร

**Example:** `DELETE /candidates/1`

**Response:**

Success (200):
```json
{
  "message": "ลบผู้สมัครสำเร็จ",
  "data": {
    "id": 1,
    "candidatenumber": 1,
    "firstname": "สมชาย",
    "lastname": "รักชาติ",
    "consituencyId": 5,
    "partyId": 2
  }
}
```

Error (400):
```json
{
  "message": "รหัสผู้สมัครไม่ถูกต้อง กรุณาใส่ตัวเลข"
}
```

Error (404):
```json
{
  "message": "ไม่พบผู้สมัครที่ต้องการลบ"
}
```

Error (500):
```json
{
  "message": "ไม่สามารถลบข้อมูลผู้สมัครได้"
}
```

**cURL Example:**
```bash
curl -X DELETE https://online-election-project.onrender.com/candidates/1
```

---

## 🗺️ Constituency APIs

Base Path: `/constituencies`

### 1. ดึงรายชื่อเขตเลือกตั้งทั้งหมด (Get All Constituencies)

**Endpoint:** `GET /constituencies`

**Description:** ดึงรายชื่อเขตเลือกตั้งทั้งหมด หรือค้นหาตามเงื่อนไข

**Authentication:** ไม่ต้องการ

**Query Parameters (Optional):**
- `province` (string) - จังหวัด
- `district` (string) - อำเภอ
- `subdistrict` (string) - ตำบล
- `consituencynumber` (number) - หมายเลขเขต

**Example:**
- `GET /constituencies` - ดึงทั้งหมด
- `GET /constituencies?province=กรุงเทพมหานคร` - ค้นหาตามจังหวัด
- `GET /constituencies?province=กรุงเทพมหานคร&consituencynumber=1` - ค้นหาตามจังหวัดและเขต

**Response:**

Success (200):
```json
[
  {
    "id": 1,
    "consituencynumber": 1,
    "provinceCode": "กรุงเทพมหานคร",
    "districtCode": "คลองเตย",
    "subdistrictCode": "คลองเตย",
    "zipcode": "10110",
    "isclosed": false,
    "createdAt": "2026-02-09T10:30:00.000Z"
  },
  {
    "id": 2,
    "consituencynumber": 2,
    "provinceCode": "กรุงเทพมหานคร",
    "districtCode": "บางรัก",
    "subdistrictCode": "สีลม",
    "zipcode": "10500",
    "isclosed": false,
    "createdAt": "2026-02-09T10:35:00.000Z"
  }
]
```

Error (500):
```json
{
  "message": "ระบบไม่สามารให้บริการได้ในขณะนี้ ขออภัยในความไม่สะดวก"
}
```

**cURL Example:**
```bash
# Get all constituencies
curl -X GET https://online-election-project.onrender.com/constituencies

# Filter by province
curl -X GET "https://online-election-project.onrender.com/constituencies?province=กรุงเทพมหานคร"

# Filter by province and constituency number
curl -X GET "https://online-election-project.onrender.com/constituencies?province=กรุงเทพมหานคร&consituencynumber=1"
```

---

### 2. ดึงข้อมูลเขตเลือกตั้งตาม ID (Get Constituency by ID)

**Endpoint:** `GET /constituencies/:id`

**Description:** ดึงข้อมูลเขตเลือกตั้งตาม ID

**Authentication:** ไม่ต้องการ

**Path Parameters:**
- `id` (number) - ID ของเขตเลือกตั้ง

**Example:** `GET /constituencies/1`

**Response:**

Success (200):
```json
{
  "id": 1,
  "consituencynumber": 1,
  "provinceCode": "กรุงเทพมหานคร",
  "districtCode": "คลองเตย",
  "subdistrictCode": "คลองเตย",
  "zipcode": "10110",
  "isclosed": false,
  "createdAt": "2026-02-09T10:30:00.000Z"
}
```

Error (400):
```json
{
  "message": "รหัสเขตเลือกตั้งไม่ถูกต้อง กรุณาใส่ตัวเลข"
}
```

Error (404):
```json
{
  "message": "ไม่พบเขตเลือกตั้ง 1 ที่ท่านเลือก"
}
```

Error (500):
```json
{
  "message": "ระบบไม่สามารถให้บริการได้ในขณะนี้"
}
```

**cURL Example:**
```bash
curl -X GET https://online-election-project.onrender.com/constituencies/1
```

---

### 3. สร้างเขตเลือกตั้ง (Create Constituency)

**Endpoint:** `POST /constituencies`

**Description:** สร้างเขตเลือกตั้งใหม่

**Authentication:** ไม่ต้องการ (แนะนำให้เพิ่ม Admin role)

**Request Body:**
```json
{
  "consituencynumber": "number",    // หมายเลขเขต (required)
  "provinceCode": "string",         // จังหวัด (required)
  "districtCode": "string",         // อำเภอ (required)
  "subdistrictCode": "string",      // ตำบล (required)
  "zipcode": "string"               // รหัสไปรษณีย์ (required)
}
```

**Response:**

Success (201):
```json
{
  "id": 1,
  "consituencynumber": 1,
  "provinceCode": "กรุงเทพมหานคร",
  "districtCode": "คลองเตย",
  "subdistrictCode": "คลองเตย",
  "zipcode": "10110",
  "isclosed": true,
  "createdAt": "2026-02-09T10:30:00.000Z"
}
```

Error (400):
```json
{
  "message": "เขตเลือกตั้งนี้มีอยู่ในระบบแล้ว"
}
```

Error (500):
```json
{
  "message": "ระบบไม่สามารถให้บริการได้ในขณะนี้"
}
```

**cURL Example:**
```bash
curl -X POST https://online-election-project.onrender.com/constituencies \
  -H "Content-Type: application/json" \
  -d '{
    "consituencynumber": 1,
    "provinceCode": "กรุงเทพมหานคร",
    "districtCode": "คลองเตย",
    "subdistrictCode": "คลองเตย",
    "zipcode": "10110"
  }'
```

---

### 4. ลบเขตเลือกตั้ง (Delete Constituency)

**Endpoint:** `DELETE /constituencies/:id`

**Description:** ลบเขตเลือกตั้งออกจากระบบ

**Authentication:** ไม่ต้องการ (แนะนำให้เพิ่ม Admin role)

**Path Parameters:**
- `id` (number) - ID ของเขตเลือกตั้ง

**Example:** `DELETE /constituencies/1`

**Response:**

Success (200):
```json
{
  "status": "success",
  "message": "ลบเขตเลือกตั้งสำเร็จ",
  "data": {
    "id": 1,
    "consituencynumber": 1,
    "provinceCode": "กรุงเทพมหานคร",
    "districtCode": "คลองเตย",
    "subdistrictCode": "คลองเตย",
    "zipcode": "10110",
    "isclosed": false,
    "createdAt": "2026-02-09T10:30:00.000Z"
  }
}
```

Error (500):
```json
{
  "status": "error",
  "message": "มีผู้มีสิทธิ์เลือกตั้งในเขตเลือกตั้งนี้ อยู่ในระบบ ไม่สามารถลบได้"
}
```

**cURL Example:**
```bash
curl -X DELETE https://online-election-project.onrender.com/constituencies/1
```

---

### 5. เปิดการเลือกตั้งทุกเขต (Open All Constituencies)

**Endpoint:** `PUT /constituencies/open/all`

**Description:** เปิดการเลือกตั้งให้ทุกเขตเลือกตั้ง (isclosed = false)

**Authentication:** ไม่ต้องการ (แนะนำให้เพิ่ม Admin/ECT role)

**Response:**

Success (200):
```json
{
  "status": "success",
  "message": "เปิดการเลือกตั้งในทุกเขตเลือกตั้งสำเร็จ"
}
```

Error (500):
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

**cURL Example:**
```bash
curl -X PUT https://online-election-project.onrender.com/constituencies/open/all
```

---

### 6. ปิดการเลือกตั้งทุกเขต (Close All Constituencies)

**Endpoint:** `PUT /constituencies/close/all`

**Description:** ปิดการเลือกตั้งให้ทุกเขตเลือกตั้ง (isclosed = true)

**Authentication:** ไม่ต้องการ (แนะนำให้เพิ่ม Admin/ECT role)

**Response:**

Success (200):
```json
{
  "status": "success",
  "message": "ปิดการเลือกตั้งในทุกเขตเลือกตั้งสำเร็จ"
}
```

Error (500):
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

**cURL Example:**
```bash
curl -X PUT https://online-election-project.onrender.com/constituencies/close/all
```

---

### 7. เปิดการเลือกตั้งเขตเฉพาะ (Open Specific Constituency)

**Endpoint:** `PUT /constituencies/open/:id`

**Description:** เปิดการเลือกตั้งให้เขตเลือกตั้งที่ระบุ (isclosed = false)

**Authentication:** ไม่ต้องการ (แนะนำให้เพิ่ม Admin/ECT role)

**Path Parameters:**
- `id` (number) - ID ของเขตเลือกตั้ง

**Example:** `PUT /constituencies/open/1`

**Response:**

Success (200):
```json
{
  "status": "success",
  "message": "เปิดการเลือกตั้งเขตที่ 1 สำเร็จ"
}
```

Error (500):
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

**cURL Example:**
```bash
curl -X PUT https://online-election-project.onrender.com/constituencies/open/1
```

---

### 8. ปิดการเลือกตั้งเขตเฉพาะ (Close Specific Constituency)

**Endpoint:** `PUT /constituencies/close/:id`

**Description:** ปิดการเลือกตั้งให้เขตเลือกตั้งที่ระบุ (isclosed = true)

**Authentication:** ไม่ต้องการ (แนะนำให้เพิ่ม Admin/ECT role)

**Path Parameters:**
- `id` (number) - ID ของเขตเลือกตั้ง

**Example:** `PUT /constituencies/close/1`

**Response:**

Success (200):
```json
{
  "status": "success",
  "message": "ปิดการเลือกตั้งเขตที่ 1 สำเร็จ"
}
```

Error (500):
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

**cURL Example:**
```bash
curl -X PUT https://online-election-project.onrender.com/constituencies/close/1
```

---

## 📍 Location APIs

Base Path: `/locations`

### 1. ดึงรายชื่อจังหวัดทั้งหมด (Get Provinces)

**Endpoint:** `GET /locations/provinces`

**Description:** ดึงรายชื่อจังหวัดทั้งหมดในระบบ

**Authentication:** ไม่ต้องการ

**Response:**

Success (200):
```json
[
  {
    "code": "10",
    "nameTh": "กรุงเทพมหานคร",
    "nameEn": "Bangkok"
  },
  {
    "code": "50",
    "nameTh": "เชียงใหม่",
    "nameEn": "Chiang Mai"
  },
  {
    "code": "83",
    "nameTh": "ภูเก็ต",
    "nameEn": "Phuket"
  }
]
```

**cURL Example:**
```bash
curl -X GET https://online-election-project.onrender.com/locations/provinces
```

---

### 2. ดึงรายชื่ออำเภอตามจังหวัด (Get Districts)

**Endpoint:** `GET /locations/districts`

**Description:** ดึงรายชื่ออำเภอทั้งหมดในจังหวัดที่ระบุ

**Authentication:** ไม่ต้องการ

**Query Parameters:**
- `province` (string, required) - ชื่อจังหวัด

**Example:** `GET /locations/districts?province=กรุงเทพมหานคร`

**Response:**

Success (200):
```json
[
  {
    "code": "1001",
    "nameTh": "บางรัก",
    "nameEn": "Bang Rak",
    "provinceCode": "10"
  },
  {
    "code": "1002",
    "nameTh": "คลองเตย",
    "nameEn": "Khlong Toei",
    "provinceCode": "10"
  },
  {
    "code": "1003",
    "nameTh": "พญาไท",
    "nameEn": "Phaya Thai",
    "provinceCode": "10"
  }
]
```

Error (400):
```json
{
  "message": "ไม่พบจังหวัดที่ท่านเลือก กรุณาเลือกใหม่อีกครั้ง"
}
```

**cURL Example:**
```bash
curl -X GET "https://online-election-project.onrender.com/locations/districts?province=กรุงเทพมหานคร"
```

---

### 3. ดึงรายชื่อตำบลตามอำเภอ (Get Subdistricts)

**Endpoint:** `GET /locations/subdistricts`

**Description:** ดึงรายชื่อตำบลทั้งหมดในอำเภอที่ระบุ

**Authentication:** ไม่ต้องการ

**Query Parameters:**
- `province` (string, required) - ชื่อจังหวัด
- `district` (string, required) - ชื่ออำเภอ

**Example:** `GET /locations/subdistricts?province=กรุงเทพมหานคร&district=คลองเตย`

**Response:**

Success (200):
```json
[
  {
    "code": "100201",
    "nameTh": "คลองเตย",
    "nameEn": "Khlong Toei",
    "zipcode": "10110",
    "provinceCode": "10",
    "districtCode": "1002"
  },
  {
    "code": "100202",
    "nameTh": "คลองตัน",
    "nameEn": "Khlong Tan",
    "zipcode": "10110",
    "provinceCode": "10",
    "districtCode": "1002"
  },
  {
    "code": "100203",
    "nameTh": "พระโขนง",
    "nameEn": "Phra Khanong",
    "zipcode": "10260",
    "provinceCode": "10",
    "districtCode": "1002"
  }
]
```

Error (400):
```json
{
  "message": "ไม่พบจังหวัดและอำเภอที่ท่านระบุ กรุณาเลือกใหม่อีกครั้ง"
}
```

**cURL Example:**
```bash
curl -X GET "https://online-election-project.onrender.com/locations/subdistricts?province=กรุงเทพมหานคร&district=คลองเตย"
```

---

## 📤 Upload File APIs

Base Path: `/uploadfile`

### 1. อัพโหลดไฟล์ (Upload File)

**Endpoint:** `POST /uploadfile/uploads`

**Description:** อัพโหลดไฟล์ไปยัง storage (S3/MinIO)

**Authentication:** ไม่ต้องการ (แนะนำให้เพิ่ม authentication)

**Request Type:** `multipart/form-data`

**Form Data:**
- `file` (file) - ไฟล์ที่ต้องการอัพโหลด (required)

**Response:**

Success (200):
```json
{
  "status": "success",
  "message": "File uploaded successfully",
  "fileKey": "uploads/1707472800123-example.jpg"
}
```

Error (400 - ไม่ได้แนบไฟล์):
```json
{
  "message": "No file uploaded."
}
```

**cURL Example:**
```bash
curl -X POST https://online-election-project.onrender.com/uploadfile/uploads \
  -F "file=@/path/to/your/image.jpg"
```

Error (500):
```json
{
  "message": "Error uploading file."
}
```

---

### 2. ดึง Presigned URL (Get Presigned URL)

**Endpoint:** `GET /uploadfile/presignedUrl`

**Description:** ดึง presigned URL สำหรับเข้าถึงไฟล์ที่อัพโหลดไว้

**Authentication:** ไม่ต้องการ

**Query Parameters:**
- `key` (string, required) - file key ที่ได้จากการอัพโหลด

**Example:** `GET /uploadfile/presignedUrl?key=uploads/1707472800123-example.jpg`

**Response:**

Success (200):
```json
{
  "url": "https://s3.amazonaws.com/bucket/uploads/1707472800123-example.jpg?AWSAccessKeyId=...&Expires=...&Signature=..."
}
```

Error (400 - ไม่ระบุ key):
```json
{
  "message": "File key is required."
}
```

**cURL Example:**
```bash
curl -X GET "https://online-election-project.onrender.com/uploadfile/presignedUrl?key=uploads/1707472800123-example.jpg"
```

Error (500):
```json
{
  "message": "Error generating presigned URL."
}
```

---

## 🔑 Authorization & Roles

### User Roles
- `ROLE_VOTER` - ผู้มีสิทธิ์เลือกตั้ง (สามารถลงคะแนนได้)
- `ROLE_ADMIN` - ผู้ดูแลระบบ (จัดการข้อมูลทั้งหมด)
- `ROLE_ECT` - คณะกรรมการการเลือกตั้ง (จัดการการเลือกตั้ง)

### Authentication Header Format
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### JWT Token Structure
```json
{
  "nationalId": "1234567890123",
  "currentRole": "ROLE_VOTER",
  "consituencyId": 1,
  "iat": 1707472800,
  "exp": 1707559200
}
```

---

**Note:** The `/auth` endpoints for provinces, districts, subdistricts, and constituency numbers are legacy endpoints. Please use the `/locations` endpoints instead for better consistency.

---

## 📝 Common Response Status Codes

| Status Code | Description | ความหมาย |
|------------|-------------|----------|
| 200 | Success - GET, PUT, DELETE | สำเร็จ - สำหรับการดึงข้อมูล, แก้ไข, หรือลบ |
| 201 | Created - POST สำเร็จ | สร้างข้อมูลสำเร็จ |
| 204 | No Content - DELETE สำเร็จ | ลบสำเร็จ (ไม่มี response body) |
| 400 | Bad Request - ข้อมูลไม่ถูกต้อง | ข้อมูลที่ส่งมาไม่ถูกต้องหรือไม่ครบ |
| 401 | Unauthorized - ไม่ได้ล็อกอิน | ต้องเข้าสู่ระบบก่อน |
| 403 | Forbidden - ไม่มีสิทธิ์เข้าถึง | ไม่มีสิทธิ์ในการทำงานนี้ |
| 404 | Not Found - ไม่พบข้อมูล | ไม่พบข้อมูลที่ต้องการ |
| 500 | Internal Server Error - เกิดข้อผิดพลาดในเซิร์ฟเวอร์ | เกิดปัญหาในระบบ ต้องติดต่อ admin |

---

## 📞 API Response Format

### Success Response Format
```json
{
  "status": "success",
  "message": "Operation successful",
  "data": { /* your data here */ }
}
```

### Error Response Format
```json
{
  "status": "error",
  "message": "Error description in Thai"
}
```

หรือ

```json
{
  "message": "Error description in Thai"
}
```

---

## 🎯 Business Logic & Validation Rules

### Vote Validation Rules
1. ✅ ผู้ใช้ต้องล็อกอินและมี role ROLE_VOTER
2. ✅ ระบบต้องเปิดการเลือกตั้ง (electionsetting.isopen = true)
3. ✅ เขตเลือกตั้งต้องยังไม่ปิดหีบ (constituency.isclosed = false)
4. ✅ ผู้สมัครต้องอยู่ในเขตเดียวกับผู้ลงคะแนน
5. ✅ ผู้ใช้แต่ละคนสามารถลงคะแนนได้เพียงครั้งเดียว (upsert)

### Candidate Validation Rules
1. ✅ ต้องระบุ candidatenumber, firstname, lastname, consituencyId, partyId
2. ✅ candidatenumber ต้องไม่ซ้ำในเขตเลือกตั้งเดียวกัน
3. ✅ partyId ต้องมีอยู่ในระบบ
4. ✅ consituencyId ต้องมีอยู่ในระบบ

### Party Validation Rules
1. ✅ ต้องระบุชื่อพรรค (name)
2. ✅ ชื่อพรรคต้องไม่ซ้ำ
3. ✅ ไม่สามารถลบพรรคที่มีผู้สมัครแล้ว

### User Registration Rules
1. ✅ เลขบัตรประชาชนต้องไม่ซ้ำในระบบ
2. ✅ password และ confirmPassword ต้องตรงกัน
3. ✅ consituencyId ต้องมีอยู่ในระบบ
4. ✅ ทุกฟิลด์ที่ required ต้องกรอกครบถ้วน

---

## 📝 Common Response Status Codes

---

## 🧪 Testing with cURL Examples

### 1. Register
```bash
curl -X POST https://online-election-project.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nationalId": "1234567890123",
    "firstname": "สมชาย",
    "lastname": "ใจดี",
    "address": "123 ถนนสุขุมวิท",
    "province": "กรุงเทพมหานคร",
    "district": "คลองเตย",
    "subdistrict": "คลองเตย",
    "consituencyId": 1,
    "password": "Password123!",
    "confirmPassword": "Password123!"
  }'
```

### 2. Login
```bash
curl -X POST https://online-election-project.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "nationalId": "1234567890123",
    "password": "Password123!"
  }'
```

### 3. Get All Users (Admin)
```bash
curl -X GET https://online-election-project.onrender.com/auth/users \
  -H "Content-Type: application/json"
```

### 4. Get Profile (with token)
```bash
curl -X GET https://online-election-project.onrender.com/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 5. Add Role (Admin)
```bash
curl -X POST https://online-election-project.onrender.com/auth/add-role \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "userid": 3,
    "roleName": "ROLE_ADMIN"
  }'
```

### 6. Delete Role (Admin)
```bash
curl -X DELETE https://online-election-project.onrender.com/auth/delete-role \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "userid": 3,
    "roleName": "ROLE_ADMIN"
  }'
```

### 7. Submit Vote
```bash
curl -X POST https://online-election-project.onrender.com/vote \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "userId": 1,
    "consituencyId": 1,
    "candidateId": 3
  }'
```

### 8. Create Candidate
```bash
curl -X POST https://online-election-project.onrender.com/candidates \
  -H "Content-Type: application/json" \
  -d '{
    "candidatenumber": 1,
    "firstname": "สมชาย",
    "lastname": "รักชาติ",
    "imageurl": "https://example.com/candidate.jpg",
    "policy": "พัฒนาการศึกษา",
    "consituencyId": 5,
    "consituencyprovince": "กรุงเทพมหานคร",
    "partyId": 2
  }'
```

### 9. Get All Candidates (with filter)
```bash
curl -X GET "https://online-election-project.onrender.com/candidates?consituencyId=5" \
  -H "Content-Type: application/json"
```

### 10. Create Constituency
```bash
curl -X POST https://online-election-project.onrender.com/constituencies \
  -H "Content-Type: application/json" \
  -d '{
    "consituencynumber": 1,
    "provinceCode": "กรุงเทพมหานคร",
    "districtCode": "คลองเตย",
    "subdistrictCode": "คลองเตย",
    "zipcode": "10110"
  }'
```

### 11. Get Locations
```bash
# Get all provinces
curl -X GET https://online-election-project.onrender.com/locations/provinces

# Get districts by province
curl -X GET "https://online-election-project.onrender.com/locations/districts?province=กรุงเทพมหานคร"

# Get subdistricts
curl -X GET "https://online-election-project.onrender.com/locations/subdistricts?province=กรุงเทพมหานคร&district=คลองเตย"
```

### 12. Upload File
```bash
curl -X POST https://online-election-project.onrender.com/uploadfile/uploads \
  -F "file=@/path/to/your/image.jpg"
```

### 13. Get Presigned URL
```bash
curl -X GET "https://online-election-project.onrender.com/uploadfile/presignedUrl?key=uploads/1707472800123-example.jpg"
```

---

## 🧑‍💻 Common Workflows & Testing Scenarios

### Scenario 1: User Registration and Login Flow

**Step 1: Register a new user**
```bash
curl -X POST https://online-election-project.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nationalId": "1234567890123",
    "firstname": "สมชาย",
    "lastname": "ใจดี",
    "address": "123 ถนนสุขุมวิท",
    "province": "กรุงเทพมหานคร",
    "district": "คลองเตย",
    "subdistrict": "คลองเตย",
    "consituencyId": 1,
    "password": "Password123!",
    "confirmPassword": "Password123!"
  }'
```

**Step 2: Login with the credentials**
```bash
curl -X POST https://online-election-project.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "nationalId": "1234567890123",
    "password": "Password123!"
  }'
```

**Step 3: Save the token from response and use it for authenticated requests**
```bash
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET https://online-election-project.onrender.com/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

---

### Scenario 2: Complete Voting Flow

**Step 1: Get candidates in your constituency**
```bash
curl -X GET "https://online-election-project.onrender.com/candidates?consituencyId=1"
```

**Step 2: Submit your vote (requires authentication)**
```bash
curl -X POST https://online-election-project.onrender.com/vote \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "userId": 1,
    "consituencyId": 1,
    "candidateId": 3
  }'
```

**Step 3: Check your voting history**
```bash
curl -X GET https://online-election-project.onrender.com/vote/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

### Scenario 3: Admin - Setup Election Data

**Step 1: Create a political party**
```bash
curl -X POST https://online-election-project.onrender.com/party \
  -H "Content-Type: application/json" \
  -d '{
    "name": "พรรคประชาธิปไตย",
    "imageurl": "https://example.com/logo.png",
    "policy": "นโยบายเพื่อประชาชน"
  }'
```

**Step 2: Create a candidate**
```bash
curl -X POST https://online-election-project.onrender.com/candidates \
  -H "Content-Type: application/json" \
  -d '{
    "candidatenumber": 1,
    "firstname": "สมชาย",
    "lastname": "รักชาติ",
    "imageurl": "https://example.com/candidate.jpg",
    "policy": "พัฒนาการศึกษาและสาธารณสุข",
    "consituencyId": 1,
    "consituencyprovince": "กรุงเทพมหานคร",
    "partyId": 1
  }'
```

**Step 3: Upload candidate image**
```bash
curl -X POST https://online-election-project.onrender.com/uploadfile/uploads \
  -F "file=@/path/to/candidate-photo.jpg"
```

**Response will include fileKey:**
```json
{
  "status": "success",
  "message": "File uploaded successfully",
  "fileKey": "uploads/1707472800123-candidate-photo.jpg"
}
```

**Step 4: Get presigned URL to display the image**
```bash
curl -X GET "https://online-election-project.onrender.com/uploadfile/presignedUrl?key=uploads/1707472800123-candidate-photo.jpg"
```

---

## 💻 JavaScript/Frontend Examples

### Example 1: Register User with Fetch API

```javascript
async function registerUser(userData) {
  try {
    const response = await fetch('https://online-election-project.onrender.com/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nationalId: userData.nationalId,
        firstname: userData.firstname,
        lastname: userData.lastname,
        address: userData.address,
        province: userData.province,
        district: userData.district,
        subdistrict: userData.subdistrict,
        consituencyId: userData.consituencyId,
        password: userData.password,
        confirmPassword: userData.confirmPassword
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Registration successful:', data);
      return data;
    } else {
      console.error('Registration failed:', data.message);
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

---

### Example 2: Login and Store Token

```javascript
async function loginUser(nationalId, password) {
  try {
    const response = await fetch('https://online-election-project.onrender.com/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nationalId: nationalId,
        password: password
      })
    });

    const data = await response.json();

    if (response.ok) {
      // Store token in localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('Login successful:', data);
      return data;
    } else {
      console.error('Login failed:', data.message);
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

---

### Example 3: Submit Vote with Authentication

```javascript
async function submitVote(userId, consituencyId, candidateId) {
  const token = localStorage.getItem('authToken');

  if (!token) {
    throw new Error('กรุณาเข้าสู่ระบบก่อน');
  }

  try {
    const response = await fetch('https://online-election-project.onrender.com/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        userId: userId,
        consituencyId: consituencyId,
        candidateId: candidateId
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Vote submitted successfully:', data);
      return data;
    } else {
      console.error('Vote failed:', data.message);
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

---

### Example 4: Get Candidates by Constituency

```javascript
async function getCandidatesByConstituency(consituencyId) {
  try {
    const url = consituencyId
      ? `https://online-election-project.onrender.com/candidates?consituencyId=${consituencyId}`
      : 'https://online-election-project.onrender.com/candidates';

    const response = await fetch(url);
    const candidates = await response.json();

    if (response.ok) {
      console.log('Candidates:', candidates);
      return candidates;
    } else {
      throw new Error('Failed to fetch candidates');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

---

### Example 5: Upload File with Preview

```javascript
async function uploadFile(fileInput) {
  const file = fileInput.files[0];

  if (!file) {
    throw new Error('กรุณาเลือกไฟล์');
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('https://online-election-project.onrender.com/uploadfile/uploads', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      console.log('File uploaded:', data.fileKey);

      // Get presigned URL to display the image
      const urlResponse = await fetch(
        `https://online-election-project.onrender.com/uploadfile/presignedUrl?key=${data.fileKey}`
      );
      const urlData = await urlResponse.json();

      // Display the image
      document.getElementById('preview').src = urlData.url;

      return data.fileKey;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}
```

---

### Example 6: Get Location Data (Provinces, Districts, Subdistricts)

```javascript
// Get all provinces
async function getProvinces() {
  const response = await fetch('https://online-election-project.onrender.com/locations/provinces');
  return await response.json();
}

// Get districts by province
async function getDistricts(province) {
  const response = await fetch(
    `https://online-election-project.onrender.com/locations/districts?province=${encodeURIComponent(province)}`
  );
  return await response.json();
}

// Get subdistricts by province and district
async function getSubdistricts(province, district) {
  const response = await fetch(
    `https://online-election-project.onrender.com/locations/subdistricts?province=${encodeURIComponent(province)}&district=${encodeURIComponent(district)}`
  );
  return await response.json();
}

// Usage example
async function populateLocationDropdowns() {
  // Load provinces
  const provinces = await getProvinces();
  provinces.forEach(province => {
    const option = document.createElement('option');
    option.value = province.nameTh;
    option.textContent = province.nameTh;
    document.getElementById('provinceSelect').appendChild(option);
  });

  // When province is selected, load districts
  document.getElementById('provinceSelect').addEventListener('change', async (e) => {
    const districts = await getDistricts(e.target.value);
    const districtSelect = document.getElementById('districtSelect');
    districtSelect.innerHTML = '<option value="">เลือกอำเภอ</option>';

    districts.forEach(district => {
      const option = document.createElement('option');
      option.value = district.nameTh;
      option.textContent = district.nameTh;
      districtSelect.appendChild(option);
    });
  });

  // When district is selected, load subdistricts
  document.getElementById('districtSelect').addEventListener('change', async (e) => {
    const province = document.getElementById('provinceSelect').value;
    const subdistricts = await getSubdistricts(province, e.target.value);
    const subdistrictSelect = document.getElementById('subdistrictSelect');
    subdistrictSelect.innerHTML = '<option value="">เลือกตำบล</option>';

    subdistricts.forEach(subdistrict => {
      const option = document.createElement('option');
      option.value = subdistrict.nameTh;
      option.textContent = subdistrict.nameTh;
      subdistrictSelect.appendChild(option);
    });
  });
}
```

---

## 🔧 Environment Variables

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
JWT_SECRET="super-secret-election-key-2025"
PORT=3000
```

---

## ⚠️ Error Handling Best Practices

### 1. Always Check Response Status

```javascript
const response = await fetch(url, options);

if (!response.ok) {
  const error = await response.json();
  throw new Error(error.message || 'Something went wrong');
}

const data = await response.json();
```

### 2. Handle Network Errors

```javascript
try {
  const response = await fetch(url);
  // ... handle response
} catch (error) {
  if (error.name === 'TypeError') {
    console.error('Network error or CORS issue');
  } else {
    console.error('Error:', error.message);
  }
}
```

### 3. Token Expiration Handling

```javascript
async function makeAuthenticatedRequest(url, options = {}) {
  const token = localStorage.getItem('authToken');

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  });

  // If token expired (401), redirect to login
  if (response.status === 401) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
    throw new Error('Session expired. Please login again.');
  }

  return response;
}
```

### 4. Common Error Messages

| Error Code | Meaning | Action |
|------------|---------|--------|
| 400 | Bad Request - ข้อมูลไม่ถูกต้อง | ตรวจสอบข้อมูลที่ส่งไป |
| 401 | Unauthorized - ไม่ได้ล็อกอิน | เข้าสู่ระบบใหม่ |
| 403 | Forbidden - ไม่มีสิทธิ์ | ตรวจสอบ role ของผู้ใช้ |
| 404 | Not Found - ไม่พบข้อมูล | ตรวจสอบ ID หรือ URL |
| 500 | Internal Server Error | ลองใหม่หรือติดต่อ admin |

---

## 🔒 Security Best Practices

### 1. Never Store Sensitive Data in LocalStorage

```javascript
// ❌ DON'T DO THIS
localStorage.setItem('password', password);

// ✅ DO THIS - Only store tokens
localStorage.setItem('authToken', token);
```

### 2. Always Use HTTPS in Production

```javascript
const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://online-election-project.onrender.com'
  : 'http://localhost:3000';
```

### 3. Validate User Input Before Sending

```javascript
function validateNationalId(nationalId) {
  // ตรวจสอบว่าเป็นตัวเลข 13 หลัก
  const regex = /^\d{13}$/;
  return regex.test(nationalId);
}

function validatePassword(password) {
  // ต้องมีอย่างน้อย 8 ตัวอักษร ประกอบด้วยตัวพิมพ์เล็ก พิมพ์ใหญ่ และตัวเลข
  return password.length >= 8 &&
         /[a-z]/.test(password) &&
         /[A-Z]/.test(password) &&
         /[0-9]/.test(password);
}
```

### 4. Clear User Data on Logout

```javascript
function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  // Redirect to login page
  window.location.href = '/login.html';
}
```

---

## 📊 Rate Limiting & Performance Tips

### 1. Debounce Search Requests

```javascript
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Usage
const searchCandidates = debounce(async (query) => {
  const response = await fetch(`/candidates?search=${query}`);
  // ... handle response
}, 300);
```

### 2. Cache Static Data

```javascript
// Cache provinces in memory since they rarely change
let provincesCache = null;

async function getProvinces() {
  if (provincesCache) {
    return provincesCache;
  }

  const response = await fetch('/locations/provinces');
  provincesCache = await response.json();
  return provincesCache;
}
```

### 3. Use Pagination for Large Lists

```javascript
// When API supports pagination
async function getCandidates(page = 1, limit = 20) {
  const response = await fetch(`/candidates?page=${page}&limit=${limit}`);
  return await response.json();
}
```

---

## 🧪 Testing with Postman

### Import Collection

You can create a Postman collection with these environment variables:

**Variables:**
- `baseUrl`: `https://online-election-project.onrender.com`
- `token`: (set after login)

**Pre-request Script for Authenticated Endpoints:**
```javascript
pm.request.headers.add({
  key: 'Authorization',
  value: 'Bearer ' + pm.environment.get('token')
});
```

**Test Script to Save Token After Login:**
```javascript
if (pm.response.code === 200) {
  const response = pm.response.json();
  if (response.token) {
    pm.environment.set('token', response.token);
  }
}
```

---

## 🌐 CORS Configuration

If you're developing a frontend application, make sure CORS is properly configured on the server:

```javascript
// Server should allow these origins
Access-Control-Allow-Origin: http://localhost:5173 (or your frontend URL)
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## 📝 API Versioning

Current API Version: **v1** (no version prefix in URL)

Future versions will follow the pattern:
- `/api/v2/auth/login`
- `/api/v2/candidates`

For now, all endpoints use no version prefix.

---

## 🔧 Environment Variables

---

## 📮 Contact & Support

สำหรับข้อสงสัยหรือปัญหาเกี่ยวกับ API กรุณาติดต่อทีม Backend Developer

**Version:** 2.1.0
**Last Updated:** March 23, 2026

---

## 📝 Changelog

### Version 2.1.0 (March 23, 2026)
- 📝 เพิ่มตัวอย่าง Response สำหรับ error cases ทุกเส้น API
- 📝 เพิ่ม error responses สำหรับ Vote API (election closed, constituency closed, voting outside constituency)
- 💻 เพิ่ม JavaScript/Frontend Examples พร้อม code snippets สำหรับทุก use case
- ⚠️ เพิ่มส่วน Error Handling Best Practices
- 🔒 เพิ่มส่วน Security Best Practices
- 📊 เพิ่มส่วน Rate Limiting & Performance Tips
- 🧪 เพิ่มคู่มือการใช้งาน Postman
- 🌐 เพิ่มข้อมูล CORS Configuration
- 📋 เพิ่มตาราง API Endpoints Summary ที่หน้าแรก
- 🧑‍💻 เพิ่ม Common Workflows & Testing Scenarios
- 📝 เพิ่ม cURL examples สำหรับทุก endpoint
- ✨ ปรับปรุงโครงสร้างเอกสารให้อ่านง่ายและครบถ้วนยิ่งขึ้น

### Version 2.0.0 (March 20, 2026)
- ✨ เพิ่ม Candidate APIs - จัดการผู้สมัครรับเลือกตั้ง
- ✨ เพิ่ม Location APIs - ดึงข้อมูลจังหวัด อำเภอ ตำบล
- ✨ เพิ่ม Upload File APIs - อัพโหลดไฟล์และดึง presigned URL
- 🔄 เปลี่ยน Constituency base path จาก `/constituency` เป็น `/constituencies`
- 🔄 เพิ่มความสามารถในการค้นหาเขตเลือกตั้งด้วย query parameters
- 📝 เพิ่มตัวอย่าง response ให้ครบทุก endpoint

### Version 1.0.0 (February 9, 2026)
- 🎉 เวอร์ชั่นแรก - Authentication, Vote, Party, Constituency APIs
