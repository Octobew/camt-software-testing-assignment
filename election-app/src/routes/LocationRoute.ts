import express from "express";
import * as service from "../services/LocationService";

const router = express.Router();


router.get("/provinces", async (_req, res) => {
  const data = await service.listProvinces();
  res.json(data);
});

router.get("/districts", async (req, res) => {
  const province = String(req.query.province || "");
  if (!province) {
    return res.status(400).json({ message: "ไม่พบจังหวัดที่ท่านเลือก กรุณาเลือกใหม่อีกครั้ง" });
  }
  const data = await service.listDistrictsByProvince(province);
  res.json(data);
});

router.get("/subdistricts", async (req, res) => {
  const province = String(req.query.province || "");
  const district = String(req.query.district || "");

  if (!province || !district) {
    return res.status(400).json({ message: "ไม่พบจังหวัดและอำเภอที่ท่านระบุ กรุณาเลือกใหม่อีกครั้ง" });
  }

  const data = await service.listSubdistricts(province, district);
  res.json(data);
});



export default router;
