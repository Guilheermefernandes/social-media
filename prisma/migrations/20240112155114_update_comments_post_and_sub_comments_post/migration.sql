-- AlterTable
ALTER TABLE "comments_post" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "sub_comment_post" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;
