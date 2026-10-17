/*
  Warnings:

  - A unique constraint covering the columns `[province,consituencynumber,subdistrict,district]` on the table `consituency` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "consituency_province_consituencynumber_key";

-- AlterTable
ALTER TABLE "party" ADD COLUMN     "color" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "consituency_province_consituencynumber_subdistrict_district_key" ON "consituency"("province", "consituencynumber", "subdistrict", "district");
