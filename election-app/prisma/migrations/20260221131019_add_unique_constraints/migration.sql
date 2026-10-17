/*
  Warnings:

  - A unique constraint covering the columns `[provinceCode,consituencynumber]` on the table `consituency` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[provinceCode,districtCode,subdistrictCode]` on the table `consituency` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "consituency_provinceCode_districtCode_subdistrictCode_idx" ON "consituency"("provinceCode", "districtCode", "subdistrictCode");

-- CreateIndex
CREATE UNIQUE INDEX "consituency_provinceCode_consituencynumber_key" ON "consituency"("provinceCode", "consituencynumber");

-- CreateIndex
CREATE UNIQUE INDEX "consituency_provinceCode_districtCode_subdistrictCode_key" ON "consituency"("provinceCode", "districtCode", "subdistrictCode");
