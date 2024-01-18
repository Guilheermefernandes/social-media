/*
  Warnings:

  - You are about to drop the column `receiver_following_since` on the `inscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `request_following_since` on the `inscriptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "inscriptions" DROP COLUMN "receiver_following_since",
DROP COLUMN "request_following_since",
ADD COLUMN     "receiver_request" BIGINT,
ADD COLUMN     "request_receiver" BIGINT;
