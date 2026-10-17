/*
  Warnings:

  - A unique constraint covering the columns `[partyId,consituencyId]` on the table `candidate` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "candidate_partyId_consituencyId_key" ON "candidate"("partyId", "consituencyId");
