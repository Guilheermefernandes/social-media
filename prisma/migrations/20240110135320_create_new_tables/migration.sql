-- CreateTable
CREATE TABLE "posts" (
    "id" SERIAL NOT NULL,
    "id_user" INTEGER NOT NULL,
    "describe" TEXT NOT NULL,
    "date_created" TEXT NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "images_posts" (
    "id" SERIAL NOT NULL,
    "image_indentifier" TEXT NOT NULL,
    "id_user" INTEGER NOT NULL,
    "id_post" INTEGER NOT NULL,

    CONSTRAINT "images_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments_post" (
    "id" SERIAL NOT NULL,
    "id_user" INTEGER NOT NULL,
    "id_post" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "date_created" TEXT NOT NULL,

    CONSTRAINT "comments_post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "like_comment_post" (
    "id" SERIAL NOT NULL,
    "id_user" INTEGER NOT NULL,
    "id_post" INTEGER NOT NULL,
    "id_comment" INTEGER NOT NULL,

    CONSTRAINT "like_comment_post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_comment_post" (
    "id" SERIAL NOT NULL,
    "id_post" INTEGER NOT NULL,
    "id_comment" INTEGER NOT NULL,
    "id_user" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "date_created" TEXT NOT NULL,

    CONSTRAINT "sub_comment_post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sub_like_comments_post" (
    "id" SERIAL NOT NULL,
    "id_post" INTEGER NOT NULL,
    "id_comment" INTEGER NOT NULL,
    "id_sub_comment" INTEGER NOT NULL,
    "id_user" INTEGER NOT NULL,

    CONSTRAINT "Sub_like_comments_post_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images_posts" ADD CONSTRAINT "images_posts_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images_posts" ADD CONSTRAINT "images_posts_id_post_fkey" FOREIGN KEY ("id_post") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments_post" ADD CONSTRAINT "comments_post_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments_post" ADD CONSTRAINT "comments_post_id_post_fkey" FOREIGN KEY ("id_post") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "like_comment_post" ADD CONSTRAINT "like_comment_post_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "like_comment_post" ADD CONSTRAINT "like_comment_post_id_post_fkey" FOREIGN KEY ("id_post") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "like_comment_post" ADD CONSTRAINT "like_comment_post_id_comment_fkey" FOREIGN KEY ("id_comment") REFERENCES "comments_post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_comment_post" ADD CONSTRAINT "sub_comment_post_id_post_fkey" FOREIGN KEY ("id_post") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_comment_post" ADD CONSTRAINT "sub_comment_post_id_comment_fkey" FOREIGN KEY ("id_comment") REFERENCES "comments_post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_comment_post" ADD CONSTRAINT "sub_comment_post_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sub_like_comments_post" ADD CONSTRAINT "Sub_like_comments_post_id_post_fkey" FOREIGN KEY ("id_post") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sub_like_comments_post" ADD CONSTRAINT "Sub_like_comments_post_id_comment_fkey" FOREIGN KEY ("id_comment") REFERENCES "comments_post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sub_like_comments_post" ADD CONSTRAINT "Sub_like_comments_post_id_sub_comment_fkey" FOREIGN KEY ("id_sub_comment") REFERENCES "sub_comment_post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sub_like_comments_post" ADD CONSTRAINT "Sub_like_comments_post_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
