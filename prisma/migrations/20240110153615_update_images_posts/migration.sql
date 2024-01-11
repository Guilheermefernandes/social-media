/*
  Warnings:

  - Added the required column `order` to the `images_posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "images_posts" ADD COLUMN     "order" INTEGER NOT NULL;
