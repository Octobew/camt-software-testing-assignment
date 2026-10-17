-- CreateEnum
CREATE TYPE "RoleName" AS ENUM ('ROLE_ADMIN', 'ROLE_VOTER', 'ROLE_ECT');

-- CreateTable
CREATE TABLE "electionsetting" (
    "id" SERIAL NOT NULL,
    "electionname" TEXT NOT NULL,
    "startdate" TIMESTAMP(3) NOT NULL,
    "enddate" TIMESTAMP(3) NOT NULL,
    "starttime" TEXT NOT NULL,
    "endtime" TEXT NOT NULL,
    "isopen" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "electionsetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "nationalId" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "imageurl" TEXT,
    "address" TEXT NOT NULL,
    "subdistrict" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "consituencyID" INTEGER NOT NULL,
    "isactive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "usersId" INTEGER NOT NULL,
    "roleName" "RoleName" NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consituency" (
    "id" SERIAL NOT NULL,
    "province" TEXT NOT NULL,
    "consituencynumber" INTEGER NOT NULL,
    "subdistrict" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "isclosed" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "consituency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "party" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "imageurl" TEXT,
    "policy" TEXT,

    CONSTRAINT "party_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidate" (
    "id" SERIAL NOT NULL,
    "candidatenumber" INTEGER NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "imageurl" TEXT,
    "policy" TEXT,
    "consituencyId" INTEGER NOT NULL,
    "consituencyprovince" TEXT NOT NULL,
    "partyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vote" (
    "id" SERIAL NOT NULL,
    "usersId" INTEGER NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_nationalId_key" ON "users"("nationalId");

-- CreateIndex
CREATE UNIQUE INDEX "role_usersId_roleName_key" ON "role"("usersId", "roleName");

-- CreateIndex
CREATE UNIQUE INDEX "consituency_province_consituencynumber_key" ON "consituency"("province", "consituencynumber");

-- CreateIndex
CREATE UNIQUE INDEX "party_name_key" ON "party"("name");

-- CreateIndex
CREATE UNIQUE INDEX "candidate_candidatenumber_consituencyId_key" ON "candidate"("candidatenumber", "consituencyId");

-- CreateIndex
CREATE UNIQUE INDEX "vote_usersId_key" ON "vote"("usersId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_consituencyID_fkey" FOREIGN KEY ("consituencyID") REFERENCES "consituency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role" ADD CONSTRAINT "role_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate" ADD CONSTRAINT "candidate_consituencyId_fkey" FOREIGN KEY ("consituencyId") REFERENCES "consituency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate" ADD CONSTRAINT "candidate_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "party"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote" ADD CONSTRAINT "vote_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote" ADD CONSTRAINT "vote_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
