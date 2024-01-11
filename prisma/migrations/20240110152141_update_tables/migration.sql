/*
  Warnings:

  - Changed the type of `date_created` on the `comments_post` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `date_created` on the `posts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `date_created` on the `sub_comment_post` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "comments_post" DROP COLUMN "date_created",
ADD COLUMN     "date_created" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "date_created",
ADD COLUMN     "date_created" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "sub_comment_post" DROP COLUMN "date_created",
ADD COLUMN     "date_created" TIMESTAMP(3) NOT NULL;
