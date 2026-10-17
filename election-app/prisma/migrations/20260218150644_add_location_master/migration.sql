-- AlterTable
ALTER TABLE "consituency" ALTER COLUMN "isclosed" SET DEFAULT false;

-- CreateTable
CREATE TABLE "province" (
    "code" TEXT NOT NULL,
    "nameTh" TEXT NOT NULL,
    "nameEn" TEXT,
    "isActive" BOOLEAN NOT NULL,

    CONSTRAINT "province_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "district" (
    "code" TEXT NOT NULL,
    "nameTh" TEXT NOT NULL,
    "nameEn" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "provinceCode" TEXT NOT NULL,

    CONSTRAINT "district_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "subdistrict" (
    "code" TEXT NOT NULL,
    "nameTh" TEXT NOT NULL,
    "nameEn" TEXT,
    "zipcode" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "provinceCode" TEXT NOT NULL,
    "districtCode" TEXT NOT NULL,

    CONSTRAINT "subdistrict_pkey" PRIMARY KEY ("code")
);

-- CreateIndex
CREATE INDEX "province_nameTh_idx" ON "province"("nameTh");

-- CreateIndex
CREATE INDEX "district_provinceCode_idx" ON "district"("provinceCode");

-- CreateIndex
CREATE INDEX "district_nameTh_idx" ON "district"("nameTh");

-- CreateIndex
CREATE UNIQUE INDEX "district_provinceCode_nameTh_key" ON "district"("provinceCode", "nameTh");

-- CreateIndex
CREATE INDEX "subdistrict_provinceCode_districtCode_idx" ON "subdistrict"("provinceCode", "districtCode");

-- CreateIndex
CREATE INDEX "subdistrict_districtCode_idx" ON "subdistrict"("districtCode");

-- CreateIndex
CREATE INDEX "subdistrict_nameTh_idx" ON "subdistrict"("nameTh");

-- CreateIndex
CREATE UNIQUE INDEX "subdistrict_districtCode_nameTh_key" ON "subdistrict"("districtCode", "nameTh");

-- AddForeignKey
ALTER TABLE "district" ADD CONSTRAINT "district_provinceCode_fkey" FOREIGN KEY ("provinceCode") REFERENCES "province"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subdistrict" ADD CONSTRAINT "subdistrict_provinceCode_fkey" FOREIGN KEY ("provinceCode") REFERENCES "province"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subdistrict" ADD CONSTRAINT "subdistrict_districtCode_fkey" FOREIGN KEY ("districtCode") REFERENCES "district"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
