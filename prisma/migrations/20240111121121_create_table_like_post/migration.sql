-- CreateTable
CREATE TABLE "like_post" (
    "id" SERIAL NOT NULL,
    "id_post" INTEGER NOT NULL,
    "id_user" INTEGER NOT NULL,

    CONSTRAINT "like_post_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "like_post" ADD CONSTRAINT "like_post_id_post_fkey" FOREIGN KEY ("id_post") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "like_post" ADD CONSTRAINT "like_post_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
