-- AlterTable
ALTER TABLE "inscriptions" ALTER COLUMN "receiver_following_since" DROP NOT NULL,
ALTER COLUMN "request_following_since" DROP NOT NULL;
