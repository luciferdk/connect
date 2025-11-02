/*
  Warnings:

  - Added the required column `nickname` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "nickname" TEXT NOT NULL;
