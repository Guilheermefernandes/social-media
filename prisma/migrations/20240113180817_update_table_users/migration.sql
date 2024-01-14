-- AlterTable
ALTER TABLE "users" ADD COLUMN     "archive_account" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;
