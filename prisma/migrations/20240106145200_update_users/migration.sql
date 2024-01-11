-- AlterTable
ALTER TABLE "users" ADD COLUMN     "followers" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "following" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "private_account" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publication" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "web_site_link" TEXT;
