/*
  Warnings:

  - You are about to drop the column `followed_since` on the `inscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `following_since` on the `inscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `followers` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `following` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `publication` on the `users` table. All the data in the column will be lost.
  - Added the required column `receiver_following_since` to the `inscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `request_following_since` to the `inscriptions` table without a default value. This is not possible if the table is not empty.
  - Made the column `timestamp` on table `posts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "inscriptions" DROP COLUMN "followed_since",
DROP COLUMN "following_since",
ADD COLUMN     "receiver_following_since" BIGINT NOT NULL,
ADD COLUMN     "request_following_since" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "timestamp" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "followers",
DROP COLUMN "following",
DROP COLUMN "publication";
