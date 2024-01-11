/*
  Warnings:

  - You are about to drop the `Sub_like_comments_post` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `disposition_status` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Sub_like_comments_post" DROP CONSTRAINT "Sub_like_comments_post_id_comment_fkey";

-- DropForeignKey
ALTER TABLE "Sub_like_comments_post" DROP CONSTRAINT "Sub_like_comments_post_id_post_fkey";

-- DropForeignKey
ALTER TABLE "Sub_like_comments_post" DROP CONSTRAINT "Sub_like_comments_post_id_sub_comment_fkey";

-- DropForeignKey
ALTER TABLE "Sub_like_comments_post" DROP CONSTRAINT "Sub_like_comments_post_id_user_fkey";

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "disposition_status" BOOLEAN NOT NULL;

-- DropTable
DROP TABLE "Sub_like_comments_post";

-- CreateTable
CREATE TABLE "sub_like_comments_post" (
    "id" SERIAL NOT NULL,
    "id_post" INTEGER NOT NULL,
    "id_comment" INTEGER NOT NULL,
    "id_sub_comment" INTEGER NOT NULL,
    "id_user" INTEGER NOT NULL,

    CONSTRAINT "sub_like_comments_post_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sub_like_comments_post" ADD CONSTRAINT "sub_like_comments_post_id_post_fkey" FOREIGN KEY ("id_post") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_like_comments_post" ADD CONSTRAINT "sub_like_comments_post_id_comment_fkey" FOREIGN KEY ("id_comment") REFERENCES "comments_post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_like_comments_post" ADD CONSTRAINT "sub_like_comments_post_id_sub_comment_fkey" FOREIGN KEY ("id_sub_comment") REFERENCES "sub_comment_post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_like_comments_post" ADD CONSTRAINT "sub_like_comments_post_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
