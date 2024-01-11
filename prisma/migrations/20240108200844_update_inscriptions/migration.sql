/*
  Warnings:

  - You are about to drop the `Inscriptions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Inscriptions" DROP CONSTRAINT "Inscriptions_id_receiver_fkey";

-- DropForeignKey
ALTER TABLE "Inscriptions" DROP CONSTRAINT "Inscriptions_id_request_fkey";

-- DropTable
DROP TABLE "Inscriptions";

-- CreateTable
CREATE TABLE "inscriptions" (
    "id" SERIAL NOT NULL,
    "id_request" INTEGER NOT NULL,
    "id_receiver" INTEGER NOT NULL,
    "send_receiver" BOOLEAN NOT NULL DEFAULT true,
    "accept_receiver" BOOLEAN NOT NULL DEFAULT false,
    "send_request" BOOLEAN NOT NULL DEFAULT false,
    "accept_request" BOOLEAN NOT NULL DEFAULT false,
    "indentifier" TEXT NOT NULL,

    CONSTRAINT "inscriptions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "inscriptions" ADD CONSTRAINT "inscriptions_id_request_fkey" FOREIGN KEY ("id_request") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscriptions" ADD CONSTRAINT "inscriptions_id_receiver_fkey" FOREIGN KEY ("id_receiver") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
