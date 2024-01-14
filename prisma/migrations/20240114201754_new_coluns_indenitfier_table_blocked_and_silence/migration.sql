/*
  Warnings:

  - A unique constraint covering the columns `[indentifier]` on the table `blocked` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[indentifier]` on the table `silence` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `indentifier` to the `blocked` table without a default value. This is not possible if the table is not empty.
  - Added the required column `indentifier` to the `silence` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "blocked" ADD COLUMN     "indentifier" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "silence" ADD COLUMN     "indentifier" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "blocked_indentifier_key" ON "blocked"("indentifier");

-- CreateIndex
CREATE UNIQUE INDEX "silence_indentifier_key" ON "silence"("indentifier");
