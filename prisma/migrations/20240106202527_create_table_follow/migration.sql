-- CreateTable
CREATE TABLE "Inscriptions" (
    "id" SERIAL NOT NULL,
    "id_request" INTEGER NOT NULL,
    "id_receiver" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "Inscriptions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Inscriptions" ADD CONSTRAINT "Inscriptions_id_request_fkey" FOREIGN KEY ("id_request") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscriptions" ADD CONSTRAINT "Inscriptions_id_receiver_fkey" FOREIGN KEY ("id_receiver") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
