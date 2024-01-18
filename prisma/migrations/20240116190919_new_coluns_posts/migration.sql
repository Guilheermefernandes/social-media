-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "edited" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "edition_date" TEXT;
