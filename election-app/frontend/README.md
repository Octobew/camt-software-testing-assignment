# Frontend - ระบบเลือกตั้งออนไลน์

## 📋 ภาพรวม
ระบบ Frontend สำหรับการเลือกตั้งออนไลน์ ที่เชื่อมต่อกับ Production API: `https://online-election-project.onrender.com/`

---

## 🔄 ระบบ Cascade Selection (จังหวัด → อำเภอ → ตำบล → เขตเลือกตั้ง)

### การทำงานของระบบ:

#### 1. **เลือกจังหวัด** 
```
เมื่อผู้ใช้เลือกจังหวัด → เรียก API: /auth/districts/{province}
```
- ระบบจะดึงข้อมูลอำเภอทั้งหมดในจังหวัดที่เลือก
- Dropdown อำเภอจะเปิดใช้งาน (disabled = false)
- Dropdown ตำบลและเขตเลือกตั้งจะถูก reset และปิดการใช้งาน

**ตัวอย่างการเรียก API:**
```javascript
GET /auth/districts/กรุงเทพมหานคร

Response:
{
  "status": "success",
  "data": [
    { "district": "บางรัก" },
    { "district": "คลองเตย" },
    ...
  ]
}
```

#### 2. **เลือกอำเภอ**
```
เมื่อผู้ใช้เลือกอำเภอ → เรียก API: /auth/subdistricts/{district}?province={province}
```
- ระบบจะดึงข้อมูลตำบลทั้งหมดในอำเภอที่เลือก
- Dropdown ตำบลจะเปิดใช้งาน
- เขตเลือกตั้งจะถูก reset

**ตัวอย่างการเรียก API:**
```javascript
GET /auth/subdistricts/คลองเตย?province=กรุงเทพมหานคร

Response:
{
  "status": "success",
  "data": [
    { "subdistrict": "คลองเตย" },
    { "subdistrict": "คลองตัน" },
    ...
  ]
}
```

#### 3. **เลือกตำบล**
```
เมื่อผู้ใช้เลือกตำบล → เรียก API: /auth/constituencynumbers/{subdistrict}?province={province}&district={district}
```
- ระบบจะดึงข้อมูลหมายเลขเขตเลือกตั้ง (Constituency ID)
- แสดงในช่อง "เขตเลือกตั้ง (ID)" อัตโนมัติ
- แสดง Alert แจ้งเขตเลือกตั้ง

**ตัวอย่างการเรียก API:**
```javascript
GET /auth/constituencynumbers/คลองเตย?province=กรุงเทพมหานคร&district=คลองเตย

Response:
{
  "status": "success",
  "data": {
    "consituencynumber": 1,
    "id": 5
  }
}
```

---

## 🎯 ฟังก์ชันสำคัญใน script.js

### 1. `loadProvinces()`
- โหลดจังหวัดทั้งหมดจาก API
- เรียกใช้เมื่อเปิดหน้าเว็บครั้งแรก

### 2. `loadDistricts()`
- โหลดอำเภอตามจังหวัดที่เลือก
- เปิด/ปิด dropdown อัตโนมัติ
- Reset ข้อมูลตำบลและเขตเลือกตั้ง

### 3. `loadSubdistricts()`
- โหลดตำบลตามอำเภอและจังหวัดที่เลือก
- เปิด/ปิด dropdown อัตโนมัติ
- Reset ข้อมูลเขตเลือกตั้ง

### 4. `loadConstituencyNumber()`
- โหลดหมายเลขเขตเลือกตั้ง
- แสดงข้อมูลอัตโนมัติในช่อง readonly

---

## 💡 Features เพิ่มเติม

### Loading State
- แสดงข้อความ "กำลังโหลด..." ขณะดึงข้อมูล
- ปิดการใช้งาน dropdown ระหว่างโหลด

### Error Handling
- แสดง Alert เมื่อเกิดข้อผิดพลาด
- แสดงข้อความเมื่อไม่พบข้อมูล

### User Experience
- Disable dropdown จนกว่าจะเลือกข้อมูลก่อนหน้า
- แสดงคำแนะนำใต้แต่ละช่อง (small text)
- แสดงเครื่องหมาย * สีแดงสำหรับช่องที่จำเป็น

### Validation
- เลขบัตรประชาชน: ต้องเป็นตัวเลข 13 หลัก
- รหัสผ่าน: ต้องมีอย่างน้อย 6 ตัวอักษร
- ตรวจสอบรหัสผ่านตรงกันก่อน submit

---

## 📱 การใช้งาน

1. เปิดไฟล์ `index.html` ในเบราว์เซอร์
2. คลิกปุ่ม "ลงทะเบียน"
3. กรอกข้อมูลส่วนตัว
4. **เลือกจังหวัด** → รอระบบโหลดอำเภอ
5. **เลือกอำเภอ** → รอระบบโหลดตำบล
6. **เลือกตำบล** → ระบบจะแสดงเขตเลือกตั้งอัตโนมัติ
7. กรอกที่อยู่และรหัสผ่าน
8. กดปุ่ม "ลงทะเบียน"

---

## 🔍 การ Debug

### เปิด Console ใน Browser (F12)
ระบบจะแสดง log การทำงาน:
```
✅ โหลดข้อมูล 50 อำเภอในจังหวัดกรุงเทพมหานคร
✅ โหลดข้อมูล 12 ตำบลในอำเภอคลองเตย
✅ เขตเลือกตั้ง: กรุงเทพมหานคร เขตที่ 1 (ID: 5)
```

### ตรวจสอบ Network Tab
- ดูคำขอ API ทั้งหมด
- ตรวจสอบ Response จาก Server
- ดู Status Code และข้อความ Error

---

## 🎨 UI/UX Features

- **Responsive Design**: รองรับทุกขนาดหน้าจอ
- **Beautiful Gradient**: สีสวยงามและทันสมัย
- **Smooth Animation**: ทุกการเปลี่ยนหน้ามี fade effect
- **Alert System**: แจ้งเตือนผลการทำงานชัดเจน
- **Modal Dialogs**: ใช้งานง่าย ไม่รกหน้าจอ

---

## 🚀 Production URL
```
https://online-election-project.onrender.com/
```

---

## 📞 ติดต่อ
หากมีปัญหาการใช้งาน กรุณาติดต่อทีมพัฒนา
