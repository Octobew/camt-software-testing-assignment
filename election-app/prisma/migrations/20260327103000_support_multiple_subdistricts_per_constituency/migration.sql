{
  "id": 1,
  "provinceCode": "50",
  "provinceNameTh": "เชียงใหม่",
  "provinceNameEn": "Chiang Mai",
  "districtCode": "5001",
  "districtNameTh": "เมืองเชียงใหม่",
  "districtNameEn": "Mueang Chiang Mai",
  "consituencynumber": 1,
  "zipcode": "50200",
  "isclosed": false,
  "subdistrictCodes": ["500101", "500107"],
  "subdistrictNames": ["สุเทพ", "ศรีภูมิ"],
  "subdistricts": [
    {
      "code": "500101",
      "nameTh": "สุเทพ",
      "nameEn": "Suthep",
      "zipcode": "50200",
      "provinceCode": "50",
      "districtCode": "5001"
    }
  ]
}-- CreateTable
CREATE TABLE "consituencySubdistrict" (
    "consituencyId" INTEGER NOT NULL,
    "subdistrictCode" TEXT NOT NULL,

    CONSTRAINT "consituencySubdistrict_pkey" PRIMARY KEY ("consituencyId", "subdistrictCode")
);

-- Migrate existing constituency-to-subdistrict assignments
INSERT INTO "consituencySubdistrict" ("consituencyId", "subdistrictCode")
SELECT "id", "subdistrictCode"
FROM "consituency";

-- DropIndex
DROP INDEX "consituency_provinceCode_districtCode_subdistrictCode_idx";

-- DropIndex
DROP INDEX "consituency_provinceCode_districtCode_subdistrictCode_key";

-- AlterTable
ALTER TABLE "consituency" DROP COLUMN "subdistrictCode";

-- CreateIndex
CREATE UNIQUE INDEX "consituencySubdistrict_subdistrictCode_key" ON "consituencySubdistrict"("subdistrictCode");

-- CreateIndex
CREATE INDEX "consituencySubdistrict_consituencyId_idx" ON "consituencySubdistrict"("consituencyId");

-- CreateIndex
CREATE INDEX "consituency_provinceCode_districtCode_idx" ON "consituency"("provinceCode", "districtCode");

-- AddForeignKey
ALTER TABLE "consituencySubdistrict" ADD CONSTRAINT "consituencySubdistrict_consituencyId_fkey" FOREIGN KEY ("consituencyId") REFERENCES "consituency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consituencySubdistrict" ADD CONSTRAINT "consituencySubdistrict_subdistrictCode_fkey" FOREIGN KEY ("subdistrictCode") REFERENCES "subdistrict"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
