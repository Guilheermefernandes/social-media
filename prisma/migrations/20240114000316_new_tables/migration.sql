-- CreateTable
CREATE TABLE "blocked" (
    "id" SERIAL NOT NULL,
    "id_user" INTEGER NOT NULL,
    "id_blocked" INTEGER NOT NULL,

    CONSTRAINT "blocked_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "silence" (
    "id" SERIAL NOT NULL,
    "id_user" INTEGER NOT NULL,
    "id_silence" INTEGER NOT NULL,

    CONSTRAINT "silence_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "blocked" ADD CONSTRAINT "blocked_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocked" ADD CONSTRAINT "blocked_id_blocked_fkey" FOREIGN KEY ("id_blocked") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "silence" ADD CONSTRAINT "silence_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "silence" ADD CONSTRAINT "silence_id_silence_fkey" FOREIGN KEY ("id_silence") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
