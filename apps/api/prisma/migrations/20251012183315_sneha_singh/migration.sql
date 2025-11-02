/*
  Warnings:

  - You are about to drop the column `nickname` on the `Contact` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Contact" DROP COLUMN "nickname",
ADD COLUMN     "nickName" TEXT;
