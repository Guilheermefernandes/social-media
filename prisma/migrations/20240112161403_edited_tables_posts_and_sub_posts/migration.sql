-- AlterTable
ALTER TABLE "comments_post" ADD COLUMN     "comment_edited" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "release_date" TEXT;

-- AlterTable
ALTER TABLE "sub_comment_post" ADD COLUMN     "comment_edited" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "release_date" TEXT;
