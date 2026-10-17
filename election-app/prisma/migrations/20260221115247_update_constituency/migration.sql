/*
  Warnings:

  - You are about to drop the column `district` on the `consituency` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `consituency` table. All the data in the column will be lost.
  - You are about to drop the column `subdistrict` on the `consituency` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `consituency` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `districtCode` to the `consituency` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provinceCode` to the `consituency` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subdistrictCode` to the `consituency` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex

DROP INDEX IF EXISTS "consituency_province_consituencynumber_key";

-- AlterTable
ALTER TABLE "consituency" DROP COLUMN "district",
DROP COLUMN "province",
DROP COLUMN "subdistrict",
ADD COLUMN     "districtCode" TEXT NOT NULL,
ADD COLUMN     "provinceCode" TEXT NOT NULL,
ADD COLUMN     "subdistrictCode" TEXT NOT NULL;

-- AlterTable
-- ALTER TABLE "party" ADD COLUMN     "color" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "consituency_id_key" ON "consituency"("id");

-- AddForeignKey
ALTER TABLE "consituency" ADD CONSTRAINT "consituency_provinceCode_fkey" FOREIGN KEY ("provinceCode") REFERENCES "province"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consituency" ADD CONSTRAINT "consituency_districtCode_fkey" FOREIGN KEY ("districtCode") REFERENCES "district"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consituency" ADD CONSTRAINT "consituency_subdistrictCode_fkey" FOREIGN KEY ("subdistrictCode") REFERENCES "subdistrict"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
