-- CreateTable
CREATE TABLE "favorite" (
    "id" SERIAL NOT NULL,
    "id_user" INTEGER NOT NULL,
    "id_favorite" INTEGER NOT NULL,

    CONSTRAINT "favorite_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_id_favorite_fkey" FOREIGN KEY ("id_favorite") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
