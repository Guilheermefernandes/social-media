/*
  Warnings:

  - A unique constraint covering the columns `[indentifier]` on the table `inscriptions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "inscriptions_indentifier_key" ON "inscriptions"("indentifier");
