/*
  Warnings:

  - You are about to drop the column `status` on the `Inscriptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Inscriptions" DROP COLUMN "status",
ADD COLUMN     "accept_receiver" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "accept_request" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "send_receiver" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "send_request" BOOLEAN NOT NULL DEFAULT false;
